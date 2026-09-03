# Website Inquiry Activation Plan

**Created:** 2026-08-24
**Production site:** `https://villa-vessela-airbnb.vercel.app`
**Scope:** the public Contact inquiry form, personal-data storage and retention, protected administrator inquiry operations, inquiry CSV export, production activation, and complete QA
**Current step:** Step 4 passed — waiting for the next exact `continue` before Step 5
**Overall status:** The controlled inquiry implementation is published in owner-attributed commit `0f2ece8e082cf5f902ef8fba348202d43230aa77`, and GitHub Quality run `33793249269` passed all enabled, published-disabled, and unfinished-hidden gates. No automatic Vercel deployment was created for that commit, so the canonical site remains on the prior Ready disabled-preview deployment `dpl_F8ZpYmR1tS97u8jXQH56NZkVB227`. Linked Supabase migrations remain `001`–`008`, local migration `009` remains pending, and Step 4 made no Vercel environment, administrator-account, or production-data mutation.

## Purpose

This file is the authoritative control record for enabling Villa Vessela's website inquiry form without treating an implemented preview as an operational personal-data workflow. It separates design, implementation, database activation, public activation, live proof, cleanup, and final documentation so no unverified state is called complete.

The inquiry feature is complete only when a real consented browser submission is stored exactly once, the approved administrator boundary can review and manage it, unauthorized identities remain denied, protected CSV behavior is reconciled, retention and early deletion work, the exact synthetic record is removed, every regression gate passes, and the canonical Vercel deployment matches the final clean GitHub `main` commit.

## Confirmed baseline — 2026-08-24

- Local `main`, `origin/main`, and the live GitHub branch match clean commit `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40`.
- GitHub Quality run `32655552658` passed dependency audit, lint, strict types, unit tests, production build, and credential-independent browser tests.
- Vercel production deployment `dpl_F8ZpYmR1tS97u8jXQH56NZkVB227` is Ready, targets Production, uses Next.js with Node.js `22.x`, serves both canonical aliases, and was built from that exact commit.
- `CONTACT_INQUIRY_ENABLED` is present as a hidden Production-only variable but evaluates false. The Contact page shows the disabled preview, the Privacy page says inquiry collection is disabled, and `POST /api/contact` returns the documented private/no-store `404` disabled response.
- The shared Production Supabase backend secret is already required by active analytics. It is full privilege, sensitive, server-only, and must not be removed during an inquiry-only rollback.
- The linked Supabase project is healthy. Local and remote migrations match exactly for `001` through `008`, linked lint has no findings, one owner administrator remains approved, and the current inquiry count is zero at this baseline snapshot.
- Analytics is already active and may contain genuine consented events. Inquiry work must not delete, rewrite, relabel, or use those events as synthetic test data.
- The implemented inquiry boundary already has an exact server flag, dynamic form selection, bounded JSON, Zod validation and normalization, explicit consent, contact/date/guest limits, apparent payment-card rejection, a honeypot and fill-time check, process-local request limits, truthful `201`/`503` outcomes, fixed payload-free failure logging, a service-mediated insert, RLS-authorized administrator reads, status-only updates, and bounded/formula-safe private CSV export.
- Existing focused inquiry/CSV/schema tests pass, but enabled success is mocked or storage-unavailable locally. No production inquiry has yet completed `201` storage, administrator read, status mutation, inquiry CSV reconciliation, early deletion, retention deletion, and exact cleanup.

## Activation blockers confirmed by audit

This is the pre-remediation blocker list established in Step 0. Steps 1 and 2 now resolve items 1–7 locally, while production activation, provider/database proof, and the accepted low-volume residuals remain governed by Steps 3–7.

1. Inquiry records have no automatic retention job and no approved early-deletion workflow.
2. The public Privacy page is hard-coded to say inquiry collection is disabled and would become inaccurate if only the Vercel flag changed.
3. Approved administrators currently receive SELECT and status-only UPDATE access, with no exact per-record DELETE path.
4. A lost successful response can be retried as a second INSERT because submissions are not idempotent.
5. The request boundary accepts a missing `Origin`, although the workflow is browser-only and documentation describes a same-origin requirement.
6. The actual byte bound is checked after `request.text()` buffers the request body.
7. CI defaults to inquiry-disabled behavior; enabled-state success is not a complete regression gate.
8. The rate limiter is process-local and the client identifier can be rotated. It is not globally atomic across Vercel instances.
9. No email or SMS notification exists. Without adding another provider, the protected inquiry page is the only inbox.
10. Inquiry CSV files contain personal data and can outlive deletion from the active database if an operator downloads and retains a copy.

## Selected operating defaults

The user's request to enable website inquiries authorizes an activation workflow. Step 1 accepted the following recorded defaults; a later explicit user instruction may revise them before production activation:

