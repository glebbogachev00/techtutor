-- Run in Supabase SQL editor.

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

drop policy if exists "users read own achievements" on public.user_achievements;
create policy "users read own achievements"
  on public.user_achievements
  for select
  using (auth.uid() = user_id);

drop policy if exists "users insert own achievements" on public.user_achievements;
create policy "users insert own achievements"
  on public.user_achievements
  for insert
  with check (auth.uid() = user_id);
