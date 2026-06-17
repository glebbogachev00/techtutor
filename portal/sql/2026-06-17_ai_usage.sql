-- Run in Supabase SQL editor.
-- Per-user daily AI message budget so kids can iterate freely within a lesson
-- but can't burn through the free-tier token pool. Iterating is the skill we
-- teach, so the cap is generous (a normal lesson won't hit it).

create table if not exists public.ai_usage (
  user_id    uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  message_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.ai_usage enable row level security;

-- Users can read their own usage (e.g. to show "X messages left today").
drop policy if exists "ai_usage_select_own" on public.ai_usage;
create policy "ai_usage_select_own"
  on public.ai_usage for select
  using (auth.uid() = user_id);

-- Atomically bump today's counter and return the new value. SECURITY DEFINER so
-- the increment can't be tampered with from the client; writes go only through
-- this function.
create or replace function public.increment_ai_usage(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into public.ai_usage (user_id, usage_date, message_count)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date)
  do update set message_count = public.ai_usage.message_count + 1
  returning message_count into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_ai_usage(uuid) to authenticated;
