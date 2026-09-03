-- Migration: 009_add_inquiry_lifecycle
-- Purpose: Add inquiry retry idempotency, consent-notice provenance, narrow server storage, administrator deletion, and 365-day retention.
-- Objects affected: public.contact_inquiries, public.store_contact_inquiry(...), public.delete_contact_inquiry(uuid), private.prune_expired_inquiries(), pg_cron, and one named cron job.
-- Security: Public inquiry storage is limited to one service-role-only function; authenticated deletion is limited to one UUID and independently verifies approved-admin status; retention remains owner-only and parameter-free.
-- Dependencies: Migrations 001-008 provide the protected inquiry table, private.is_approved_admin(), administrator grants, and pg_cron.
-- Reversibility: Disable only the named inquiry job before dropping its functions, constraints, or columns. Deleted inquiries require a backup to recover; never drop the shared pg_cron extension or analytics retention job.

-- Existing rows, if any, receive a random legacy retry identity and an explicit unknown-notice
-- sentinel. Neither column keeps a default: every future trusted insert must fail closed unless the
-- server supplies one stable submission_id and the reviewed notice version shown at consent time.
alter table public.contact_inquiries
  add column submission_id uuid,
  add column privacy_notice_version text;

update public.contact_inquiries
set
  submission_id = gen_random_uuid(),
  privacy_notice_version = 'legacy-unversioned'
where submission_id is null
  or privacy_notice_version is null;

alter table public.contact_inquiries
  alter column submission_id set not null,
  alter column privacy_notice_version set not null;

alter table public.contact_inquiries
  add constraint contact_inquiries_submission_id_unique
    unique (submission_id),
  add constraint contact_inquiries_submission_id_v4
    check (
      submission_id::text
        ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    ),
  add constraint contact_inquiries_privacy_notice_version_format
    check (
      privacy_notice_version = btrim(privacy_notice_version)
      and (
        privacy_notice_version = 'legacy-unversioned'
        or privacy_notice_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
      )
    );

comment on column public.contact_inquiries.submission_id is
  'Required random per-submission retry key. Trusted server code must reuse it across retries; no database default exists.';
comment on column public.contact_inquiries.privacy_notice_version is
  'Required server-selected YYYY-MM-DD privacy-notice version; legacy-unversioned identifies only rows predating versioned consent provenance.';
comment on constraint contact_inquiries_submission_id_unique on public.contact_inquiries is
  'Prevents one stable submission retry key from creating more than one inquiry row.';
comment on constraint contact_inquiries_submission_id_v4 on public.contact_inquiries is
  'Requires the browser-generated submission retry identity to use the random UUID v4 format.';
comment on constraint contact_inquiries_privacy_notice_version_format on public.contact_inquiries is
  'Requires a trimmed reviewed YYYY-MM-DD notice version or the explicit legacy-unversioned backfill sentinel.';
comment on table public.contact_inquiries is
  'RLS-protected, consented contact intake. Public clients have no direct table access; approved administrators manage records through authenticated controls.';
comment on column public.contact_inquiries.created_at is
  'Server-generated submission time and the fixed basis for 365-day active-table retention.';

-- The validated server handler calls this fixed function instead of requesting table RETURNING
-- data. It accepts only storage fields, hard-codes consent/status/server time, and reports whether
-- the unique submission UUID created a row, exactly matches an existing retry, or conflicts with
-- an existing row. Conflicting retries never overwrite or masquerade as the stored original.
-- Only the backend service role may invoke it.
create or replace function public.store_contact_inquiry(
  p_submission_id uuid,
  p_privacy_notice_version text,
  p_name text,
  p_email text,
  p_phone text,
  p_preferred_check_in date,
  p_preferred_check_out date,
  p_number_of_guests integer,
  p_message text
)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  inserted_rows integer;
  matches_existing boolean;
