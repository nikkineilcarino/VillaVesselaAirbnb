-- Migration: 006_create_analytics_views
-- Purpose: Provide bounded daily aggregates for later administrator cards/charts without weakening base-table RLS.
-- Objects affected: four public analytics views.
-- Security: security_invoker makes every view obey the caller's base-table grants and RLS policies; anon receives no access.
-- Dependencies: Analytics tables/indexes from migration 002 and administrator policies/grants from migration 005.
-- Reversibility: Drop the four views; underlying events remain unchanged.

create view public.analytics_daily_overview
with (security_invoker = true, security_barrier = true)
as
select
  (created_at at time zone 'Asia/Manila')::date as activity_date,
  count(*)::bigint as total_page_views,
  count(distinct anonymous_visitor_id)::bigint as estimated_unique_visitors,
  count(distinct session_id)::bigint as sessions
from public.page_views
group by (created_at at time zone 'Asia/Manila')::date;

create view public.analytics_daily_pages
with (security_invoker = true, security_barrier = true)
as
select
  (created_at at time zone 'Asia/Manila')::date as activity_date,
  path,
  count(*)::bigint as total_page_views,
  count(distinct anonymous_visitor_id)::bigint as estimated_unique_visitors
from public.page_views
group by (created_at at time zone 'Asia/Manila')::date, path;

create view public.analytics_daily_devices
with (security_invoker = true, security_barrier = true)
as
select
  (created_at at time zone 'Asia/Manila')::date as activity_date,
  coalesce(device_type, 'unknown') as device_type,
  count(*)::bigint as total_page_views
from public.page_views
group by (created_at at time zone 'Asia/Manila')::date, coalesce(device_type, 'unknown');

create view public.analytics_daily_link_clicks
with (security_invoker = true, security_barrier = true)
as
select
  (created_at at time zone 'Asia/Manila')::date as activity_date,
  link_type,
  count(*)::bigint as total_clicks,
  count(distinct anonymous_visitor_id)::bigint as estimated_unique_visitors
from public.link_clicks
group by (created_at at time zone 'Asia/Manila')::date, link_type;

comment on view public.analytics_daily_overview is
  'Daily page views, estimated unique visitors, and sessions using Asia/Manila calendar dates.';
comment on view public.analytics_daily_pages is
  'Daily path totals for most-viewed-page reporting using Asia/Manila calendar dates.';
comment on view public.analytics_daily_devices is
  'Daily coarse device totals using Asia/Manila calendar dates.';
comment on view public.analytics_daily_link_clicks is
  'Daily approved-link activity by link type using Asia/Manila calendar dates.';

revoke all on table public.analytics_daily_overview from public, anon, authenticated;
revoke all on table public.analytics_daily_pages from public, anon, authenticated;
revoke all on table public.analytics_daily_devices from public, anon, authenticated;
revoke all on table public.analytics_daily_link_clicks from public, anon, authenticated;

grant select on table public.analytics_daily_overview to authenticated;
grant select on table public.analytics_daily_pages to authenticated;
grant select on table public.analytics_daily_devices to authenticated;
grant select on table public.analytics_daily_link_clicks to authenticated;
