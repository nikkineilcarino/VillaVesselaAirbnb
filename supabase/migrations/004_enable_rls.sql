-- Migration: 004_enable_rls
-- Purpose: Make every application table deny-by-default before any administrator policy is added.
-- Tables affected: public.admin_profiles, page_views, link_clicks, and contact_inquiries.
-- Security: RLS is enabled and direct anon/authenticated privileges are removed. There are intentionally no public insert policies.
-- Dependencies: Migrations 001-003 must have created all four tables.
-- Reversibility: RLS can be disabled and grants restored, but doing so would remove the primary database access boundary.

alter table public.admin_profiles enable row level security;
alter table public.page_views enable row level security;
alter table public.link_clicks enable row level security;
alter table public.contact_inquiries enable row level security;

revoke all on table public.admin_profiles from public, anon, authenticated;
revoke all on table public.page_views from public, anon, authenticated;
revoke all on table public.link_clicks from public, anon, authenticated;
revoke all on table public.contact_inquiries from public, anon, authenticated;

comment on table public.admin_profiles is
  'RLS protected. Profiles are provisioned through a trusted backend and readable only by approved administrators.';
comment on table public.page_views is
  'RLS protected. Future public events are inserted only through a validated, rate-limited server endpoint.';
comment on table public.link_clicks is
  'RLS protected. Future public events are inserted only through a validated server endpoint with destination allowlisting.';
comment on table public.contact_inquiries is
  'RLS protected. Future inquiries are inserted only through a validated, consent-aware, rate-limited server endpoint.';

