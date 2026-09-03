# Supabase Database

## Purpose

This directory owns the versioned PostgreSQL schema, deny-by-default Row Level Security, administrator policies, RLS-aware aggregate views/functions, local CLI configuration, and synthetic development seed for Villa Vessela.

## Current files and migration order

1. `migrations/001_create_admin_profiles.sql` links manually approved Auth users to administrator authorization.
2. `migrations/002_create_analytics_tables.sql` creates privacy-limited page-view/link-click tables and indexes.
3. `migrations/003_create_inquiries_table.sql` creates bounded optional inquiry storage.
4. `migrations/004_enable_rls.sql` enables RLS and removes anon/authenticated privileges.
5. `migrations/005_create_admin_policies.sql` adds the hardened membership helper and administrator-only policies/grants.
6. `migrations/006_create_analytics_views.sql` adds security-invoker daily aggregates using Asia/Manila dates.
7. `migrations/007_create_dashboard_functions.sql` adds exact range-bounded dashboard aggregates without bypassing administrator RLS.
8. `migrations/008_add_waze_and_analytics_retention.sql` adds a distinct Waze category and daily analytics-only retention through Supabase Cron.
9. `migrations/009_add_inquiry_lifecycle.sql` adds inquiry retry idempotency, privacy-notice provenance, a service-role-only storage function, approved-administrator deletion, and a separate daily inquiry-retention job.
10. `seed.sql` adds only repeatable, visibly synthetic local demonstration records; it creates no Auth user or administrator.
11. `config.toml` configures local ports, migration/seed discovery, disabled signup, and no production secret.

## Access model

| Role/path | Profiles | Analytics | Inquiries |
| --- | --- | --- | --- |
| `anon` direct database access | None | None | None |
| Authenticated but unapproved user | None | None | None |
| Approved authenticated administrator | Read | Read | Read, update `status`, and invoke the confirmed one-UUID delete action |
| Full-privilege backend secret | Approved profiles may be provisioned only out of band | Used only by the two validated analytics insert handlers | Used by the default-disabled validated handler through the narrow inquiry-storage function |

There is intentionally no public insert policy. Analytics endpoints and the default-disabled inquiry endpoint independently validate/rate-limit payloads before using the isolated server-only service client. Inquiry storage additionally goes through `store_contact_inquiry(...)`, which is executable only by `service_role`, returns only created/identical-duplicate/conflict state, and never exposes a row. The modern backend secret maps to a full-privilege role and bypasses RLS; the database does not make that credential insert-only. Its effective narrowness comes from Production-only secret isolation and the reviewed handler call sites. Administrator dashboard/inquiry reads, status changes, and exports use the authenticated RLS client instead. Direct browser-role table DELETE remains revoked. Migration `009` grants authenticated callers only the one-UUID `delete_contact_inquiry` function, which independently checks the approved-admin helper; the application wraps it in an exact confirmed action and exposes no bulk workflow.

## Local setup and commands

Prerequisites are Node/npm, the locked Supabase CLI dependency, and a running Docker Desktop engine.

```powershell
npm ci
npm run db:start
npm run db:reset
npm run db:lint
npm run db:types
npx --no-install supabase test db supabase/tests/009_inquiry_lifecycle.test.sql --local
```

`db:types` prints generated TypeScript to standard output. Save it to a temporary review file and reconcile it with `src/types/database.ts`; do not blindly overwrite the reviewed application contract. `db:reset` destroys the local database only and reapplies all migrations plus `seed.sql`.

If Docker is unavailable, local reset, lint, generated-type comparison, role probes, and populated dashboard checks remain blocked rather than passed. Do not use lint against the older linked schema as evidence for a pending migration.

## Remote application

Do not link or push to a production project casually. After owner approval and secure authentication, inspect the exact project reference, run a dry review of pending migrations, apply them in order with the Supabase CLI, regenerate types, and perform the role matrix manually. Never place access tokens, database passwords, project references, or service-role keys in this directory.

## Administrator provisioning

