-- Local-only pgTAP acceptance for migration 009.
-- Every inserted value is synthetic and the surrounding transaction is rolled back.
-- Run this file only with the documented Supabase CLI `--local` command.

begin;

set local search_path = public, private, extensions, pg_catalog;

select plan(29);

select ok(
  (
    select pg_catalog.count(*) = 2
      and pg_catalog.bool_and(attribute.attnotnull)
      and pg_catalog.bool_and(
        case attribute.attname
          when 'submission_id' then pg_catalog.format_type(attribute.atttypid, attribute.atttypmod) = 'uuid'
          when 'privacy_notice_version' then pg_catalog.format_type(attribute.atttypid, attribute.atttypmod) = 'text'
          else false
        end
      )
    from pg_catalog.pg_attribute as attribute
    where attribute.attrelid = 'public.contact_inquiries'::pg_catalog.regclass
      and attribute.attname in ('submission_id', 'privacy_notice_version')
      and not attribute.attisdropped
  ),
  'inquiry retry and notice columns are present, typed, and required'
);

select ok(
  (
    select pg_catalog.count(*) = 0
    from pg_catalog.pg_attrdef as defaults
    join pg_catalog.pg_attribute as attribute
      on attribute.attrelid = defaults.adrelid
      and attribute.attnum = defaults.adnum
    where defaults.adrelid = 'public.contact_inquiries'::pg_catalog.regclass
      and attribute.attname in ('submission_id', 'privacy_notice_version')
  ),
  'retry identity and notice provenance fail closed without database defaults'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint as constraint_record
    where constraint_record.conrelid = 'public.contact_inquiries'::pg_catalog.regclass
      and constraint_record.conname = 'contact_inquiries_submission_id_unique'
      and constraint_record.contype = 'u'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid) = 'UNIQUE (submission_id)'
  ),
  'submission identifiers have an exact unique constraint'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint as constraint_record
    where constraint_record.conrelid = 'public.contact_inquiries'::pg_catalog.regclass
      and constraint_record.conname = 'contact_inquiries_submission_id_v4'
      and constraint_record.contype = 'c'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid)
        like '%submission_id%4[0-9a-f]%'
  ),
  'stored submission identifiers have a UUID v4 database constraint'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint as constraint_record
    where constraint_record.conrelid = 'public.contact_inquiries'::pg_catalog.regclass
      and constraint_record.conname = 'contact_inquiries_privacy_notice_version_format'
      and constraint_record.contype = 'c'
      and pg_catalog.pg_get_constraintdef(constraint_record.oid) like '%privacy_notice_version%'
  ),
  'privacy notice versions have a database check constraint'
);

select ok(
  (
    select function_record.pronargs = 9
      and function_record.prosecdef
      and function_record.provolatile = 'v'
      and function_record.prorettype = 'text'::pg_catalog.regtype
      and owner_record.rolname = 'postgres'
      and function_record.proconfig @> array['search_path=""']::text[]
    from pg_catalog.pg_proc as function_record
    join pg_catalog.pg_namespace as namespace_record
      on namespace_record.oid = function_record.pronamespace
    join pg_catalog.pg_roles as owner_record
      on owner_record.oid = function_record.proowner
    where namespace_record.nspname = 'public'
      and function_record.proname = 'store_contact_inquiry'
  ),
  'inquiry storage is a fixed nine-argument definer-rights function with an empty search path'
);

select ok(
  pg_catalog.has_function_privilege(
    'service_role',
    'public.store_contact_inquiry(uuid,text,text,text,text,date,date,integer,text)',
    'EXECUTE'
  )
  and not pg_catalog.has_function_privilege(
    'anon',
    'public.store_contact_inquiry(uuid,text,text,text,text,date,date,integer,text)',
    'EXECUTE'
  )
  and not pg_catalog.has_function_privilege(
    'authenticated',
    'public.store_contact_inquiry(uuid,text,text,text,text,date,date,integer,text)',
    'EXECUTE'
  ),
  'only the backend service role can invoke inquiry storage through the Data API'
);

select ok(
  (
    select function_record.pronargs = 1
      and function_record.proargtypes = '2950'::oidvector
      and function_record.prosecdef
      and function_record.provolatile = 'v'
      and owner_record.rolname = 'postgres'
      and function_record.proconfig @> array['search_path=""']::text[]
    from pg_catalog.pg_proc as function_record
    join pg_catalog.pg_namespace as namespace_record
      on namespace_record.oid = function_record.pronamespace
    join pg_catalog.pg_roles as owner_record
      on owner_record.oid = function_record.proowner
    where namespace_record.nspname = 'public'
      and function_record.proname = 'delete_contact_inquiry'
  ),
  'exact inquiry deletion is one-UUID, definer-rights, owner-controlled, and search-path safe'
);