- **Retention:** delete inquiry intake rows from the active database daily once they are strictly older than 365 days from `created_at`, regardless of status. The schedule may run up to one daily interval late, and a paused provider project can delay it further.
- **Intake, not booking:** an inquiry is only a request for a response. It is not availability confirmation, a booking record, or a payment record. A preferred stay may be up to two years away, so the intake row can expire before that stay; confirmed booking and payment communication must move to the approved booking channel.
- **Early deletion:** an approved administrator receives a protected, single-record hard-delete action with explicit confirmation. There is no bulk-delete action. A verified privacy request can therefore remove the exact row from the active inquiry table before automatic expiry.
- **Deletion wording:** active-table deletion is not a promise of instant universal erasure from provider backups, browser autofill, a downloaded CSV, or a message copied to an external contact channel. Each exported or external copy follows its own secure-deletion lifecycle.
- **Operator:** the existing approved owner administrator is the responsible operator and checks `/admin/inquiries` daily while the form is active. No new permanent administrator is created.
- **Notifications:** this activation adds no email, SMS, push, autoresponder, or service-level response promise. The administrator dashboard is the source of truth. A notification provider remains a future owner-approved extension point.
- **Abuse posture:** retain the current privacy-minimized honeypot, timing, per-client, and per-instance global limits; add accurate `Retry-After` behavior and stricter request handling. No raw IP storage, CAPTCHA, paid WAF, or new third-party service is added. The non-atomic low-volume risk is accepted only with daily monitoring and immediate disablement on spam or cost escalation.
- **Idempotency and consent provenance:** each genuine form submission receives a random per-submission UUID stored only to deduplicate retries, plus a server-selected privacy-notice version. The session-scoped rate-limit UUID remains unstored.
- **Environment scope:** Publication and collection are separate server-only controls. Preview, Development, and dormant Production keep `CONTACT_INQUIRY_VISIBLE=false` and `CONTACT_INQUIRY_ENABLED=false` unless an isolated QA command explicitly selects a tested mode. Production sets both true only after all database, privacy, role, and rollback gates pass. Enabling collection implies visibility in code even if the visibility variable is misconfigured false.

These are operational engineering defaults, not a claim of legal compliance or jurisdiction-specific advice.

## Non-negotiable execution rules

1. **One step per continuation.** Each exact user message `continue` authorizes only the next Pending step in this file. Complete that step, record evidence, run its QA, and stop.
2. **Read before acting.** Re-read this file and inspect Git, Vercel, Supabase, and production drift at the start of every step.
3. **Evidence before status.** Passed means directly observed. Implemented, inferred, skipped, and blocked are not synonyms for Passed.
4. **QA after every code change.** Every implementation step ends with proportional lint, type, unit, browser, schema, privacy, security, or documentation QA. Fix every in-scope failure before marking the step Passed.
5. **Full QA before and after activation.** Focused checks never replace the complete local, CI, build, database, production, privacy, accessibility, and security regression gates.
6. **Keep unfinished production hidden and disabled until authorized.** Before activation, Production must evaluate both `CONTACT_INQUIRY_VISIBLE` and `CONTACT_INQUIRY_ENABLED` false. Do not set collection true before the additive migration, active Privacy wording, deletion workflow, role probes, dormant deployment, and rollback checks pass. After any live inquiry has been stored, a collection rollback sets only `CONTACT_INQUIRY_ENABLED=false` and keeps visibility true so retained-record Privacy and administrator duties remain accessible; hide both only before storage or after all retained-data duties are complete.
7. **No invented guest data.** Live QA uses one uniquely marked synthetic inquiry with a reserved `.invalid` contact and random identifiers. It is never presented as a real lead.
8. **No PII in evidence.** Never print, screenshot, trace, commit, log, or return a submitted name, contact value, message, browser/session/submission UUID, database row ID, Auth ID, raw CSV body, or credential.
9. **Exact cleanup only.** Delete synthetic records only by their captured primary ID plus independent marker predicates. Never delete by a broad date range, global count, contact alone, or guessed row.
10. **Preserve genuine data.** Global counts are informational because a genuine visitor can submit after activation. Exact IDs and before/after identity sets, not an assumed zero total, prove cleanup.
11. **Preserve the owner account.** Do not reset, rotate, delete, or expose the retained owner administrator. Disposable approved/unapproved QA identities must be random, memory-only, and deleted exactly after use.
12. **Authenticated authorization remains authoritative.** Public/anonymous clients receive no direct inquiry table access. Administrator list, status, dashboard, and CSV operations remain RLS-bound. Exact deletion uses the authenticated request-scoped client and a one-UUID function that independently checks the same approved-admin helper, never the backend secret.
13. **Privileged insertion stays narrow.** Only a validated, bounded, same-origin, rate-limited, idempotent server request can reach the backend insert client. No payload or database error enters logs.
14. **No payment workflow.** Do not add card, bank, government-ID, password, medical, deposit, or payment fields. Airbnb-originated bookings and payments remain on Airbnb.
15. **CSV is private data.** Inquiry CSV must remain authorized, no-store, bounded, formula-safe, and absent from QA artifacts. Operators download only when necessary and delete copies when no longer needed or when a verified deletion request covers them.
16. **No silent notification promise.** Do not imply an email alert, automatic reply, response time, or booking confirmation that the system does not provide.
17. **No paid/new provider by assumption.** CAPTCHA, email delivery, distributed rate limiting, and WAF services require a separate owner decision if later needed.
18. **Analytics remains independent.** Inquiry consent never enables analytics. Inquiry rollback must not disable or remove the shared configuration required by already verified analytics.
19. **Safe migrations only.** Migration `009` is additive and migrations `001` through `008` remain immutable. Applied production history is corrected only through a new forward migration.
20. **Mandatory rollback.** Any live privacy, storage, authorization, deletion, reporting, navigation, accessibility, or security regression triggers immediate inquiry disablement and a fresh deployment before further investigation.
21. **Scoped Git operations.** Review and stage only inquiry-related files, preserve unrelated user work, scan for secrets/private values, use the configured owner attribution, push normally, and never force-push or rewrite history.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| Pending | Not started |
| In progress | Authorized by the current `continue` and actively being executed |
| Passed | Scope and required QA completed with recorded evidence |
| Blocked | The same external blocker has repeated through the required audit threshold and meaningful safe progress is impossible |

