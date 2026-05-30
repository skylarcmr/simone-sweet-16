-- Run this in your Supabase project's SQL editor (Dashboard → SQL Editor → New Query)

-- Templates: reusable PNG overlays applied on top of the photo strip
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null unique,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

-- Only ONE template can be active at a time (enforced by unique partial index)
create unique index if not exists templates_one_active
  on public.templates (active)
  where active = true;

-- Strips: every uploaded strip the booth produces, addressable by short id
create table if not exists public.strips (
  id text primary key,                  -- 6–12 char URL slug
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

-- Storage buckets ----------------------------------------------------
-- In Dashboard → Storage:
--   1. Create bucket  "templates"  (PRIVATE — admin uploads, signed URLs only)
--   2. Create bucket  "strips"     (PUBLIC  — guests need direct download access)
-- After creating buckets, RLS for the buckets themselves doesn't need editing
-- because the server uses the service role key to upload.

-- Row-level security on the tables (defense in depth — even if a leak happens
-- through the anon key, no one can mutate these directly).
alter table public.templates enable row level security;
alter table public.strips    enable row level security;

-- Allow public read of strips by id (so the /d/[id] page can resolve)
create policy "public read strips"
  on public.strips for select
  using (true);

-- All writes go through the service-role key (bypasses RLS) — no policies needed.
