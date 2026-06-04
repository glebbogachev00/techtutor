-- Run in Supabase SQL editor.
-- Adds cheat_unlocked flag to profiles (set by secret unlock code).

alter table public.profiles
  add column if not exists cheat_unlocked boolean default false;