select ok(
  not pg_catalog.has_table_privilege('authenticated', 'public.contact_inquiries', 'DELETE')
  and not pg_catalog.has_table_privilege('anon', 'public.contact_inquiries', 'DELETE')
  and pg_catalog.has_function_privilege('authenticated', 'public.delete_contact_inquiry(uuid)', 'EXECUTE')
  and not pg_catalog.has_function_privilege('anon', 'public.delete_contact_inquiry(uuid)', 'EXECUTE')
  and not pg_catalog.has_function_privilege('service_role', 'public.delete_contact_inquiry(uuid)', 'EXECUTE'),
  'browser roles have no direct table DELETE and only authenticated callers can reach the exact function'
);

select ok(
  (
    select function_record.pronargs = 0
      and not function_record.prosecdef
      and function_record.provolatile = 'v'
      and owner_record.rolname = 'postgres'
      and function_record.proconfig @> array['search_path=""']::text[]
    from pg_catalog.pg_proc as function_record
    join pg_catalog.pg_namespace as namespace_record
      on namespace_record.oid = function_record.pronamespace
    join pg_catalog.pg_roles as owner_record
      on owner_record.oid = function_record.proowner
    where namespace_record.nspname = 'private'
      and function_record.proname = 'prune_expired_inquiries'
  ),
  'inquiry pruning is parameterless, invoker-rights, volatile, owner-only, and search-path safe'
);

select ok(
  not pg_catalog.has_function_privilege('anon', 'private.prune_expired_inquiries()', 'EXECUTE')
  and not pg_catalog.has_function_privilege('authenticated', 'private.prune_expired_inquiries()', 'EXECUTE')
  and not pg_catalog.has_function_privilege('service_role', 'private.prune_expired_inquiries()', 'EXECUTE')
  and not pg_catalog.has_schema_privilege('anon', 'cron', 'USAGE')
  and not pg_catalog.has_schema_privilege('authenticated', 'cron', 'USAGE')
  and not pg_catalog.has_schema_privilege('service_role', 'cron', 'USAGE'),
  'application roles cannot invoke pruning or access the cron schema'
);

select ok(
  (
    select pg_catalog.count(*) = 1
      and pg_catalog.bool_and(job.active)
      and pg_catalog.bool_and(job.schedule = '25 18 * * *')
      and pg_catalog.bool_and(job.command = 'select private.prune_expired_inquiries();')
      and pg_catalog.bool_and(job.database = pg_catalog.current_database())
      and pg_catalog.bool_and(job.username = 'postgres')
    from cron.job as job
    where job.jobname = 'villa-vessela-inquiry-retention'
  )
  and pg_catalog.current_setting('cron.timezone', true) = 'GMT',
  'one active inquiry retention job has the exact GMT schedule, command, database, and owner'
);

select ok(
  (
    select pg_catalog.count(*) = 1
      and pg_catalog.bool_and(job.active)
      and pg_catalog.bool_and(job.schedule = '15 18 * * *')
      and pg_catalog.bool_and(job.command = 'select * from private.prune_expired_analytics();')
    from cron.job as job
    where job.jobname = 'villa-vessela-analytics-retention'
  ),
  'the separate analytics retention job remains unchanged'
);

set local role service_role;

select is(
  public.store_contact_inquiry(
    '42000000-0000-4000-8000-000000000101'::uuid,
    '2026-08-24',
    '[QA] RPC idempotency original',
    'rpc-original@example.invalid',
    null,
    null,
    null,
    2,
    '[QA] The first exact submission UUID must create one inquiry.'
  ),
  'created',
  'the service-role storage function reports a newly created inquiry'
);

select is(
  public.store_contact_inquiry(
    '42000000-0000-4000-8000-000000000101'::uuid,
    '2026-08-24',
    '[QA] RPC idempotency original',
    'rpc-original@example.invalid',
    null,
    null,
    null,
    2,
    '[QA] The first exact submission UUID must create one inquiry.'
  ),
  'duplicate',
  'an identical retry reports a duplicate without creating another row'
);

select is(
  public.store_contact_inquiry(
    '42000000-0000-4000-8000-000000000101'::uuid,
    '2026-08-24',
    '[QA] RPC idempotency conflict',
    'rpc-conflict@example.invalid',
    null,
    null,
    null,
    3,
    '[QA] A changed retry must not masquerade as the original inquiry.'
  ),
  'conflict',
  'a changed payload with the same submission UUID reports a conflict'
);

reset role;

