-- Run this in your Supabase project's SQL editor (Dashboard → SQL Editor → New Query)

-- Templates: reusable PNG overlays applied on top of the photo strip
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Drop the old "only one active" constraint if it exists -- guests now pick from all active templates
drop index if exists public.templates_one_active;

-- Strips: every uploaded strip the booth produces, addressable by short id
create table if not exists public.strips (
  id text primary key,                  -- 6–12 char URL slug
  storage_path text not null unique,
  photobook boolean not null default false,  -- guest opt-in for printed photobook
  created_at timestamptz not null default now()
);

-- Migration: add photobook column to existing tables
alter table public.strips add column if not exists photobook boolean not null default false;

-- Storage buckets ----------------------------------------------------
-- In Dashboard → Storage:
--   1. Create bucket  "templates"  (PRIVATE — admin uploads, signed URLs only)
--   2. Create bucket  "strips"     (PUBLIC  — guests need direct download access)

-- Row-level security on the tables.
alter table public.templates enable row level security;
alter table public.strips    enable row level security;

-- Allow public read of templates (so /pick can list them) and strips (so /d/[id] resolves)
drop policy if exists "public read templates" on public.templates;
create policy "public read templates"
  on public.templates for select
  using (active = true);

drop policy if exists "public read strips" on public.strips;
create policy "public read strips"
  on public.strips for select
  using (true);

-- All writes go through the service-role key (bypasses RLS) — no policies needed.
