-- Migration: 002_create_analytics_tables
-- Purpose: Store privacy-limited page-view and approved external-link activity.
-- Tables affected: public.page_views and public.link_clicks.
-- Security: No raw IP, exact location, fingerprint, or visitor name column is created. RLS follows in migration 004.
-- Dependencies: Migration 001 establishes the application migration order; pgcrypto provides gen_random_uuid().
-- Reversibility: Drop the indexes and both tables; stored aggregate-event history is lost.

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  anonymous_visitor_id text not null,
  session_id text not null,
  path text not null,
  referrer text,
  device_type text,
  browser_type text,
  created_at timestamptz not null default now(),

  constraint page_views_visitor_id_length
    check (char_length(btrim(anonymous_visitor_id)) between 1 and 64),
  constraint page_views_session_id_length
    check (char_length(btrim(session_id)) between 1 and 64),
  constraint page_views_path_format
    check (char_length(path) between 1 and 2048 and left(path, 1) = '/'),
  constraint page_views_referrer_length
    check (referrer is null or char_length(referrer) <= 2048),
  constraint page_views_device_type_allowed
    check (device_type is null or device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  constraint page_views_browser_type_allowed
    check (browser_type is null or browser_type in ('chrome', 'safari', 'firefox', 'edge', 'other', 'unknown'))
);

create table public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  anonymous_visitor_id text not null,
  session_id text not null,
  link_type text not null,
  destination_url text,
  source_page text,
  created_at timestamptz not null default now(),

  constraint link_clicks_visitor_id_length
    check (char_length(btrim(anonymous_visitor_id)) between 1 and 64),
  constraint link_clicks_session_id_length
    check (char_length(btrim(session_id)) between 1 and 64),
  constraint link_clicks_type_allowed
    check (link_type in ('airbnb', 'facebook', 'messenger', 'google_maps', 'whatsapp', 'phone', 'email', 'other')),
  constraint link_clicks_destination_length
    check (destination_url is null or char_length(btrim(destination_url)) between 1 and 2048),
  constraint link_clicks_source_page_format
    check (source_page is null or (char_length(source_page) between 1 and 2048 and left(source_page, 1) = '/'))
);

comment on table public.page_views is
  'Anonymous first-party page-view events with coarse browser and device categories.';
comment on table public.link_clicks is
  'Anonymous clicks to server-approved booking, map, social, messaging, phone, or email destinations.';
comment on column public.link_clicks.destination_url is
  'Recorded only after a future server endpoint validates it against approved configuration.';

create index page_views_created_at_idx on public.page_views (created_at desc);
create index page_views_visitor_created_at_idx on public.page_views (anonymous_visitor_id, created_at desc);
create index page_views_session_created_at_idx on public.page_views (session_id, created_at desc);
create index page_views_path_created_at_idx on public.page_views (path, created_at desc);

create index link_clicks_created_at_idx on public.link_clicks (created_at desc);
create index link_clicks_visitor_created_at_idx on public.link_clicks (anonymous_visitor_id, created_at desc);
create index link_clicks_session_created_at_idx on public.link_clicks (session_id, created_at desc);
create index link_clicks_type_created_at_idx on public.link_clicks (link_type, created_at desc);
create index link_clicks_source_created_at_idx on public.link_clicks (source_page, created_at desc);

