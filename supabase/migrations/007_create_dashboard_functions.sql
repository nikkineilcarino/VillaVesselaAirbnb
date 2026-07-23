-- Migration: 007_create_dashboard_functions
-- Purpose: Return exact, bounded administrator dashboard aggregates for one Asia/Manila-aligned UTC range.
-- Objects affected: five public analytics RPC functions; underlying records remain unchanged.
-- Security: SECURITY INVOKER preserves base-table RLS, execution is authenticated-only, and no full visitor IDs are returned.
-- Dependencies: Analytics/inquiry tables, administrator RLS policies, and analytics views from migrations 001-006.
-- Reversibility: Revoke and drop the five functions; all source events and views remain available.

create or replace function public.analytics_dashboard_summary(
  p_start timestamptz,
  p_end_exclusive timestamptz
)
returns table (
  total_page_views bigint,
  estimated_unique_visitors bigint,
  sessions bigint,
  total_external_link_clicks bigint,
  unique_clicking_visitors bigint,
  airbnb_clicks bigint,
  facebook_clicks bigint,
  google_maps_clicks bigint,
  whatsapp_clicks bigint,
  new_inquiries bigint,
  has_demonstration_data boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  with period_page_views as materialized (
    select views.anonymous_visitor_id, views.session_id, views.path
    from public.page_views views
    where views.created_at >= p_start
      and views.created_at < p_end_exclusive
      and p_end_exclusive > p_start
      and p_end_exclusive <= p_start + interval '366 days'
  ),
  period_link_clicks as materialized (
    select clicks.anonymous_visitor_id, clicks.link_type, clicks.destination_url
    from public.link_clicks clicks
    where clicks.created_at >= p_start
      and clicks.created_at < p_end_exclusive
      and p_end_exclusive > p_start
      and p_end_exclusive <= p_start + interval '366 days'
  ),
  period_inquiries as materialized (
    select inquiries.name, inquiries.status
    from public.contact_inquiries inquiries
    where inquiries.created_at >= p_start
      and inquiries.created_at < p_end_exclusive
      and p_end_exclusive > p_start
      and p_end_exclusive <= p_start + interval '366 days'
  ),
  clicking_visitors as (
    select count(*)::bigint as total
    from (
      select distinct clicks.anonymous_visitor_id
      from period_link_clicks clicks
      inner join period_page_views views
        on views.anonymous_visitor_id = clicks.anonymous_visitor_id
    ) matched_visitors
  )
  select
    (select count(*)::bigint from period_page_views),
    (select count(distinct anonymous_visitor_id)::bigint from period_page_views),
    (select count(distinct session_id)::bigint from period_page_views),
    (select count(*)::bigint from period_link_clicks),
    (select total from clicking_visitors),
    (select (count(*) filter (where link_type = 'airbnb'))::bigint from period_link_clicks),
    (select (count(*) filter (where link_type = 'facebook'))::bigint from period_link_clicks),
    (select (count(*) filter (where link_type = 'google_maps'))::bigint from period_link_clicks),
    (select (count(*) filter (where link_type = 'whatsapp'))::bigint from period_link_clicks),
    (select (count(*) filter (where status = 'new'))::bigint from period_inquiries),
    (
      exists (
        select 1
        from period_page_views
        where anonymous_visitor_id like 'demo-%' or path like '/demo/%'
      )
      or exists (
        select 1
        from period_link_clicks
        where anonymous_visitor_id like 'demo-%'
          or destination_url like 'https://example.invalid/%'
      )
      or exists (
        select 1
        from period_inquiries
        where name like '[DEMO]%'
      )
    );
$$;

create or replace function public.analytics_dashboard_daily(
  p_start timestamptz,
  p_end_exclusive timestamptz
)
returns table (
  activity_date date,
  total_page_views bigint,
  estimated_unique_visitors bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    (views.created_at at time zone 'Asia/Manila')::date as activity_date,
    count(*)::bigint as total_page_views,
    count(distinct anonymous_visitor_id)::bigint as estimated_unique_visitors
  from public.page_views views
  where views.created_at >= p_start
    and views.created_at < p_end_exclusive
    and p_end_exclusive > p_start
    and p_end_exclusive <= p_start + interval '366 days'
  group by (views.created_at at time zone 'Asia/Manila')::date
  order by activity_date;
$$;

create or replace function public.analytics_dashboard_device_totals(
  p_start timestamptz,
  p_end_exclusive timestamptz
)
returns table (
  device_type text,
  total_page_views bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(views.device_type, 'unknown') as device_type,
    count(*)::bigint as total_page_views
  from public.page_views views
  where views.created_at >= p_start
    and views.created_at < p_end_exclusive
    and p_end_exclusive > p_start
    and p_end_exclusive <= p_start + interval '366 days'
  group by coalesce(views.device_type, 'unknown')
  order by total_page_views desc, device_type;
$$;

create or replace function public.analytics_dashboard_link_totals(
  p_start timestamptz,
  p_end_exclusive timestamptz
)
returns table (
  link_type text,
  total_clicks bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select clicks.link_type, count(*)::bigint as total_clicks
  from public.link_clicks clicks
  where clicks.created_at >= p_start
    and clicks.created_at < p_end_exclusive
    and p_end_exclusive > p_start
    and p_end_exclusive <= p_start + interval '366 days'
  group by clicks.link_type
  order by total_clicks desc, link_type;
$$;

create or replace function public.analytics_dashboard_top_pages(
  p_start timestamptz,
  p_end_exclusive timestamptz
)
returns table (
  path text,
  total_page_views bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select views.path, count(*)::bigint as total_page_views
  from public.page_views views
  where views.created_at >= p_start
    and views.created_at < p_end_exclusive
    and p_end_exclusive > p_start
    and p_end_exclusive <= p_start + interval '366 days'
  group by views.path
  order by total_page_views desc, path
  limit 10;
$$;

revoke all on function public.analytics_dashboard_summary(timestamptz, timestamptz)
  from public, anon, authenticated;
revoke all on function public.analytics_dashboard_daily(timestamptz, timestamptz)
  from public, anon, authenticated;
revoke all on function public.analytics_dashboard_device_totals(timestamptz, timestamptz)
  from public, anon, authenticated;
revoke all on function public.analytics_dashboard_link_totals(timestamptz, timestamptz)
  from public, anon, authenticated;
revoke all on function public.analytics_dashboard_top_pages(timestamptz, timestamptz)
  from public, anon, authenticated;

grant execute on function public.analytics_dashboard_summary(timestamptz, timestamptz)
  to authenticated;
grant execute on function public.analytics_dashboard_daily(timestamptz, timestamptz)
  to authenticated;
grant execute on function public.analytics_dashboard_device_totals(timestamptz, timestamptz)
  to authenticated;
grant execute on function public.analytics_dashboard_link_totals(timestamptz, timestamptz)
  to authenticated;
grant execute on function public.analytics_dashboard_top_pages(timestamptz, timestamptz)
  to authenticated;

comment on function public.analytics_dashboard_summary(timestamptz, timestamptz) is
  'Exact administrator cards and demo-data marker for one validated range; click-through visitors intersect period page visitors.';
comment on function public.analytics_dashboard_daily(timestamptz, timestamptz) is
  'Daily visitor and page-view values grouped by Asia/Manila calendar date.';
comment on function public.analytics_dashboard_device_totals(timestamptz, timestamptz) is
  'Coarse device page-view totals for one validated range.';
comment on function public.analytics_dashboard_link_totals(timestamptz, timestamptz) is
  'Approved external-link type totals for one validated range.';
comment on function public.analytics_dashboard_top_pages(timestamptz, timestamptz) is
  'Ten most-viewed normalized paths for one validated range.';