select ok(
  (
    select pg_catalog.count(*) = 1
      and pg_catalog.bool_and(inquiry.name = '[QA] RPC idempotency original')
      and pg_catalog.bool_and(inquiry.email = 'rpc-original@example.invalid')
    from public.contact_inquiries as inquiry
    where inquiry.submission_id = '42000000-0000-4000-8000-000000000101'
  ),
  'idempotent storage preserves exactly the original row and does not overwrite it'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '41000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'approved-inquiry-admin@example.invalid',
  '',
  pg_catalog.statement_timestamp(),
  '{}'::jsonb,
  '{}'::jsonb,
  pg_catalog.statement_timestamp(),
  pg_catalog.statement_timestamp()
);

insert into public.admin_profiles (user_id, display_name, role)
values (
  '41000000-0000-4000-8000-000000000001',
  '[QA] Approved inquiry administrator',
  'admin'
);

do $test$
begin
  begin
    insert into public.contact_inquiries (
      id,
      name,
      email,
      message,
      consent,
      status,
      created_at
    )
    values (
      '42000000-0000-4000-8000-000000000001',
      '[QA] Missing provenance row',
      'missing-provenance@example.invalid',
      '[QA] This insert must fail closed without retry and notice fields.',
      true,
      'new',
      pg_catalog.statement_timestamp()
    );
  exception
    when not_null_violation then null;
  end;
end
$test$;

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000001'
  ),
  0::bigint,
  'a future insert without retry identity or notice provenance fails closed'
);

do $test$
begin
  begin
    insert into public.contact_inquiries (
      id,
      submission_id,
      name,
      email,
      message,
      consent,
      privacy_notice_version,
      status,
      created_at
    )
    values (
      '42000000-0000-4000-8000-000000000009',
      '42000000-0000-1000-8000-000000000109',
      '[QA] Non-v4 submission row',
      'non-v4-submission@example.invalid',
      '[QA] A syntactically valid UUID v1 must fail the stored retry contract.',
      true,
      '2026-08-24',
      'new',
      pg_catalog.statement_timestamp()
    );
  exception
    when check_violation then null;
  end;
end
$test$;

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000009'
  ),
  0::bigint,
  'a syntactically valid non-v4 submission UUID is rejected'
);

insert into public.contact_inquiries (
  id,
  submission_id,
  name,
  email,
  message,
  consent,
  privacy_notice_version,
  status,
  created_at
)
values (
  '42000000-0000-4000-8000-000000000002',
  '42000000-0000-4000-8000-000000000102',
  '[QA] Idempotency row',
  'idempotency-inquiry@example.invalid',
  '[QA] A duplicate retry key must not create another row.',
  true,
  '2026-08-24',
  'new',
  pg_catalog.statement_timestamp()
);

do $test$
begin
  begin
    insert into public.contact_inquiries (
      id,
      submission_id,
      name,
      email,
      message,
      consent,
      privacy_notice_version,
      status,
      created_at
    )
    values (
      '42000000-0000-4000-8000-000000000003',
      '42000000-0000-4000-8000-000000000102',
      '[QA] Duplicate idempotency row',
      'duplicate-inquiry@example.invalid',
      '[QA] This insert must be rejected by the unique constraint.',
      true,
      '2026-08-24',
      'new',
      pg_catalog.statement_timestamp()
    );
  exception
    when unique_violation then null;
  end;
end
$test$;

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.submission_id = '42000000-0000-4000-8000-000000000102'
  ),
  1::bigint,
  'a stable retry UUID can identify only one inquiry row'
);

do $test$
begin
  begin
    insert into public.contact_inquiries (
      id,
      submission_id,
      name,
      email,
      message,
      consent,
      privacy_notice_version,
      status,
      created_at
    )
    values (
      '42000000-0000-4000-8000-000000000004',
      '42000000-0000-4000-8000-000000000104',
      '[QA] Invalid notice row',
      'invalid-notice@example.invalid',
      '[QA] This insert must be rejected by the notice constraint.',
      true,
      'not-a-reviewed-date',
      'new',
      pg_catalog.statement_timestamp()
    );
  exception
    when check_violation then null;
  end;
end
$test$;

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000004'
  ),
  0::bigint,
  'an invalid privacy notice version cannot be stored'
);