Public signup remains disabled. Create the administrator Auth identity through the approved Supabase administrative interface, confirm its exact UUID, and insert one matching `admin_profiles` row through trusted SQL/service access as shown in `src/lib/auth/README.md`. The Auth identity alone is intentionally insufficient. Use a dedicated non-production approved account and a separate unapproved account for live Phase 7 tests before production provisioning. Removing the profile immediately removes application authorization; manage/revoke the underlying Auth sessions separately when offboarding.

## Security, privacy, and retention

- Analytics has no raw-IP, visitor/device-geolocation, fingerprint, or visitor-name column. An approved outbound destination may contain the intentionally public property pin, but that is not visitor geolocation.
- Inquiry fields are bounded and require a contact method, ordered dates when both exist, positive bounded guests, a message, and true consent.
- The guest-count maximum is an anti-abuse storage bound, not a booking/capacity promise.
- An inquiry is contact intake only, not availability confirmation, a booking, or a payment record. Confirmed booking and payment communication remains on the approved booking channel.
- Migration `009` adds unique, required `submission_id` and `privacy_notice_version` columns with no database defaults. Existing pre-version rows, if any, receive a random legacy retry identity and the honest `legacy-unversioned` notice sentinel. Every future insert fails closed unless trusted code supplies both fields. The enabled form sends one stable UUID v4 across retries and the rendered notice version as a freshness assertion; the server requires an exact current match and stores its own trusted notice constant. The session-scoped rate-limit UUID remains unstored.
- Migration `008` schedules one database-local job at 18:15 GMT (02:15 Asia/Manila) to delete only `page_views` and `link_clicks` once they are older than 365 days. A daily schedule can add up to one scheduling interval of delay.
- Migration `009` schedules the separate inquiry-only `villa-vessela-inquiry-retention` job at 18:25 GMT (02:25 Asia/Manila). It calls `private.prune_expired_inquiries()` to delete `contact_inquiries` rows strictly older than 365 days from `created_at`, regardless of status. A daily schedule or paused project can delay deletion; the analytics job never reads or deletes inquiries.
- Each private retention function accepts no caller-controlled cutoff, uses invoker rights, and is unavailable to `public`, `anon`, `authenticated`, and `service_role`. Its scheduling owner retains the required table authority. This EXECUTE denial does not reduce the deployed backend secret's separate full table authority.
- Migration `009` keeps direct authenticated table DELETE revoked and exposes only a one-UUID function that independently verifies approved-administrator status. The protected application action repeats authorization, UUID validation, and explicit confirmation and exposes no bulk workflow. Active-table deletion does not promise immediate removal from provider backups, browser autofill, a downloaded CSV, or a copy moved to an external contact channel; exported copies require their own secure deletion.
- Inquiry delivery creates no email, SMS, push, automatic response, or response-time promise. While enabled, the approved owner administrator checks `/admin/inquiries` daily.
- The privacy-minimized process-local limiter is not globally atomic across serverless instances and its client identifier can be rotated. It is accepted only for current low volume with daily monitoring and immediate feature disablement on spam or cost escalation; no raw IP is stored to compensate.
- Seed destinations use the reserved `.invalid` domain and seed inquiry identity is explicitly synthetic.
- Administrator profiles are never seeded because they require a real Auth user and explicit approval.

## Dormant application deployment boundary

Migration `009` remains unapplied to the linked project while the completed application hardening may be committed and deployed in dormant hidden mode. The remote production database remains on migrations `001`–`008`; Production `CONTACT_INQUIRY_VISIBLE` and `CONTACT_INQUIRY_ENABLED` remain false/absent until the later migration, role, publication, live-workflow, cleanup, and rollback checks pass.

## Files requiring careful review

Applied migrations are immutable history: fix later defects with a new migration rather than rewriting production history. RLS, grants, `private.is_approved_admin()`, security-invoker and narrowly reviewed security-definer functions, `seed.sql`, and `config.toml` require security review and live database tests after changes.

## Primary references

- Supabase Row Level Security guidance: <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Supabase table/view security guidance: <https://supabase.com/docs/guides/database/tables>
- Supabase server-side secret/service client guidance: <https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa>
- Supabase Cron guidance: <https://supabase.com/docs/guides/cron>