## Step plan

| Step | Scope | Completion evidence | Status |
| --- | --- | --- | --- |
| 0 | Establish rules and baseline | Current code/provider/database state audited; blockers and operating defaults recorded; control Markdown passes documentation QA; no runtime/provider/data mutation | Passed |
| 1 | Implement inquiry lifecycle and database security locally | Decision record added; migration `009` adds required retry identity, server-selected notice version, an approved-admin one-UUID deletion function with no direct browser-role table DELETE, owner-only 365-day pruning, and one distinct replay-safe cron job; types/schema docs updated; focused schema, authorization, retention, replay, unique-submission, and exact-delete QA pass locally; no remote migration | Passed |
| 2 | Harden public, API, privacy, administrator, and CI behavior | Exact Origin requirement and streaming byte bound; truthful status/`Retry-After` responses; idempotent store; dynamic enabled/disabled Privacy wording; just-in-time Privacy/retention consent link; operator/no-notification guidance; protected confirmed delete action; active-state admin clarity; feature-aware tests and both CI modes; focused lint/type/unit/component/browser/security QA | Passed |
| 3 | Run the complete isolated local release gate | Clean-install simulation; full and production dependency audits; lint; strict types; all unit/component tests; local migration reset/lint/generated-type comparison; complete Chromium coverage for unfinished-hidden plus focused published-disabled and enabled matrices; malformed/origin/size/spam/rate/idempotency/outage branches; hidden and protected admin/action/CSV boundaries; mobile/keyboard/Axe; production build and local production-mode smoke; secret/contact/PII/bundle/encoding/link scans | Passed |
| 4 | Review, commit, and push the implementation | Inquiry-only diff reviewed; no secrets, PII, production artifacts, or unrelated files; exact files staged; owner-attributed implementation commit pushed; GitHub Quality passed all three inquiry modes; local `main`, `origin/main`, and live GitHub branch matched with a clean worktree; Production visibility and collection were not changed; no automatic Vercel deployment was created, so the prior Ready canonical deployment remained unchanged and the first hidden deployment stays reserved for Step 5 | Passed |
| 5 | Apply the database lifecycle and deploy a dormant hidden release | Snapshot counts/IDs without PII; apply only migration `009`; local/remote `001`–`009` parity and linked lint; grants/RLS/function/cron ownership and denial checks; expired/current synthetic retention proof with exact cleanup; deploy exact clean commit with visibility false and collection false; canonical guest/admin inquiry surfaces absent, API private/no-store `404`, ordinary contacts/privacy/headers intact, and hidden rollback target verified | Pending |
| 6 | Publish, enable Production, and prove the full live inquiry workflow | Set Production visibility and collection true through a value-suppressed channel; deploy exact clean SHA; Ready/canonical/source verification; enabled Contact, Privacy, and administrator behavior; non-writing invalid/cross-origin/missing-origin/media/oversize/honeypot probes; one synthetic browser inquiry stored idempotently; exact database/admin/dashboard/filter/status/CSV reconciliation; unauthenticated/unapproved denial; protected exact delete; disposable-user and row cleanup; genuine data preserved; collection-only rollback with continued retained-record visibility on any post-storage critical failure | Pending |
| 7 | Complete final regression, evidence, and handoff | Repeat complete local/CI and non-inserting production regression; document exact activation evidence and residual limits; reconcile README, architecture, checklist, decisions, TODO, owner guide, deployment runbook, Supabase docs, Phase 10 follow-up, changelog, handoff, Privacy date, and this plan; docs-only commit/push; final Ready deployment matches clean GitHub `main`; operator receives admin URL, daily routine, retention/deletion, CSV, monitoring, and rollback guidance | Pending |

