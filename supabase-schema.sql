create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text not null unique,
  email text,
  display_name text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.footprint_estimates (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text not null references public.profiles(firebase_uid) on delete cascade,
  answers jsonb not null,
  result jsonb not null,
  selected_actions jsonb not null default '[]'::jsonb,
  total_kg_co2e_month numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists footprint_estimates_firebase_uid_created_at_idx
  on public.footprint_estimates (firebase_uid, created_at desc);

alter table public.profiles enable row level security;
alter table public.footprint_estimates enable row level security;

-- Firebase handles OAuth, so Supabase cannot safely enforce user privacy
-- from the browser anon key alone. Keep tables private by default.
-- Access them only through an abstraction layer, such as a Supabase Edge
-- Function or backend API that verifies the Firebase ID token and uses the
-- Supabase service-role key server-side.

drop policy if exists "profiles deny anonymous direct access" on public.profiles;
create policy "profiles deny anonymous direct access"
  on public.profiles
  for all
  using (false)
  with check (false);

drop policy if exists "estimates deny anonymous direct access" on public.footprint_estimates;
create policy "estimates deny anonymous direct access"
  on public.footprint_estimates
  for all
  using (false)
  with check (false);