insert into public.contact_inquiries (
  id,
  submission_id,
  name,
  email,
  message,
  consent,
  privacy_notice_version,
  status,
  created_at
)
values
  (
    '42000000-0000-4000-8000-000000000005',
    '42000000-0000-4000-8000-000000000105',
    '[QA] Unapproved delete target',
    'unapproved-delete@example.invalid',
    '[QA] An unapproved authenticated caller must not delete this row.',
    true,
    '2026-08-24',
    'new',
    pg_catalog.statement_timestamp()
  ),
  (
    '42000000-0000-4000-8000-000000000006',
    '42000000-0000-4000-8000-000000000106',
    '[QA] Approved delete target',
    'approved-delete@example.invalid',
    '[QA] An approved administrator deletes this exact row.',
    true,
    '2026-08-24',
    'reviewed',
    pg_catalog.statement_timestamp()
  ),
  (
    '42000000-0000-4000-8000-000000000007',
    '42000000-0000-4000-8000-000000000107',
    '[QA] Current retention control',
    'current-retention@example.invalid',
    '[QA] Current inquiry must survive pruning and exact deletion.',
    true,
    '2026-08-24',
    'closed',
    pg_catalog.statement_timestamp() - '364 days'::pg_catalog.interval
  ),
  (
    '42000000-0000-4000-8000-000000000008',
    '42000000-0000-4000-8000-000000000108',
    '[QA] Expired retention target',
    'expired-retention@example.invalid',
    '[QA] Expired inquiry must be removed regardless of status.',
    true,
    '2026-08-24',
    'new',
    pg_catalog.statement_timestamp() - '366 days'::pg_catalog.interval
  );

set local request.jwt.claim.sub = '41000000-0000-4000-8000-000000000002';
set local role authenticated;

do $test$
begin
  begin
    perform public.delete_contact_inquiry(
      '42000000-0000-4000-8000-000000000005'::uuid
    );
  exception
    when insufficient_privilege then null;
  end;
end
$test$;

reset role;

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000005'
  ),
  1::bigint,
  'an authenticated but unapproved caller cannot delete an inquiry'
);

set local request.jwt.claim.sub = '41000000-0000-4000-8000-000000000001';
set local role authenticated;

select is(
  public.delete_contact_inquiry(
    '42000000-0000-4000-8000-000000000006'::uuid
  ),
  true,
  'an approved administrator can delete one exact inquiry'
);

reset role;

select ok(
  not exists (
    select 1
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000006'
  )
  and (
    select pg_catalog.count(*) = 2
    from public.contact_inquiries as inquiry
    where inquiry.id in (
      '42000000-0000-4000-8000-000000000005',
      '42000000-0000-4000-8000-000000000007'
    )
  ),
  'exact administrator deletion removes only its UUID target and preserves controls'
);

insert into public.page_views (
  id,
  anonymous_visitor_id,
  session_id,
  path,
  device_type,
  browser_type,
  created_at
)
values (
  '43000000-0000-4000-8000-000000000001',
  'qa-inquiry-retention-visitor',
  'qa-inquiry-retention-session',
  '/qa/inquiry-retention-control',
  'desktop',
  'chrome',
  pg_catalog.statement_timestamp() - '366 days'::pg_catalog.interval
);

insert into public.link_clicks (
  id,
  anonymous_visitor_id,
  session_id,
  link_type,
  destination_url,
  source_page,
  created_at
)
values (
  '43000000-0000-4000-8000-000000000002',
  'qa-inquiry-retention-visitor',
  'qa-inquiry-retention-session',
  'waze',
  'https://example.invalid/qa-inquiry-retention-control',
  '/qa/inquiry-retention-control',
  pg_catalog.statement_timestamp() - '366 days'::pg_catalog.interval
);

select is(
  private.prune_expired_inquiries(),
  1::bigint,
  'inquiry pruning reports exactly the one expired synthetic row'
);

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000008'
  ),
  0::bigint,
  'inquiry pruning removes the expired row from the active table'
);

select is(
  (
    select pg_catalog.count(*)
    from public.contact_inquiries as inquiry
    where inquiry.id = '42000000-0000-4000-8000-000000000007'
  ),
  1::bigint,
  'inquiry pruning retains the current control row'
);

select ok(
  exists (
    select 1
    from public.page_views as view_event
    where view_event.id = '43000000-0000-4000-8000-000000000001'
  )
  and exists (
    select 1
    from public.link_clicks as click_event
    where click_event.id = '43000000-0000-4000-8000-000000000002'
  ),
  'inquiry pruning leaves expired analytics controls untouched'
);

do $test$
declare
  retention_job_id bigint;
begin
  select job.jobid
  into strict retention_job_id
  from cron.job as job
  where job.jobname = 'villa-vessela-inquiry-retention';

  perform cron.alter_job(retention_job_id, active => false);

  select cron.schedule(
    'villa-vessela-inquiry-retention',
    '25 18 * * *',
    $job$select private.prune_expired_inquiries();$job$
  )
  into strict retention_job_id;

  perform cron.alter_job(retention_job_id, active => true);
end
$test$;

select ok(
  (
    select pg_catalog.count(*) = 1
      and pg_catalog.bool_and(job.active)
      and pg_catalog.bool_and(job.schedule = '25 18 * * *')
      and pg_catalog.bool_and(job.command = 'select private.prune_expired_inquiries();')
    from cron.job as job
    where job.jobname = 'villa-vessela-inquiry-retention'
  ),
  'replaying the named inquiry schedule keeps exactly one active canonical job'
);

select * from finish();

rollback;