begin
  insert into public.contact_inquiries (
    submission_id,
    privacy_notice_version,
    name,
    email,
    phone,
    preferred_check_in,
    preferred_check_out,
    number_of_guests,
    message,
    consent,
    status
  )
  values (
    p_submission_id,
    p_privacy_notice_version,
    p_name,
    p_email,
    p_phone,
    p_preferred_check_in,
    p_preferred_check_out,
    p_number_of_guests,
    p_message,
    true,
    'new'
  )
  on conflict on constraint contact_inquiries_submission_id_unique do nothing;

  get diagnostics inserted_rows = row_count;
  if inserted_rows = 1 then
    return 'created';
  end if;

  select exists (
    select 1
    from public.contact_inquiries as inquiry
    where inquiry.submission_id = p_submission_id
      and inquiry.privacy_notice_version is not distinct from p_privacy_notice_version
      and inquiry.name is not distinct from p_name
      and inquiry.email is not distinct from p_email
      and inquiry.phone is not distinct from p_phone
      and inquiry.preferred_check_in is not distinct from p_preferred_check_in
      and inquiry.preferred_check_out is not distinct from p_preferred_check_out
      and inquiry.number_of_guests is not distinct from p_number_of_guests
      and inquiry.message is not distinct from p_message
      and inquiry.consent = true
  ) into matches_existing;

  return case when matches_existing then 'duplicate' else 'conflict' end;
end;
$function$;

alter function public.store_contact_inquiry(
  uuid, text, text, text, text, date, date, integer, text
) owner to postgres;

revoke all on function public.store_contact_inquiry(
  uuid, text, text, text, text, date, date, integer, text
) from public, anon, authenticated, service_role;
grant execute on function public.store_contact_inquiry(
  uuid, text, text, text, text, date, date, integer, text
) to service_role;

comment on function public.store_contact_inquiry(
  uuid, text, text, text, text, date, date, integer, text
) is
  'Stores one validated inquiry and returns created, duplicate, or conflict without changing an existing row.';

-- Keep direct table DELETE unavailable to browser roles. This SECURITY DEFINER function accepts one
-- UUID, independently checks the existing approved-admin helper, contains no dynamic SQL, and can
-- delete at most one primary-key row. The application exposes it only through a separately
-- confirmed per-record administrator action.
revoke delete on table public.contact_inquiries from public, anon, authenticated;

create or replace function public.delete_contact_inquiry(p_inquiry_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  deleted_rows integer;
begin
  if not (select private.is_approved_admin()) then
    raise exception using
      errcode = '42501',
      message = 'Administrator authorization required.';
  end if;

  delete from public.contact_inquiries as inquiries
  where inquiries.id = p_inquiry_id;

  get diagnostics deleted_rows = row_count;
  return deleted_rows = 1;
end;
$function$;

alter function public.delete_contact_inquiry(uuid) owner to postgres;

revoke all on function public.delete_contact_inquiry(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.delete_contact_inquiry(uuid)
  to authenticated;

comment on function public.delete_contact_inquiry(uuid) is
  'Allows an approved authenticated administrator to delete at most one inquiry selected by exact primary-key UUID.';

-- The scheduling owner invokes this parameter-free function with its own table permissions.
-- Application roles cannot invoke it or widen its fixed retention boundary.
create or replace function private.prune_expired_inquiries()
returns bigint
language sql
volatile
security invoker
set search_path = ''
as $function$
  with deleted_inquiries as (
    delete from public.contact_inquiries as inquiries
    where inquiries.created_at
      < pg_catalog.statement_timestamp() - '365 days'::pg_catalog.interval
    returning 1
  )
  select pg_catalog.count(*)
  from deleted_inquiries;
$function$;

alter function private.prune_expired_inquiries() owner to postgres;

revoke all on function private.prune_expired_inquiries()
  from public, anon, authenticated, service_role;

comment on function private.prune_expired_inquiries() is
  'Deletes inquiry intake rows strictly older than 365 days, regardless of status, and returns the deletion count.';

-- pg_cron uses GMT unless its separate cron.timezone setting is changed. This distinct job runs
-- daily at 18:25 GMT (02:25 Asia/Manila). Reusing the name updates the existing job; alter_job
-- explicitly reactivates it so replay cannot leave inquiry retention silently disabled.
with retention_job as (
  select cron.schedule(
    'villa-vessela-inquiry-retention',
    '25 18 * * *',
    $job$select private.prune_expired_inquiries();$job$
  ) as job_id
)
select cron.alter_job(retention_job.job_id, active => true)
from retention_job;

-- Keep pg_cron's scheduler surface unavailable to every application role. This does not alter or
-- unschedule the separate analytics-retention job established by migration 008.
revoke all on schema cron from public, anon, authenticated, service_role;