## Required acceptance matrix

Every row below must pass before Step 6 may leave Production inquiries enabled.

| Area | Required proof |
| --- | --- |
| Unfinished-hidden | With visibility and collection false, Contact and Privacy contain no inquiry UI or inquiry-specific copy; approved external contacts remain usable; administrator navigation, metrics, recent-row query/table, direct page, actions, and inquiry export are absent or not found; API returns private/no-store `404` |
| Published-disabled fallback | With visibility true and collection false, Contact shows a non-submitting disabled fieldset, Privacy accurately covers retained records and retention, approved administrators retain lifecycle/export access, API returns private/no-store `404`, and approved external contacts remain usable |
| Enabled public UI | With the flag true, Contact shows the operational form, Privacy accurately discloses fields, purpose, random technical identifiers, administrator/export access, retention, deletion, providers/copies, and no booking/payment/notification promise |
| Accessibility | Unfinished-hidden, published-disabled, and enabled modes fit mobile widths and pass keyboard, focus, labels/errors/status, pending-state, reduced-motion where applicable, and automated Axe checks |
| Valid submission | One explicit-consent browser submission returns `201`, stores one exact normalized `new` row, stores no session rate-limit UUID, and exposes no sensitive response field |
| Idempotent retry | Replaying the same per-submission UUID returns a safe accepted outcome but leaves exactly one database row; a later distinct form submission receives a distinct UUID |
| Invalid requests | Validation `400`, cross-origin/missing-origin `403`, oversized `413`, unsupported media `415`, rate-limited `429`, and disabled `404` store no row and use private/no-store bounded responses |
| Spam decoy | A filled honeypot returns deliberate `202` without storage; ordinary browser autofill does not fill the hidden field or cause a false positive |
| Storage failure | Missing/unavailable storage returns truthful `503`, keeps public pages/contact channels usable, retains form entries, and logs no payload/database detail |
| Administrator read | Only an authenticated approved profile can find the exact QA row, filter/paginate it, and see the intended fields; public, anonymous, logged-out, and authenticated-unapproved callers receive no data |
| Status mutation | Approved administrator changes only the exact row's allowlisted status; invalid ID/status and unapproved callers fail without changing any field |
| Early deletion | Approved administrator confirms and hard-deletes only one exact inquiry; no bulk delete exists; the active row becomes absent and unrelated rows are preserved |
| Retention | Exactly one separate active inquiry cron job calls the parameter-free owner-only function; an expired synthetic row is removed, a current control row and all analytics remain, app roles cannot invoke pruning, and all QA controls are deleted |
| Dashboard | Inquiry summary and recent activity reconcile with the exact stored row and selected Asia/Manila range before cleanup |
| Inquiry CSV | Approved download is private/no-store, bounded, fixed-name, formula-safe, and reconciles the exact QA row in memory; IDs/secrets are absent; logged-out/unapproved access returns no CSV; no raw file remains |
| Privacy request process | Operator guidance covers identity verification, exact active-table deletion, separately deleting CSV/external copies, provider-backup caveat, and non-disclosing responses |
| Abuse and monitoring | Local limiter boundaries pass without saturating canonical production; the admin daily-monitoring/no-notification default is visible; spam/cost escalation has an immediate disable-and-redeploy trigger |
| Regression | Public routes, contact links, maps, analytics consent/delivery, admin auth/dashboard, SEO, security headers, accessibility, photos/content, unfinished-hidden behavior, and published-disabled rollback behavior remain intact |
| Release integrity | GitHub Quality passes; canonical Vercel deployment is Ready and built from exact clean `main`; migration history/lint and env-name/scope checks pass; no secret, credential, PII, or configured private value enters source or evidence |

## Live synthetic-data protocol

- Capture a database baseline and time boundary without selecting or printing personal fields.
- Generate one random submission UUID and a unique synthetic marker entirely in process memory. Use a reserved `.invalid` contact and plainly synthetic content; never use the owner's or a real guest's details.
- Execute non-writing rejection probes before the one valid browser submission. Never saturate production rate limits.
- Require the valid response to be `201`; `202`, `400`, `403`, `404`, `413`, `415`, `429`, `503`, timeout, or an unexpected status is not storage success.
- Query the candidate using the exact private submission UUID/marker pair, capture its primary ID in memory, and require exactly one matching row.
- Reconcile the row through approved admin list, dashboard, status mutation, and inquiry CSV. Do not print or retain the row or CSV content.
- Prove unauthorized denial with disposable identities. Never use the full-privilege backend client as administrator/RLS evidence.
- Delete the exact inquiry through the protected confirmed action. Verify the captured primary ID and marker are absent while all non-QA identifiers remain.
- Delete disposable Auth users/profile rows and verify the retained owner administrator is unchanged.
- If any count or identity predicate is ambiguous, stop and disable inquiries. Never broaden cleanup.

## Rollback

The known pre-inquiry immutable fallback is:

