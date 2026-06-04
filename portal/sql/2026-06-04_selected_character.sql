-- Run in Supabase SQL editor.
-- Adds selected_character to profiles table.

alter table public.profiles
  add column if not exists selected_character text default 'captain-pixel';
