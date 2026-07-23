# Phase 6 QA — Supabase Database

**Date:** 2026-07-23  
**Status:** Completed with live database checks blocked  
**Environment:** Windows PowerShell; Node.js v22.18.0; npm 10.9.3; Supabase CLI 2.109.1; Docker CLI installed but Docker Desktop engine unavailable  
**Scope:** Ordered SQL migrations, schema constraints/indexes, RLS/privileges/policies, aggregate views, local configuration, synthetic seed data, typed clients/schema, documentation, and static contract tests. Authentication UI, endpoint inserts, analytics collection, dashboard queries, operational inquiries, and remote deployment are excluded.

## Expected outcome

- Define `admin_profiles`, `page_views`, `link_clicks`, and `contact_inquiries` exactly enough for later phases without collecting invasive analytics fields.
- Bound text/contact/date/guest/status/category values and add indexes needed by time-bounded reporting.
- Enable deny-by-default RLS on every application table and grant no direct public insert/read/update/delete path.
- Allow only approved administrators to read protected records and update the inquiry `status` column.
- Preserve RLS through aggregate views and use Asia/Manila date grouping.
- Create no default administrator, credential, real visitor record, or real inquiry record.
- Provide optional typed browser/server clients and a separately isolated server-only privileged client.
- Apply, lint, regenerate types, and test roles when a disposable database is available; otherwise mark each check blocked.

## Files added

| File | Purpose |
| --- | --- |
| `supabase/migrations/001_create_admin_profiles.sql` | Auth-linked approved-administrator table and bounds. |
| `supabase/migrations/002_create_analytics_tables.sql` | Minimized page-view/link-click tables, categories, bounds, and indexes. |
| `supabase/migrations/003_create_inquiries_table.sql` | Optional inquiry table with contact, date, guest, consent, message, and status constraints. |
| `supabase/migrations/004_enable_rls.sql` | RLS activation and direct client privilege revocation. |
| `supabase/migrations/005_create_admin_policies.sql` | Private membership helper, administrator policies/grants, and narrow service grants. |
| `supabase/migrations/006_create_analytics_views.sql` | Four RLS-aware Asia/Manila daily aggregate views. |
| `supabase/config.toml` | Local CLI ports, migrations/seed, disabled signup, and password baseline. |
| `supabase/seed.sql` | Repeatable synthetic analytics/inquiry examples with no Auth/admin identity. |
| `supabase/README.md` | Local/remote workflow, role matrix, limitations, and sensitive-file guidance. |
| `supabase/migrations/README.md` | Migration order, safe-change rules, and required role probes. |
| `src/lib/supabase/client.ts` | Optional browser client using public configuration and RLS. |
| `src/lib/supabase/server.ts` | Optional cookie-aware server client using public configuration and RLS. |
| `src/lib/supabase/service.ts` | Separate server-only privileged client for future validated endpoints. |
| `src/lib/supabase/README.md` | Client trust boundaries, environment contract, and testing requirements. |
| `src/types/database.ts` | Reviewed TypeScript mirror of all public tables and views. |
| `src/types/README.md` | Type-generation/review and security guidance. |
| `tests/unit/database-schema.test.ts` | Static migration/config/seed contract coverage. |
| `docs/qa/phase-06-database.md` | This evidence report. |

## Files modified