- Deployment: `dpl_F8ZpYmR1tS97u8jXQH56NZkVB227`
- URL: `https://villa-vessela-airbnb-2tdigmfxx-nikkineilcarino-2938s-projects.vercel.app`
- Source: `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40`
- Inquiry behavior: disabled form and private/no-store API `404`

No automatic deployment was created during Step 4, so this remains the last known immutable deployed fallback. Its visible disabled preview does not satisfy the owner's newer unfinished-hidden request. Step 5 must create and verify the first dormant hidden deployment as the preferred pre-activation rollback without deleting this historical reference.

If activation fails:

1. Promote the known-good immutable deployment if the canonical application is unsafe.
2. Set Production `CONTACT_INQUIRY_ENABLED=false` through a value-suppressed channel and create a fresh deployment so future builds remain unable to collect. If no live inquiry was ever stored and no retained-data duty exists, also set `CONTACT_INQUIRY_VISIBLE=false`; otherwise keep visibility true.
3. Before any storage, verify the canonical Contact/Privacy/admin inquiry surfaces are absent and `/api/contact` returns `404`. After storage, verify the published-disabled Contact and Privacy state, retained-record administrator access, and the same API `404`. In both cases, approved external contact links still work, analytics remains active, and all administrator routes remain protected.
4. Keep the shared Supabase backend secret because active analytics depends on it.
5. Keep the inquiry retention job active for any rows already collected. Do not remove retention merely because new collection is disabled.
6. Do not rewrite or destructively reverse applied migration `009`. Use a reviewed additive forward fix; unschedule only the exact inquiry job if the job itself is faulty.
7. Delete only uniquely identified synthetic QA rows. Never delete genuine inquiries during rollback except under the approved retention or verified privacy-request procedure.

## Step 0 evidence — 2026-08-24

**Outcome:** Passed. Three independent read-only audits and the primary repository review confirmed the current Git, Vercel, Supabase, public/API, code, test, privacy, retention, administrator, CSV, and release state. The existing feature is implemented but intentionally not activation-ready.

- The pre-plan worktree was clean, and local `main`, `origin/main`, and the live GitHub branch were synchronized at `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40`; the final GitHub Quality run passed.
- Vercel is Ready from the same source; Contact/Privacy display disabled inquiry truth, the endpoint returns private/no-store `404`, and protected inquiry administration redirects unauthenticated users to fixed login.
- Supabase is healthy, migrations `001`–`008` match and lint cleanly, the baseline inquiry count is zero, and one owner administrator remains authorized.
- Existing focused inquiry/CSV/schema tests passed 24 of 24 during the code audit.
- The audit found no reason to rewrite the existing validation, public-insert isolation, RLS read/status boundary, or CSV escaping design; it identified the explicit blockers and reliability hardening recorded above.
- No production request capable of storing an inquiry was sent. No file other than this control document, provider setting, database object/row, deployment, credential, or administrator identity was changed.

## Step 1 evidence — 2026-08-24

**Outcome:** Passed. Inquiry lifecycle and database authorization were implemented and executed only in the local Supabase test stack. Production collection remains disabled, and the linked project remains on migrations `001` through `008` with local migration `009` still pending.

- Decision 038 records the intake-only purpose, strict 365-day active-table retention, notice provenance, submission identity, exact early-deletion boundary, daily operator responsibility, export/copy limits, and accepted low-volume abuse-control residual.
- Migration `009` adds required `submission_id` and `privacy_notice_version` fields with honest legacy backfill and no future database defaults. The unique submission constraint provides the database half of retry deduplication; Step 2 subsequently supplied and reused a stable client submission UUID.
- Direct inquiry-table DELETE remains denied to browser roles. An approved administrator can invoke only the fixed one-UUID deletion function, which independently checks the approved-admin helper and can delete at most the selected primary-key row.
- A separate parameterless owner-only inquiry pruning function deletes active-table inquiry rows strictly older than 365 days. Its distinct replay-safe Cron job is scheduled for `18:25` GMT and does not alter the analytics retention job.
- Migration replay through `001`–`009`, seed execution, and local database lint passed. The dedicated transactional pgTAP suite passed 21 of 21 checks and rolled back all synthetic rows.
- Generated local Supabase types reconciled with the reviewed TypeScript database contract. The full unit/component suite passed 80 of 80 tests; ESLint and strict TypeScript checks passed.
- An independent security review initially identified unsafe permanent defaults and overly broad direct table deletion. Both were replaced with fail-closed required fields and the exact-ID function; the final independent review passed, including a separate 21-of-21 pgTAP run and 23-of-23 focused schema/inquiry tests.
- The final scoped-diff, whitespace, UTF-8, BOM, mojibake, generic-secret, and ignored-local-environment-value checks passed. No credential, contact value, personal data, or production artifact was added.
- Read-only linked checks confirmed migration `009`, the inquiry pruning function, and the inquiry Cron job are absent from production, and the production inquiry count remains zero at this evidence snapshot. Contact and Privacy still present disabled-mode truth, and the production contact API still returns the private/no-store disabled response.
- No remote database migration, provider setting, deployment, production inquiry, administrator account, Git commit, or Git push was created in Step 1.

