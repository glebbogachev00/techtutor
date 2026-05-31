-- =============================================================
-- TechTutor Portal — Database Schema
-- Run this in the Supabase SQL editor (one-time setup).
-- Project: bcjmswzubfyjcdgwowfb
-- =============================================================

-- ----- profiles --------------------------------------------------
-- Extends auth.users with role + display info.
create type if not exists user_role as enum ('student', 'parent', 'tutor');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text,
  avatar_emoji text default '🚀',
  language text not null default 'en',
  parent_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----- tracks ----------------------------------------------------
create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_vn text not null,
  description_en text,
  description_vn text,
  icon text default '💻',
  sort_order int not null default 0
);

-- ----- missions --------------------------------------------------
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks(id) on delete cascade,
  slug text not null,
  sort_order int not null,
  language text not null check (language in ('html', 'python')),
  title_en text not null,
  title_vn text not null,
  brief_en text not null,
  brief_vn text not null,
  starter_code text not null default '',
  expected_outcome text not null,
  xp_reward int not null default 50,
  created_at timestamptz not null default now(),
  unique (track_id, slug)
);

-- ----- submissions ----------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  code text not null,
  status text not null check (status in ('pending', 'passed', 'needs_work')),
  ai_feedback text,
  created_at timestamptz not null default now()
);

-- ----- progress -------------------------------------------------
create table if not exists public.progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  completed_at timestamptz not null default now(),
  xp_earned int not null default 0,
  primary key (user_id, mission_id)
);

create or replace view public.xp_totals as
select user_id, coalesce(sum(xp_earned), 0)::int as total_xp
from public.progress
group by user_id;

-- ----- Row Level Security ---------------------------------------
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.missions enable row level security;
alter table public.submissions enable row level security;
alter table public.progress enable row level security;

-- Profiles: read your own, parents read their kid, tutors read all.
create policy "profiles_select_self" on public.profiles
  for select using (
    auth.uid() = id
    or auth.uid() = parent_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'tutor')
  );
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- Tracks + missions: anyone signed in can read.
create policy "tracks_read_all" on public.tracks for select using (auth.role() = 'authenticated');
create policy "missions_read_all" on public.missions for select using (auth.role() = 'authenticated');
create policy "tracks_admin_all" on public.tracks for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'tutor')
);
create policy "missions_admin_all" on public.missions for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'tutor')
);

-- Submissions: own + parents (read) + tutors (all).
create policy "submissions_owner" on public.submissions
  for all using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'tutor')
  );
create policy "submissions_parent_read" on public.submissions
  for select using (
    exists (select 1 from public.profiles p
            where p.id = submissions.user_id and p.parent_id = auth.uid())
  );

-- Progress: same as submissions.
create policy "progress_owner" on public.progress
  for all using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'tutor')
  );
create policy "progress_parent_read" on public.progress
  for select using (
    exists (select 1 from public.profiles p
            where p.id = progress.user_id and p.parent_id = auth.uid())
  );
