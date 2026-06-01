-- =============================================================
-- TechTutor Portal — Database Schema
-- Run this in the Supabase SQL editor (one-time setup).
-- Project: bcjmswzubfyjcdgwowfb
-- =============================================================

-- ----- profiles --------------------------------------------------
-- Extends auth.users with role + display info.
-- Each block is self-contained so re-running is safe.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('student', 'parent', 'tutor', 'teacher', 'admin');
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'teacher'
  ) then
    alter type user_role add value 'teacher';
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'admin'
  ) then
    alter type user_role add value 'admin';
  end if;
end$$;

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

-- ----- classes / class_codes / class_members --------------------
-- A teacher owns classes. Each class has rotating short codes that
-- students use to join (no email required — anonymous auth).
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.class_codes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  code text unique not null,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists class_codes_active_idx
  on public.class_codes (code) where active;

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  joined_via_code text,
  primary key (class_id, student_id)
);

-- ----- Row Level Security ---------------------------------------
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.missions enable row level security;
alter table public.submissions enable row level security;
alter table public.progress enable row level security;
alter table public.classes enable row level security;
alter table public.class_codes enable row level security;
alter table public.class_members enable row level security;

-- Drop existing policies so this script is re-runnable.
drop policy if exists "profiles_select_self" on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;
drop policy if exists "tracks_read_all" on public.tracks;
drop policy if exists "missions_read_all" on public.missions;
drop policy if exists "tracks_admin_all" on public.tracks;
drop policy if exists "missions_admin_all" on public.missions;
drop policy if exists "submissions_owner" on public.submissions;
drop policy if exists "submissions_parent_read" on public.submissions;
drop policy if exists "progress_owner" on public.progress;
drop policy if exists "progress_parent_read" on public.progress;
drop policy if exists "classes_owner_all" on public.classes;
drop policy if exists "classes_member_read" on public.classes;
drop policy if exists "class_codes_owner_all" on public.class_codes;
drop policy if exists "class_members_teacher_read" on public.class_members;
drop policy if exists "class_members_self_read" on public.class_members;

-- Profiles: read your own, parents read their kid, staff read all.
create policy "profiles_select_self" on public.profiles
  for select using (
    auth.uid() = id
    or auth.uid() = parent_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','teacher','admin'))
  );
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- Tracks + missions: anyone signed in can read.
create policy "tracks_read_all" on public.tracks for select using (auth.role() = 'authenticated');
create policy "missions_read_all" on public.missions for select using (auth.role() = 'authenticated');
create policy "tracks_admin_all" on public.tracks for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','teacher','admin'))
);
create policy "missions_admin_all" on public.missions for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','teacher','admin'))
);

-- Submissions: own + parents (read) + staff (all).
create policy "submissions_owner" on public.submissions
  for all using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','teacher','admin'))
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
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','teacher','admin'))
  );
create policy "progress_parent_read" on public.progress
  for select using (
    exists (select 1 from public.profiles p
            where p.id = progress.user_id and p.parent_id = auth.uid())
  );

-- ----- Classes RLS ----------------------------------------------
-- Teachers manage their own classes; admins see all.
create policy "classes_owner_all" on public.classes
  for all using (
    teacher_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
-- Students can read classes they belong to.
create policy "classes_member_read" on public.classes
  for select using (
    exists (select 1 from public.class_members m
            where m.class_id = classes.id and m.student_id = auth.uid())
  );

-- Class codes: teacher-only direct access. Students join via RPC.
create policy "class_codes_owner_all" on public.class_codes
  for all using (
    exists (
      select 1 from public.classes c
      where c.id = class_codes.class_id
        and (c.teacher_id = auth.uid()
             or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    )
  );

-- Class members: teacher sees roster; student sees own row.
create policy "class_members_teacher_read" on public.class_members
  for select using (
    exists (
      select 1 from public.classes c
      where c.id = class_members.class_id
        and (c.teacher_id = auth.uid()
             or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    )
  );
create policy "class_members_self_read" on public.class_members
  for select using (student_id = auth.uid());

-- ----- RPC: join_class_with_code --------------------------------
-- Students call this after signing in (anonymous or email). Avoids
-- exposing class_codes lookup to unauthenticated users.
create or replace function public.join_class_with_code(
  p_code text,
  p_display_name text default null
)
returns table(class_id uuid, class_name text)
language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_class_id uuid;
  v_class_name text;
  v_clean_code text;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  v_clean_code := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  if length(v_clean_code) < 4 then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;

  select cc.class_id, cls.name
    into v_class_id, v_class_name
  from public.class_codes cc
  join public.classes cls on cls.id = cc.class_id
  where cc.code = v_clean_code
    and cc.active
    and (cc.expires_at is null or cc.expires_at > now())
  limit 1;

  if v_class_id is null then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;

  if p_display_name is not null and length(trim(p_display_name)) > 0 then
    update public.profiles
      set full_name = trim(p_display_name),
          role = case when role in ('teacher','admin','tutor') then role else 'student' end
      where id = v_user_id;
  end if;

  insert into public.class_members (class_id, student_id, joined_via_code)
  values (v_class_id, v_user_id, v_clean_code)
  on conflict do nothing;

  return query select v_class_id, v_class_name;
end;
$$;

grant execute on function public.join_class_with_code(text, text) to authenticated, anon;

-- ----- RPC: generate_class_code helper --------------------------
-- Random code like "BA3-7F2K" (no ambiguous 0/O/1/I).
create or replace function public.generate_class_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..7 loop
    if i = 4 then
      result := result || '-';
    end if;
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return result;
end;
$$;

-- ----- RPC: rotate_class_code -----------------------------------
create or replace function public.rotate_class_code(p_class_id uuid)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_code text;
  v_owner uuid;
  v_attempt int := 0;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  select teacher_id into v_owner from public.classes where id = p_class_id;
  if v_owner is null then
    raise exception 'class_not_found' using errcode = 'P0002';
  end if;
  if v_owner <> v_user_id and not exists (
    select 1 from public.profiles p where p.id = v_user_id and p.role = 'admin'
  ) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  update public.class_codes set active = false where class_id = p_class_id and active;

  loop
    v_attempt := v_attempt + 1;
    v_code := public.generate_class_code();
    begin
      insert into public.class_codes (class_id, code) values (p_class_id, v_code);
      exit;
    exception when unique_violation then
      if v_attempt > 10 then raise; end if;
    end;
  end loop;

  return v_code;
end;
$$;

grant execute on function public.rotate_class_code(uuid) to authenticated;

-- ----- RPC: create_class ----------------------------------------
create or replace function public.create_class(p_name text)
returns table(id uuid, name text, code text)
language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_class_id uuid;
  v_code text;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = v_user_id and p.role in ('teacher','admin')
  ) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'invalid_name' using errcode = 'P0001';
  end if;

  insert into public.classes (teacher_id, name)
  values (v_user_id, trim(p_name))
  returning classes.id into v_class_id;

  v_code := public.rotate_class_code(v_class_id);

  return query select v_class_id, trim(p_name), v_code;
end;
$$;

grant execute on function public.create_class(text) to authenticated;