## Step 2 evidence — 2026-08-24

**Outcome:** Passed. The public, API, Privacy, administrator, and CI inquiry paths are hardened and verified locally. Production inquiry collection remains disabled, migration `009` remains local-only, and no remote database, Vercel, production-data, administrator, Git commit, or Git push mutation occurred.

- The browser now creates a random UUID-v4 per logical submission, keeps it distinct from the unstored rate-limit session UUID, reuses it only for retries, and rotates it only after a verified accepted response. The rendered privacy-notice version is sent only as a freshness assertion; the server must match it to the current reviewed version and stores its own trusted constant.
- Storage now calls the fixed-search-path, service-role-only `store_contact_inquiry(...)` function. It returns only `created`, identical `duplicate`, or changed-payload `conflict`; it never returns a row, overwrites an existing inquiry, or treats changed details under the same retry identity as accepted.
- The endpoint requires the exact configured browser Origin, rejects a missing or malformed Origin, stops reading once the actual body exceeds 8 KiB, keeps disabled-first behavior, emits private/no-store responses, and supplies the remaining fixed-window duration through `Retry-After` on `429`.
- Response semantics are truthful: first storage is `201`, an identical retry is `200`, changed data under the same submission ID is `409`, honeypot traffic is the deliberate non-storing `202`, validation/storage/disabled failures remain distinct, and the form clears only when an accepted status also contains the fixed `received` body.
- Enabled Contact and Privacy views now disclose the intake purpose, fields and minimized technical identifiers, daily administrator review, absence of notifications/booking/payment promises, 365-day active-table retention, exact early deletion, CSV/external/provider-copy boundaries, and the current notice version. Disabled mode remains truthful and usable.
- The protected inquiry page now exposes value-safe operational readiness, the newest authorized timestamp, daily operator guidance, and one separately confirmed per-record delete action. That action reauthorizes the request, validates one UUID plus exact confirmation, and invokes only the independently authorized one-UUID database function through the signed-in RLS client.
- CI now builds and runs the credential-independent browser suite with inquiries enabled and separately proves the disabled fallback. Discovery, Contact, Privacy, and accessibility tests are feature-aware instead of hard-coding the pre-activation state.
- Local migration replay through `001`–`009`, seed execution, local database lint, and generated-type reconciliation passed. The dedicated lifecycle pgTAP suite passed 29 of 29 checks, including UUID-v4 rejection, service-only store permissions, created/duplicate/conflict behavior, exact admin deletion, retention isolation, and replay-safe scheduling; all transactional rows rolled back.
- A real local HTTP-to-database proof passed: the first synthetic submission returned `201`, an identical retry returned `200`, changed data returned `409`, exactly one original row remained with the trusted notice version, and the one synthetic row was then deleted exactly. Earlier orchestration attempts stopped before delivery or after the already-passing endpoint checks because PowerShell misclassified CLI notices; they caused no production request, and the one local row from the latter attempt was identified and deleted exactly before the final clean proof.
- ESLint and strict TypeScript passed. The complete unit/component suite passed 90 of 90 tests. The focused inquiry/discovery/privacy Chromium matrix passed 19 tests with one mutually exclusive disabled-mode skip; the separate disabled fallback passed 1 of 1. Form errors, including a stale notice, are announced once, referenced by the form, focused, and preserve entries.
- The independent final review passed after verifying the narrow store boundary, conflict semantics, UUID-v4 enforcement, notice freshness, exact Origin, streaming size limit, truthful success handling, administrator deletion, operational status, Privacy wording, accessibility, and current documentation. Its separate focused suite passed 33 of 33 tests, plus scoped ESLint, strict TypeScript, and diff checks.
- Documentation reconciliation, whitespace, UTF-8, final-newline, stale-wording, Markdown-link, and credential-pattern checks passed for the Step 2 documentation slice. Generated Playwright artifacts were removed, and the local Supabase/Next test services were stopped after verification.
- The final closure scan covered all 43 changed/untracked paths: zero staged files, invalid UTF-8 files, BOMs, mojibake markers, missing final newlines, generic secret-pattern hits, ignored local-environment value matches, stale Step 2 phrases, or Playwright artifacts. `git diff --check` passed; Git's Windows line-ending notices were not whitespace defects.
- Final read-only drift checks confirmed local/upstream/live Git still match `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40`, the linked database still has only migrations `001`–`008`, no migration `009` functions/job, and zero inquiry rows at that snapshot. Canonical Contact and Privacy still render disabled-mode truth, and the production API still returns the exact private/no-store/nosniff `404` disabled response. No valid production inquiry payload was sent.

## Step 3 evidence — 2026-08-31

**Outcome:** Passed. The complete isolated local release gate is green. Production collection remains disabled, migration `009` remains unapplied remotely, and this step made no Git commit/push, Vercel configuration/deployment, remote database write, production inquiry, or administrator-account change.

