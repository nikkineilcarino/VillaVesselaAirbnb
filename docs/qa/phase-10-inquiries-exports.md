# Phase 10 QA — Inquiries and protected CSV exports

**Date:** 2026-07-23  
**Status:** Completed, not fully QA passed

## Scope delivered

Phase 10 implements the optional inquiry workflow without activating it by default. `CONTACT_INQUIRY_ENABLED` must be exactly `true` at server runtime for both the operational form and `/api/contact`; otherwise the Contact page retains its safe disabled preview and the endpoint returns 404.

Enabled submissions use same-origin JSON limited to 8 KiB. Validation sanitizes and bounds name, email, phone/messaging, message, dates, and guest count; requires name, message, consent, and at least one contact method; accepts two ordered preferred dates or neither; rejects past/over-two-year check-ins and Luhn-valid payment-card patterns; and never stores the session-scoped form client UUID. Honeypot, fill-time, per-client, and global limits add bounded abuse controls without retaining raw IP.

Approved administrators receive an RLS-backed inquiry page with an allowlisted status filter, twenty records per page, distinct loading/invalid/empty/unavailable/error states, and a status-only Server Action. Dashboard links expose three fixed export types. Each export independently repeats administrator authorization, validates the date range, reads through the authenticated RLS client in 1,000-row pages, stops at 10,000 rows, and returns a fixed attachment filename.

## Security and privacy assertions

- The service-role client is used only for the already validated public analytics and inquiry inserts. Administrator inquiry and export code has zero service-role consumers.
- There is no public inquiry read route or direct public database grant.
- A storage failure returns 503 and retains form fields; no failed inquiry is presented as stored.
- Logs use fixed labels and contain no payload, contact value, message, client UUID, token, or database error.
- CSV encodes every cell, doubles quotes, preserves line breaks, emits CRLF with UTF-8 BOM, and prefixes formula-like content after leading whitespace.
- Exports omit database IDs, session IDs, destination URLs, and secrets. Inquiry exports still contain voluntarily supplied personal data and are explicitly labelled private.
- The form asks for no payment-card or payment-account field and rejects apparent card numbers in its message.

## Automated results

| Check | Actual result | Status |
| --- | --- | --- |
| Lint | `npm run lint`; zero errors and zero warnings | Pass |
| Strict types | `npm run typecheck` | Pass |
| Unit tests | 8 files, 60 tests | Pass |
| Default Chromium suite | 43 passed; 2 live administrator tests explicitly skipped | Pass with documented skips |
| Enabled inquiry Chromium suite | 3 passed, including mobile fit, Axe, field/server/success/failure states, real invalid/unavailable API responses, and unauthenticated export denial | Pass |
| Production build | Next.js 16.2.11 build; Contact, contact API, admin inquiry, and export routes are dynamic | Pass |
| Dependency audit | 0 vulnerabilities | Pass |
| Lockfile install simulation | `npm ci --dry-run --ignore-scripts` | Pass |
| UTF-8 scan | 228 repository text files; 0 invalid UTF-8 and 0 mojibake-marker files | Pass |
| Private-contact comparison | 2 private mobile patterns detected in the supplied PDF; 0 repository and 0 built-output matches | Pass |
| Browser privilege scan | 0 service-role/key marker files in `.next/static` | Pass |
| Runtime boundary scan | 4 service-role reference files total: the factory plus exactly 3 public insert handlers; 0 administrator/export consumers | Pass |
| Raw-IP/log scan | 0 raw-IP runtime files and 0 sensitive log-pattern files | Pass |

## Browser behavior covered

Default mode verifies that all inquiry controls remain disabled with no action, the endpoint is unavailable, and an unauthenticated export request cannot return protected data. The separate enabled run verifies responsive 390 px layout, no automatically detectable Axe violation, accessible field errors, server-error presentation, successful reset, failed-request value retention, payment-field absence, invalid real endpoint rejection, and truthful 503 behavior when storage is not configured.

The default full suite also regresses public routes, navigation, content safeguards, gallery keyboard/focus behavior, administrator denial/login presentation, privacy-safe analytics, mobile overflow, and accessibility.

## Blocked live checks

Docker Desktop is installed but its Linux engine pipe is unavailable. No approved non-production Supabase project, service configuration, approved administrator, or unapproved test identity was supplied. Therefore these checks remain blocked rather than passed:

1. Apply and lint all migrations, compare generated database types, and execute anon/unapproved/approved/service role probes.
2. Persist one valid inquiry and prove invalid, spam, rate-limited, and disabled requests create no row.
3. Verify an approved administrator can read/filter/paginate inquiries and update only `status`.
4. Verify an unapproved authenticated identity cannot read, update, or export anything.
5. Download all three live CSV types for empty and populated ranges and reconcile headers, row contents, ordering, truncation, escaping, and filenames.
6. Inspect real cookies, private/no-store headers, concurrent updates, database outage recovery, and personal-data deletion/retention operations.

## Activation gate

Keep `CONTACT_INQUIRY_ENABLED=false` until the owner approves launch use and consent copy, retention/deletion procedures are documented, migrations and RLS are verified, server secrets are configured securely, dedicated role tests pass, and operational responsibility for private inquiry/export data is assigned.

## References reviewed

- Next.js data security: <https://nextjs.org/docs/app/guides/data-security>
- Next.js forms and Server Actions: <https://nextjs.org/docs/app/guides/forms>
- Next.js `use server`: <https://nextjs.org/docs/app/api-reference/directives/use-server>
- Next.js `revalidatePath`: <https://nextjs.org/docs/app/api-reference/functions/revalidatePath>
- OWASP CSV Injection: <https://owasp.org/www-community/attacks/CSV_Injection>
- MDN `Content-Disposition`: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition>
