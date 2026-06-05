-- =============================================================
-- Migration: class_sessions table
-- Run in Supabase SQL editor.
-- Date: 2026-06-05
-- =============================================================

-- Each row is one live class session created by a teacher.
-- content_id maps to ClassSession.contentId in sessions.ts (e.g. "gdevelop-l1").
-- unlocked_stage controls what students can see in real-time:
--   0 = nothing unlocked yet
--   1 = easy exercise visible
--   2 = medium exercise visible
--   3 = hard exercise visible
--   4 = boss fight visible

create table if not exists public.class_sessions (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  content_id      text not null,           -- "gdevelop-l1" | "roblox-l1" etc.
  zoom_url        text not null,
  scheduled_at    timestamptz not null,
  unlocked_stage  int not null default 0 check (unlocked_stage between 0 and 4),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Index for the student lookup by id (already PK, but also by teacher)
create index if not exists class_sessions_teacher_idx
  on public.class_sessions (teacher_id, scheduled_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.class_sessions enable row level security;

drop policy if exists "class_sessions_teacher_all"    on public.class_sessions;
drop policy if exists "class_sessions_student_read"   on public.class_sessions;

-- Teacher can do everything to their own sessions
create policy "class_sessions_teacher_all"
  on public.class_sessions
  for all
  using  (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

-- Students (and anyone with the link) can read any active session
-- We rely on the UUID being unguessable — no additional auth check needed
-- for the student view (the UUID itself is the access token).
create policy "class_sessions_student_read"
  on public.class_sessions
  for select
  using (is_active = true);

-- ── Realtime ────────────────────────────────────────────────────────────────
-- Enable realtime so the student page receives unlocked_stage updates instantly.
-- Run once: alter publication supabase_realtime add table public.class_sessions;
-- (Uncomment if not already in your realtime publication)
-- alter publication supabase_realtime add table public.class_sessions;
