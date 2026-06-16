-- =============================================================
-- Migration: schedule_bookings table
-- Run in Supabase SQL editor.
-- Date: 2026-06-16
-- =============================================================

create table if not exists public.schedule_bookings (
  id              uuid primary key default gen_random_uuid(),
  parent_name     text not null,
  student_name    text not null,
  email           text not null,
  phone           text not null,
  class_type      text not null check (class_type in ('one_on_one', 'group_solo', 'group_plus')),
  slot_start      timestamptz not null,
  slot_end        timestamptz not null,
  notes           text,
  status          text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at      timestamptz not null default now()
);

create index if not exists schedule_bookings_slot_idx
  on public.schedule_bookings (slot_start, slot_end);

create index if not exists schedule_bookings_status_idx
  on public.schedule_bookings (status, created_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.schedule_bookings enable row level security;

-- Anyone (including unauthenticated) can insert a booking request
create policy "schedule_bookings_public_insert"
  on public.schedule_bookings
  for insert
  to anon, authenticated
  with check (true);

-- Only service role can read/update/delete (admin access via service key)
-- No select policy for anon/authenticated — service role bypasses RLS