- Start and end drift checks matched local `main`, its upstream, and the live GitHub branch at `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40` with divergence `0/0` and zero staged files. Vercel deployment `dpl_F8ZpYmR1tS97u8jXQH56NZkVB227` remained Ready and Production on the canonical alias.
- `npm ci --dry-run --ignore-scripts` completed as a clean-install simulation. Full and production-only dependency audits reported zero vulnerabilities at every severity. Lockfile v3 reconciled exactly with the package manifest: all 556 registry entries had integrity metadata, with no non-registry or deprecated resolution. `npm ls` had no missing or invalid dependency; its six ignored local extras were optional WASM/Sharp runtime artifacts and are absent from the deployable lock graph.
- Full ESLint and strict TypeScript checks passed. The complete unit/component suite passed 90 of 90 tests after the Step 3 hardening changes.
- A clean local Supabase reset replayed migrations `001`–`009` and the seed, database lint returned no findings, generated types reconciled, and the dedicated lifecycle pgTAP suite passed 29 of 29 checks. An independent transaction proved created/duplicate/conflict storage, unauthorized denial, approved read/status/exact deletion, strict 365-day pruning, and analytics preservation, then rolled back every synthetic row. The local Supabase stack was removed afterward.
- The final inquiry-enabled Chromium run passed 52 tests with four intentional mutually exclusive or credential-gated skips and zero retries. It covered the public site, consent analytics, inquiry form retry identity and stale-notice accessibility, malformed/origin/media/size/validation/honeypot/storage/rate branches, logged-out inquiry/CSV denial, mobile layout, keyboard/focus behavior, security headers, metadata, and automated Axe checks.
- The final inquiry-disabled Chromium matrix passed 18 tests with two intentional enabled-only skips and zero retries. Disabled Contact, Privacy, API, public discovery/contact links, maps, security, responsive behavior, and accessibility therefore remain a tested rollback mode. Earlier discarded harness attempts were traced to a missing local port and deliberately synthetic map fixtures that did not satisfy the application's approved domain/initial-zoom contract; the corrected no-retry matrix is the authoritative result.
- The expanded real HTTP API proof passed missing- and cross-origin `403`, unsupported media `415`, malformed JSON `400`, over-8-KiB `413`, validation `400`, honeypot `202`, unavailable storage `503`, and fixed-window `429` with `Retry-After`; responses remained private/no-store/nosniff. Random UUID-v4 attempt identifiers prevent retries or shared server buckets from contaminating the evidence, and inquiry tests retain no screenshots, traces, or videos containing submitted values.
- One early full-browser run encountered a transient development-router analytics `404`; the exact focused test then passed, and the final complete enabled run passed cleanly with zero retries. A local production-smoke string probe also looked for a post-choice analytics label before consent; the complete browser suite exercised the actual undecided/accept/decline/settings workflow and is the authoritative consent result.
- A sanitized inquiry-enabled production build compiled, type-checked, and emitted the expected static/dynamic route set, including 13 static pages and the protected/admin/API routes. Local production-mode smoke returned `200` for nine public routes, fixed unauthenticated redirects for protected pages/CSV, the expected inquiry API status matrix, CSP/HSTS/frame protections, no framework disclosure header, and no residual listener after exact shutdown.
- Final source and bundle review found zero generic secret patterns, credentialed database URLs, private keys, ignored local-environment value matches, non-fixture owner emails/phones/contact URLs, or client-module references to non-public/server credentials. All 284 Git-visible text files were strict UTF-8 with no BOM, replacement character, mojibake marker, or missing final newline; 70 Markdown files had zero broken relative links; 31 static bundle files had zero secret/private-value match.
- `git diff --check` passed. No Playwright report, screenshot, trace, video, CSV, HAR, QA server, workspace Supabase container, or local database row remained. Git's Windows LF-to-CRLF notices are checkout-policy notices, not whitespace defects.
- An independent final review found no blocking issue. It reconfirmed the narrow request/storage/admin/migration boundaries and the accepted process-local rate-limit residual. Its release-order guard was applied: disabled Privacy wording now describes the daily retention process as a prerequisite to activation, and Step 4 must verify any automatic Vercel build stays dormant before migration `009` is applied. Follow-up ESLint, strict types, all 90 unit/component tests, the sanitized production build, and two enabled plus two disabled Privacy Chromium checks all passed.
- Final read-only provider checks found linked migrations `001`–`008` lint-clean with local `009` still pending. The protected inquiry table's estimated row count remained zero, and the new store/delete/prune functions, lifecycle columns, and named inquiry-retention Cron job remained absent remotely. Canonical Contact and Privacy returned `200` with disabled truth, while `POST /api/contact` returned private/no-store/nosniff `404`.
- Authorized approved-admin list/filter/status/dashboard/CSV and exact-delete reconciliation against one live synthetic row intentionally remains Step 6 evidence; Step 3 proved the local database roles/functions and the logged-out HTTP boundary without creating or using production credentials.

