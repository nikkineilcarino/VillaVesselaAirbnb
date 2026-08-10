-- Migration: 008_add_waze_and_analytics_retention
-- Purpose: Add an exact Waze analytics category and delete anonymous analytics daily once older than 365 days.
-- Objects affected: public.link_clicks constraint, private.prune_expired_analytics(), pg_cron, and one named cron job.
-- Security: The invoker-rights maintenance function remains owner-only; no client role receives DELETE or function execution.
-- Dependencies: Migrations 001-007 provide the protected analytics tables, indexes, views, policies, and dashboard functions.
-- Reversibility: Unschedule only this named job and drop the private function. Restore the old constraint only after reconciling Waze rows. Deleted records require a backup to recover; never drop the shared pg_cron extension during rollback.

-- Supabase Cron uses pg_cron and creates its own cron schema.
create extension if not exists pg_cron;

-- Keep Google Maps and Waze distinct while preserving every previously accepted type.
alter table public.link_clicks
  drop constraint link_clicks_type_allowed;

alter table public.link_clicks
  add constraint link_clicks_type_allowed
  check (
    link_type in (
      'airbnb',
      'facebook',
      'messenger',
      'google_maps',
      'waze',
      'whatsapp',
      'phone',
      'email',
      'other'
    )
  )
  not valid;

alter table public.link_clicks
  validate constraint link_clicks_type_allowed;

comment on constraint link_clicks_type_allowed on public.link_clicks is
  'Exact approved outbound categories; Google Maps and Waze remain distinct providers.';

-- The scheduling owner invokes this function with its own table permissions. Application roles
-- cannot call it, and the caller cannot supply a wider or user-controlled retention period.
create or replace function private.prune_expired_analytics()
returns table (
  deleted_page_views bigint,
  deleted_link_clicks bigint
)
language sql
volatile
security invoker
set search_path = ''
as $function$
  with deleted_page_views as (
    delete from public.page_views as views
    where views.created_at
      < pg_catalog.statement_timestamp() - '365 days'::pg_catalog.interval
    returning 1
  ),
  deleted_link_clicks as (
    delete from public.link_clicks as clicks
    where clicks.created_at
      < pg_catalog.statement_timestamp() - '365 days'::pg_catalog.interval
    returning 1
  )
  select
    (select pg_catalog.count(*) from deleted_page_views),
    (select pg_catalog.count(*) from deleted_link_clicks);
$function$;

alter function private.prune_expired_analytics() owner to postgres;

revoke all on function private.prune_expired_analytics()
  from public, anon, authenticated, service_role;

comment on function private.prune_expired_analytics() is
  'Deletes only anonymous page-view and link-click events strictly older than 365 days and returns deletion counts.';

-- pg_cron uses GMT unless its separate cron.timezone setting is changed. This runs daily at
-- 18:15 GMT (02:15 Asia/Manila). Reusing the name updates the existing job; alter_job explicitly
-- reactivates it so replay cannot leave retention silently disabled.
with retention_job as (
  select cron.schedule(
    'villa-vessela-analytics-retention',
    '15 18 * * *',
    $job$select * from private.prune_expired_analytics();$job$
  ) as job_id
)
select cron.alter_job(retention_job.job_id, active => true)
from retention_job;

-- Supabase owns pg_cron's internal objects. Removing cron-schema visibility after scheduling is
-- the effective boundary: application roles cannot name its job tables or scheduler functions.
revoke all on schema cron from public, anon, authenticated, service_role;
