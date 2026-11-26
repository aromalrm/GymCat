-- GymCat milestone 1 schema.
-- Metric units only. Videos are URLs so the source can change later.
--
-- Demo video for every seeded exercise (swap video_url per row when a
-- direct file URL exists):
--   https://x.com/ErnestoSOFTWARE/status/2119926871882174818
-- A direct media URL was not available when this seed was written.

create extension if not exists pgcrypto;

-- Profile. id matches auth.users. Stats stay null until onboarding.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  height_cm numeric(5, 1),
  weight_kg numeric(5, 1),
  age smallint check (age is null or age between 13 and 120),
  gender text check (gender is null or gender in ('female', 'male', 'other')),
  goal text check (goal is null or goal in ('cut', 'maintain', 'bulk')),
  calorie_target integer check (calorie_target is null or calorie_target > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.body_parts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  body_part_id uuid not null references public.body_parts (id) on delete cascade,
  name text not null,
  instructions text not null default '',
  video_url text not null,
  thumbnail_url text,
  unique (body_part_id, name)
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  date date not null,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sets integer not null check (sets > 0),
  reps integer not null check (reps > 0),
  weight_kg numeric(6, 2) not null check (weight_kg >= 0),
  created_at timestamptz not null default now()
);

create index workout_logs_user_date_idx on public.workout_logs (user_id, date);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  date date not null,
  calories integer not null check (calories >= 0),
  protein numeric(6, 1) check (protein is null or protein >= 0),
  carbs numeric(6, 1) check (carbs is null or carbs >= 0),
  fat numeric(6, 1) check (fat is null or fat >= 0),
  created_at timestamptz not null default now()
);

create index meal_logs_user_date_idx on public.meal_logs (user_id, date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- Runs as the function owner so the profile row exists before the client
-- session can write. Not granted to API roles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.set_updated_at() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.body_parts enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.meal_logs enable row level security;

grant usage on schema public to anon, authenticated;

-- Shared catalog: read-only through the API.
grant select on public.body_parts to anon, authenticated;
grant select on public.exercises to anon, authenticated;

-- Personal rows: a user only reads and writes their own.
grant select, update on public.users to authenticated;
grant select, insert, update, delete on public.workout_logs to authenticated;
grant select, insert, update, delete on public.meal_logs to authenticated;

create policy users_select_own
on public.users
for select
to authenticated
using (id = (select auth.uid()));

create policy users_update_own
on public.users
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy body_parts_read
on public.body_parts
for select
to anon, authenticated
using (true);

create policy exercises_read
on public.exercises
for select
to anon, authenticated
using (true);

create policy workout_logs_select_own
on public.workout_logs
for select
to authenticated
using (user_id = (select auth.uid()));

create policy workout_logs_insert_own
on public.workout_logs
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy workout_logs_update_own
on public.workout_logs
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy workout_logs_delete_own
on public.workout_logs
for delete
to authenticated
using (user_id = (select auth.uid()));

create policy meal_logs_select_own
on public.meal_logs
for select
to authenticated
using (user_id = (select auth.uid()));

create policy meal_logs_insert_own
on public.meal_logs
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy meal_logs_update_own
on public.meal_logs
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy meal_logs_delete_own
on public.meal_logs
for delete
to authenticated
using (user_id = (select auth.uid()));

-- Stable ids so a later migration can update video_url in place.
insert into public.body_parts (id, name, icon)
values
  ('10000000-0000-4000-8000-000000000001', 'chest', 'chest'),
  ('10000000-0000-4000-8000-000000000002', 'back', 'back'),
  ('10000000-0000-4000-8000-000000000003', 'shoulders', 'shoulders'),
  ('10000000-0000-4000-8000-000000000004', 'arms', 'arms'),
  ('10000000-0000-4000-8000-000000000005', 'legs', 'legs'),
  ('10000000-0000-4000-8000-000000000006', 'core', 'core');

insert into public.exercises (body_part_id, name, instructions, video_url)
values
  ('10000000-0000-4000-8000-000000000001', 'Bench Press', 'Lie on a bench and press the bar from chest to lockout.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000001', 'Incline Dumbbell Press', 'Press dumbbells on an incline bench.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000001', 'Push-Up', 'Lower your chest to the floor and press back up.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000001', 'Chest Fly', 'Open the arms wide, then bring the hands together over the chest.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000001', 'Cable Crossover', 'Bring the cables together in front of the chest.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000002', 'Pull-Up', 'Hang from a bar and pull the chin above the bar.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000002', 'Bent-Over Row', 'Hinge at the hips and row the weight to the lower ribs.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000002', 'Lat Pulldown', 'Pull the bar to the upper chest, then control it back up.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000002', 'Seated Cable Row', 'Sit tall and pull the handle to the stomach.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000002', 'Deadlift', 'Hinge and stand up with the bar close to the legs.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000003', 'Overhead Press', 'Press the bar from the shoulders to lockout overhead.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000003', 'Lateral Raise', 'Raise the arms out to the sides to shoulder height.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000003', 'Front Raise', 'Raise the arms in front to shoulder height.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000003', 'Rear Delt Fly', 'With a slight hinge, raise the arms out to the sides.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000003', 'Arnold Press', 'Rotate the palms out as you press overhead.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000004', 'Biceps Curl', 'Curl the weight without swinging the torso.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000004', 'Hammer Curl', 'Curl with palms facing each other.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000004', 'Triceps Pushdown', 'Push the cable down until the elbows are straight.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000004', 'Skull Crusher', 'Lower the bar toward the forehead, then extend the elbows.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000004', 'Dip', 'Lower the body between the bars, then press back up.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000005', 'Squat', 'Sit the hips down and stand back up with the chest up.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000005', 'Romanian Deadlift', 'Hinge until you feel the hamstrings, then stand tall.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000005', 'Leg Press', 'Lower the sled until the knees bend, then press it away.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000005', 'Lunge', 'Step forward and drop the back knee, then push back.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000005', 'Calf Raise', 'Rise onto the toes and lower under control.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000006', 'Plank', 'Hold a straight line from head to heels.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000006', 'Crunch', 'Curl the ribs toward the hips.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000006', 'Hanging Leg Raise', 'Hang and lift the legs in front of you.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000006', 'Russian Twist', 'Rotate the torso side to side with the feet lifted.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818'),
  ('10000000-0000-4000-8000-000000000006', 'Cable Woodchop', 'Pull the cable diagonally across the body.', 'https://x.com/ErnestoSOFTWARE/status/2119926871882174818');