### Owner-requested visibility addendum — 2026-08-31

**Outcome:** Passed. A separate fail-closed server-only publication boundary now hides the unfinished website inquiry feature from guest and administrator interfaces without weakening the collection gate. This addendum made no commit/push, Vercel change/deployment, remote migration/data write, production request, or administrator-account change.

- `CONTACT_INQUIRY_VISIBLE=false` plus `CONTACT_INQUIRY_ENABLED=false` omits inquiry-specific Contact and Privacy output; removes administrator inquiry navigation, metrics, recent-row query/table, and export links; returns not found for the direct protected page, direct mutation actions, and approved inquiry CSV; and leaves the API on its private/no-store `404`. Ordinary configured contact channels and analytics remain independent.
- `CONTACT_INQUIRY_VISIBLE=true` plus collection false preserves the reviewed published-disabled UI and retained-record Privacy/administrator duties. Collection true implies visibility and preserves the operational form. The 31 August 2026 Privacy notice date, client freshness assertion, server validation, and stored notice version now share one constant.
- ESLint and strict TypeScript passed. Thirteen unit/component files passed 100 of 100 checks, including executed hidden administrator navigation/page/metadata/action/export boundaries and hidden public output containing no inquiry text. A sanitized hidden-mode production build compiled and emitted the complete expected route set.
- The final complete unfinished-hidden Chromium run passed 51 checks with six intentional credential-, analytics-mode-, or mutually exclusive inquiry-mode skips and zero retries. The focused enabled matrix passed 19 with two mutually exclusive skips; the focused published-disabled matrix passed 18 with three mutually exclusive skips. All three runs used synthetic public configuration and retained no submitted-value artifacts.
- An independent read-only audit found no guest-visible hidden-mode leak. Its initially reported dashboard PII query, Server Action bypass, consent-version mismatch, stale component documentation, and three-mode plan gaps were corrected; authorized live administrator/data reconciliation remains deliberately reserved for Step 6.

## Step 4 evidence — 2026-09-04

**Outcome:** Passed. The inquiry implementation was reviewed, committed, pushed, and accepted by GitHub Quality. Production remained unchanged because no automatic Vercel deployment occurred. Migration `009`, inquiry publication/collection, administrator accounts, and production data were not changed.

- The exact reviewed set contained 67 inquiry-related files with 3,593 insertions and 404 deletions. It had no unstaged or untracked companion changes, passed `git diff --cached --check`, and contained no credential, private key, token, generated build/test artifact, unrelated feature, or newly introduced Evelyn contact detail. `.env.example` added only the safe `CONTACT_INQUIRY_VISIBLE=false` placeholder.
- Owner-attributed implementation commit `0f2ece8e082cf5f902ef8fba348202d43230aa77` was pushed normally to `main`; its author and committer are `nikkineilcarino <261335732+nikkineilcarino@users.noreply.github.com>`. Local `main`, `origin/main`, and the live GitHub branch matched that commit with a clean worktree before this evidence-only documentation update.
- GitHub Quality run `33793249269` completed successfully from `0f2ece8e082cf5f902ef8fba348202d43230aa77` at 2026-09-03 18:58:06 UTC. It included the credential-independent browser suite, the published-disabled fallback, and the unfinished-hidden fallback.
- Read-only Vercel checks continued for more than seven minutes after the push and found no queued, building, failed, or Ready deployment for the new source. GitHub exposed no Vercel deployment or commit check for that SHA. No alias, setting, environment value, or deployment was changed.
- The canonical alias therefore still resolves to Ready deployment `dpl_F8ZpYmR1tS97u8jXQH56NZkVB227`, immutable URL `https://villa-vessela-airbnb-2tdigmfxx-nikkineilcarino-2938s-projects.vercel.app`, from source `2c85f97d37c403ad5be4cc84a1e01c2e5823cd40`. It remains the historical disabled-preview fallback; production hidden-state smoke was not represented as passed because the new hidden build was not deployed.
- Production `CONTACT_INQUIRY_VISIBLE` remained absent, `CONTACT_INQUIRY_ENABLED` remained false, and linked Supabase migrations remained `001`–`008` with local `009` pending. No valid production inquiry request, database write, administrator sign-in, or account mutation occurred.

## Next authorized action

No further action is authorized in this step. The next exact `continue` authorizes **Step 5 only**: take value-safe database snapshots, apply only migration `009`, prove local/remote migration parity plus grants/RLS/functions/Cron/retention behavior with exact synthetic cleanup, and deploy the exact reviewed source as a dormant hidden release with Production visibility and collection false. Verify canonical guest and administrator inquiry surfaces are absent, `/api/contact` remains private/no-store `404`, ordinary contacts, Privacy, analytics, and headers remain intact, and record the first immutable hidden rollback. Do not publish or enable inquiry collection; those remain Step 6.
