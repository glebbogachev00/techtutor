-- Tracks which lessons a student has completed and XP earned
create table if not exists public.lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  program_slug text not null,
  lesson_slug  text not null,
  xp_earned    int not null default 0,
  completed_at timestamptz not null default now(),
  unique (user_id, program_slug, lesson_slug)
);

alter table public.lesson_progress enable row level security;

create policy "Users read own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);
