-- Run in Supabase SQL editor AFTER 2026-06-02_achievements.sql
-- Adds PIN-based student identity so the same student account is recovered
-- on any device using:  name + class code + PIN

-- 1. Add pin column to class_members (nullable for existing anonymous rows).
alter table public.class_members
  add column if not exists pin text,
  add column if not exists display_name text;

-- 2. Unique constraint: one name per class (case-insensitive) so two "Glebs"
--    can't exist in the same class. Use a unique index so we can drop it later.
create unique index if not exists class_members_class_name_unique
  on public.class_members (class_id, lower(display_name))
  where display_name is not null;

-- 3. Service-role function: teacher adds a student → creates Supabase auth
--    user with a fabricated email and the PIN as password, inserts into
--    class_members, returns the generated PIN.
--
--    IMPORTANT: this function runs as SECURITY DEFINER so it can call
--    auth.users via the service role. Grant it to authenticated only.

create or replace function public.teacher_add_student(
  p_class_id  uuid,
  p_name      text
)
returns table (out_pin text, out_student_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_teacher_id  uuid := auth.uid();
  v_role        text;
  v_class_owner uuid;
  v_pin         text;
  v_email       text;
  v_code        text;
  v_user_id     uuid;
  v_attempts    int := 0;
begin
  -- Only teachers/admins can call this.
  select role into v_role from public.profiles where id = v_teacher_id;
  if v_role not in ('teacher', 'admin') then
    raise exception 'forbidden';
  end if;

  -- Class must belong to this teacher (admins bypass).
  select teacher_id into v_class_owner from public.classes where id = p_class_id;
  if v_class_owner is null then
    raise exception 'class_not_found';
  end if;
  if v_role <> 'admin' and v_class_owner <> v_teacher_id then
    raise exception 'forbidden';
  end if;

  -- Name must not already exist in this class.
  if exists (
    select 1 from public.class_members
    where class_id = p_class_id
      and lower(display_name) = lower(p_name)
  ) then
    raise exception 'duplicate_name';
  end if;

  -- Get the active class code for the fabricated email.
  select code into v_code
  from public.class_codes
  where class_id = p_class_id and active = true
  limit 1;

  if v_code is null then
    raise exception 'no_active_code';
  end if;

  -- Generate a unique 4-digit PIN (retry on collision, max 20 tries).
  loop
    v_pin := lpad(floor(random() * 9000 + 1000)::int::text, 4, '0');
    exit when not exists (
      select 1 from public.class_members
      where class_id = p_class_id and pin = v_pin
    );
    v_attempts := v_attempts + 1;
    if v_attempts > 20 then
      raise exception 'pin_exhausted';
    end if;
  end loop;

  -- Fabricated email: {lowername}.{code}.{pin}@students.techbash.internal
  v_email := lower(regexp_replace(p_name, '[^a-z0-9]', '', 'g'))
    || '.' || lower(v_code)
    || '.' || v_pin
    || '@students.techbash.internal';

  -- Create the Supabase auth user. signInWithPassword will work after this.
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_pin, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('display_name', p_name),
    false
  )
  returning id into v_user_id;

  -- Create the profile row.
  insert into public.profiles (id, full_name, role)
  values (v_user_id, p_name, 'student')
  on conflict (id) do update set full_name = excluded.full_name;

  -- Add to class_members.
  insert into public.class_members (class_id, student_id, display_name, pin, joined_at)
  values (p_class_id, v_user_id, p_name, v_pin, now());

  return query select v_pin, v_user_id;
end;
$$;

-- 4. Look-up function used by the join API: given code + name + PIN,
--    return the fabricated email so the client can signInWithPassword.
create or replace function public.student_lookup(
  p_code text,
  p_name text,
  p_pin  text
)
returns table (email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
  v_code_row  text;
begin
  -- Resolve code → class_id.
  select class_id into v_class_id
  from public.class_codes
  where code = upper(p_code) and active = true
  limit 1;

  if v_class_id is null then
    raise exception 'invalid_code';
  end if;

  -- Verify name + PIN exist in this class.
  if not exists (
    select 1 from public.class_members
    where class_id = v_class_id
      and lower(display_name) = lower(p_name)
      and pin = p_pin
  ) then
    raise exception 'invalid_credentials';
  end if;

  -- Return the fabricated email.
  return query
    select lower(regexp_replace(p_name, '[^a-z0-9]', '', 'g'))
      || '.' || lower(upper(p_code))
      || '.' || p_pin
      || '@students.techbash.internal';
end;
$$;

-- Grant execute to authenticated users (teachers call teacher_add_student,
-- anon/service calls student_lookup).
grant execute on function public.teacher_add_student(uuid, text) to authenticated;
grant execute on function public.student_lookup(text, text, text) to anon, authenticated;
