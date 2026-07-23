-- Migration: 001_create_admin_profiles
-- Purpose: Link manually approved Supabase Auth identities to administrator authorization.
-- Tables affected: public.admin_profiles.
-- Security: This migration creates no policies or client grants; RLS is enabled in migration 004.
-- Dependencies: Supabase-managed auth.users and pgcrypto supplied by the platform.
-- Reversibility: Drop public.admin_profiles after dependent policies/functions are removed; profile data is lost.

create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),

  constraint admin_profiles_display_name_length
    check (char_length(btrim(display_name)) between 1 and 100),
  constraint admin_profiles_role_allowed
    check (role = 'admin')
);

comment on table public.admin_profiles is
  'Manually approved administrator identities; authentication alone does not grant access.';
comment on column public.admin_profiles.user_id is
  'Supabase Auth user identifier provisioned through an approved backend procedure.';