- `package.json` and `package-lock.json` — exact `@supabase/supabase-js` 2.110.8, `@supabase/ssr` 0.12.3, Supabase CLI 2.109.1, and five database commands.
- `.gitignore` — ignores Supabase local runtime/link state but keeps migrations/config/seed tracked.
- `src/lib/README.md`, `src/app/README.md`, and `tests/README.md` — current trust boundaries, route independence, database tests, and live-test requirements.
- `README.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `QA_CHECKLIST.md`, `CONTENT_TODO.md`, `CHANGELOG.md`, and `DECISIONS.md` — Phase 6 status, architecture, decisions, evidence, and blockers.

## Schema and privacy audit

| Area | Verified static treatment |
| --- | --- |
| Administrator authorization | `user_id` references `auth.users`; only role `admin` is allowed; no identity/profile is seeded. |
| Page views | Random identifier/session text, normalized-path bound, optional referrer, coarse device/browser categories, timestamp; no raw IP/GPS/fingerprint/name field. |
| Link clicks | Allowed link types match the package; source/destination lengths are bounded; destination approval remains a Phase 8 server responsibility. |
| Inquiries | Contact method required, name/email/phone/message bounded, date order checked, guest count 1–100 storage bound, consent must be true, and status is constrained. |
| RLS | All four tables enabled; direct public/auth privileges revoked; no anon or insert policy; private helper checks `auth.uid()` membership. |
| Administrator access | Authenticated approved admins receive protected reads and only inquiry `status` updates. |
| Service access | Explicit insert-only grants for analytics/inquiries; broader profile operations exist only for out-of-band provisioning. |
| Views | Four `security_invoker`/`security_barrier` views; prior authenticated privileges revoked; select then granted and base RLS retained. |
| Seed | Fixed IDs, `[DEMO]` labels, reserved `.invalid` destinations, idempotent conflicts, and no Auth/admin insertion. |
| Retention | No invented deletion interval/job; unresolved periods remain in `CONTENT_TODO.md`. |

The inquiry guest maximum of 100 is a technical anti-abuse storage bound, not a statement that the property accepts that number of guests.

## Commands and actual results

| Check | Command | Actual result | Status |
| --- | --- | --- | --- |
| Dependencies | Exact npm installs | Supabase clients/CLI installed; audit reported zero vulnerabilities. | Pass |
| CLI/config parse | `npx supabase --version`; `npx supabase status --output json` | Version 2.109.1; configuration parsed and reached Docker inspection. | Pass for CLI/config |
| Local start | `npm run db:start` | Docker Desktop Linux engine pipe unavailable. | Blocked |
| Migration/seed execution | `npm run db:reset` | Docker Desktop Linux engine pipe unavailable. | Blocked |
| Database lint | `npm run db:lint` | Local PostgreSQL connection unavailable. | Blocked |
| Generated types | `npm run db:types` | Local Supabase database unavailable. | Blocked |
| Static database contract | `npm run test` | 2 files, 8 tests passed. | Pass |
| Lint | `npm run lint` | Exit 0. | Pass |
| Strict types | `npm run typecheck` | Exit 0. | Pass |
| Browser regression | `npm run test:e2e` | 31 Chromium tests passed. | Pass |
| Production build | `npm run build` | All implemented public routes prerendered successfully. | Pass |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities. | Pass |
| Lockfile/install shape | `npm ci --dry-run` | Exit 0 with platform-specific optional packages resolved. | Pass |
| Official security review | Current Supabase/PostgreSQL RLS, view, and privileged-client documentation | Private helper, scalar policy call, security-invoker views, and isolated plain supabase-js privileged client agree with guidance. | Pass |
| Bundle/source safety | Static/client bundle and import scans | Privileged environment reference/client absent from browser output and consumer modules. | Pass |
| Encoding | Numeric-code-point mojibake scan including SQL/TOML | No anomaly found. | Pass |
| Privacy | In-memory PDF contact comparison over repository/build files | Both redacted source contact patterns absent; values were never printed or stored. | Pass |

## Static test coverage

The eight unit tests include six database checks that verify:

- the exact migration order and required documentation headers;
- four required tables, source fields, allowed values, bounds, date/contact/consent checks, and representative indexes;
- RLS activation and privilege revocation for every table;
- no anon/direct insert policy and no broad `GRANT ALL`;
- private/search-path-hardened administrator membership and scalar policy calls;
- administrator status-only updates and explicit service insert grants;
- four security-invoker views with Asia/Manila date grouping;
- idempotent, visibly synthetic seed data with no administrator;
- disabled local general/email/SMS signup and no credential value in CLI configuration.

These tests inspect SQL structure. They do not parse or execute PostgreSQL and therefore do not replace the four blocked live checks.

## Issues found and fixes

1. **No local database runtime:** Docker CLI exists but the Docker Desktop Linux engine pipe is unavailable. All database commands were run and recorded as blocked; none is described as passed.
2. **Policy evaluation performance:** current RLS guidance recommends scalar subqueries around stable helper calls. All policy predicates now use `(select private.is_approved_admin())`.
3. **Legacy default view grants:** older projects may auto-expose new views. Migration `006` now revokes all authenticated view privileges before granting select only.
4. **Service-role table privileges:** bypassing RLS does not replace SQL table grants under current no-auto-expose defaults. Migration `005` now grants only event/inquiry inserts plus out-of-band profile provisioning operations.
5. **Privileged client isolation:** service keys must not be placed in an SSR cookie client. `service.ts` uses a separate `@supabase/supabase-js` client with session persistence/refresh/URL detection disabled.
6. **Unused configuration reference:** removed the default Studio AI environment reference because this project does not use or document it.
7. **npm cleanup warning:** installation reported a Windows `EPERM` while cleaning one optional nested directory. CLI execution, lockfile dry run, lint, tests, build, and audit all passed afterward.

## Manual verification required when unblocked

1. Start Docker Desktop and confirm its Linux engine is running.
2. Run `npm run db:start`, `npm run db:reset`, `npm run db:lint`, and save `npm run db:types` output to a temporary review file.
3. Compare generated types with `src/types/database.ts`; reconcile only reviewed differences.
4. Inspect all four tables, indexes, constraints, policies, and four views in local Studio at `http://127.0.0.1:54323`.
5. Probe anon and an authenticated-but-unapproved user: every protected select/insert/update/delete and every aggregate view must be denied.
6. Create a disposable Auth administrator manually, insert its profile through a trusted backend/SQL path, and verify protected reads plus inquiry `status` updates only.
7. Verify service insertion succeeds only for the three intended event/inquiry tables and that no public client receives the privileged credential.
8. Repeat against an approved non-production hosted project before any production migration.

## Remaining limitations

- SQL syntax/application, database lint, seed execution, generated types, indexes/constraints in catalog, and runtime RLS/grant behavior remain unverified until a database runs.
- No administrator identity or route exists; Phase 7 owns manual provisioning, sessions, authorization guards, and access tests.
- No endpoint consumes the service client; Phase 8/10 must add validation, sanitization, allowlisting, consent, rate limiting, and failure isolation before inserts.
- Analytics/inquiry retention and deletion procedures remain owner decisions.
- No remote Supabase project is linked and no migration has been pushed.

No known static/code defect blocks Phase 6 completion; the live database verification blockers remain mandatory before deployment.
