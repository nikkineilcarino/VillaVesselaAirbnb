# Analytics and Administrator Remediation Plan

**Created:** 2026-08-10
**Production site:** `https://villa-vessela-airbnb.vercel.app`
**Scope:** first-party page-view and approved external-link analytics, their Supabase storage, and the protected administrator reporting experience
**Current step:** Step 5 -- reviewed commit and push
**Overall status:** In progress; production analytics remains disabled until the production-activation step passes its prerequisites

## Purpose

This file is the control document for repairing the empty analytics dashboard. It prevents assumptions from being presented as results, limits each `continue` to one defined step, and records the evidence required before production is changed.

The repair is complete only when a real public browser session can create an approved page-view event and an approved contact-link event, Supabase persists both, the approved administrator can see the correct aggregates and recent activity, unauthorized users remain denied, and the final production deployment passes regression and security checks.

## Confirmed baseline

The current empty dashboard has a known configuration cause:

- Production was deliberately released with `ANALYTICS_ENABLED=false`.
- The public layout passes that flag to `AnalyticsProvider` and `PageViewTracker`. When it is false, no visitor/session identifier is created and no page-view or link-click request is dispatched.
- Both analytics API routes return a no-op `204` while analytics is disabled.
- `SUPABASE_SERVICE_ROLE_KEY` was deliberately omitted from Vercel. Without that server-only credential, an enabled endpoint still cannot persist an event and returns a failure-isolated `202`.
- Supabase migrations `001` through `007`, administrator authentication, the approved `admin_profiles` authorization row, protected dashboard queries, and the empty dashboard state were previously verified in production.
- This repository uses its own Supabase-backed analytics. It does not install or feed Vercel Web Analytics, so Vercel's Analytics tab is not the reporting surface for these custom contact-click events; `/admin/dashboard` is.
- The Contact page's configured channels use `TrackedExternalLink`, but complete repository-wide external-link coverage still requires audit. One known gap is the Waze navigation anchor, which currently uses a plain `<a>` and therefore cannot create a link-click event.
- No production page-view or link-click insertion/readback has yet been proved. Populated dashboard metrics, charts, recent-activity tables, and analytics CSV reconciliation must therefore remain labelled unverified until the live proof step.

The baseline is evidence, not the final diagnosis. Later steps must still rule out destination mismatches, browser delivery failures, database grant/RLS problems, date-range errors, aggregation defects, and stale production builds.

## Non-negotiable execution rules

1. **One step per continuation.** Each exact user message `continue` authorizes only the next pending step in this file. Complete it, record evidence here, and stop.
2. **Read before acting.** At the start of every step, re-read this document, inspect the current Git status, and check whether production or repository state changed since the previous step.
3. **Evidence before status.** A check is `Passed` only after its command, browser observation, database result, or provider state was directly observed. Implemented, inferred, skipped, and blocked are not synonyms for passed.
4. **No invented data.** Never insert fake guest inquiries or present demonstration analytics as real traffic. Live QA events must use clearly isolated random test identifiers and must be removed after reconciliation without touching genuine visitor records.
5. **No secret exposure.** Never write, commit, print, screenshot, or return the Supabase service-role key, database password, administrator password, access token, or private test credentials. The service key must remain server-only and must never use a `NEXT_PUBLIC_` name.
6. **Least privilege.** Public browsers must not receive direct analytics-table access. Validated server endpoints own inserts; approved administrator sessions own reads through RLS. An authenticated but unapproved user must remain denied.
7. **Privacy minimization.** Do not add raw IP addresses, exact device location, fingerprinting, full user-agent strings, full referring paths, names, emails, phone numbers, message contents, or claims that analytics identifies a person. Administrator pages are never tracked.
8. **Truthful metrics.** Use "estimated anonymous visitors" or the more precise consent-qualified wording selected during implementation. Do not claim to know who clicked a contact link.
9. **Complete link coverage.** Every rendered, owner-approved external booking, social, messaging, phone, email, Google Maps, and Waze action must use the tracked-link boundary or be explicitly documented as intentionally untracked. Navigation must still work if analytics fails.
10. **No silent drops in QA.** Public analytics remains best-effort for guests, but production QA must distinguish `201 Stored`, `204 Disabled`, `202 Dropped`, `400 Invalid`, `403 Cross-origin`, and `429 Rate-limited`. A dropped QA event is a failure, not a pass.
11. **No unrelated work.** Do not change property facts, contacts, rates, photos, inquiry activation, domain settings, or unrelated UI during this remediation. `CONTACT_INQUIRY_ENABLED` remains false.
12. **Safe database changes.** Migrations are additive, ordered, reviewed, and linted. No genuine production analytics record may be deleted except by the separately documented retention rule after it becomes applicable.
13. **Privacy and retention before activation.** Before production collection is enabled, publish truthful active-state privacy wording, require an explicit `Allow analytics` choice before identifier/event creation, preserve a functional `Decline` choice and later preference change, and implement/document a 365-day maximum analytics retention process. The configured public Contact channel is the privacy-request route; its actual value stays out of Git.
14. **QA after every implementation step.** Every step that changes application code, tests, database objects, configuration, or documentation must end with QA proportional to that step before it can be marked `Passed`. At minimum, run the directly affected lint, type, unit, component, browser, schema, security, or documentation checks; record the exact evidence and fix all in-scope failures before stopping. These per-step checks do not replace the later complete regression gate.
15. **Complete regression before deployment.** ESLint, strict TypeScript, all unit tests, focused analytics/admin browser tests, the complete credential-independent browser suite, schema lint, secret scanning, privacy/security review, and a production build must pass before production activation.
16. **Production rollback is mandatory.** If live insertion, authorization, aggregation, privacy controls, outbound navigation, or regression checks fail, immediately restore `ANALYTICS_ENABLED=false`, redeploy the last known-good application version when needed, record the failure, and do not call the step complete.
17. **Preserve user work.** Do not overwrite unrelated uncommitted changes. Use focused patches and inspect every diff before a commit.
18. **No premature Git claim.** Do not say work is committed, pushed, or deployed until the exact commit, remote branch, and production deployment are verified.
19. **Documentation is part of the fix.** Current operational docs must match the final provider configuration and observed behavior. Historical QA evidence remains historical and receives a dated follow-up rather than being rewritten.

## Continuation and decision protocol

- The next pending step is the first row below whose status is `Pending`.
- Sending `continue` accepts the stated scope and conservative defaults of that next step only.
- If a newly discovered fact would materially change privacy behavior, delete real data, add a paid service, send a message, or expand beyond this plan, document the issue and stop for a specific owner decision. A plain `continue` never authorizes such an expansion.
- No paid analytics provider or plugin will be added. The repair uses the existing Next.js, Supabase, GitHub, and Vercel architecture.
- The 365-day retention limit applies only to anonymous analytics events. Inquiry storage remains disabled and outside this repair.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| Pending | Not started |
| In progress | Work is currently limited to this step |
| Implemented | Code/configuration exists but every required check has not passed |
| Passed | All listed evidence for the step was directly observed |
| Blocked | A named external fact or owner decision prevents safe progress |
| Rolled back | A production change failed acceptance and the non-collecting state was restored |

## Step plan

| Step | Scope | Required evidence before `Passed` | Status |
| --- | --- | --- | --- |
| 0 | Create control rules and establish repository-backed baseline | New Markdown control file; clean pre-change Git state recorded; root cause distinguished from unverified hypotheses; no runtime/provider change | Passed |
| 1 | Reproduce the production symptom and audit the complete event path | Live public network/cookie behavior; current Vercel variable names and deployment state without secret values; Supabase row-count baseline; dashboard date/time-zone behavior; inventory of every rendered external action; findings recorded | Passed |
| 2 | Add retention and database/schema support | Ordered, backward-compatible migration; 365-day retention mechanism scoped only to analytics; accurate Waze/reporting schema support; schema tests/lint; grants/RLS review; generated/manual database types reconciled; no production application or collection activation | Passed |
| 3 | Repair and harden collection plus administrator clarity | All approved external actions tracked, including Waze; visitor choice and active privacy wording; explicit server storage readiness; admin collection-status/last-event/refresh clarity; complete contact-type reporting; focused unit/component/browser QA; no public navigation blocking | Passed |
| 4 | Run the complete local quality gate | ESLint, strict TypeScript, all unit tests, focused analytics/admin browser tests, complete credential-independent browser suite, production build, dependency/secret/privacy scans; all in-scope failures fixed | Passed |
| 5 | Commit the reviewed application/database repair and push `main` | Focused diff reviewed; no secrets or unrelated files; owner-attributed commit; local `main` equals `origin/main`; exact commit recorded | In progress |
| 6 | Apply the reviewed migration, configure, and deploy production analytics | Remote migration history/lint verified; Vercel framework/runtime drift reconciled to Next.js/Node 22; server-only Supabase write credential added to Production only; `ANALYTICS_ENABLED=true`; inquiry flag remains false; build-time flag receives a fresh production deployment; deployment reaches Ready; canonical alias points to it; no secret value exposed | Pending |
| 7 | Prove the full live production flow | Fresh browser preference choice; HTTPS identifier behavior; stored page view; actual approved Contact action click; `201` responses; exact Supabase rows; approved admin aggregates/recent tables/date ranges/CSV; unapproved denial; failure isolation; test-only records removed and genuine records preserved | Pending |
| 8 | Reconcile documentation and run final regression | Dated QA report; README/deployment/architecture/handoff/todo/decision/changelog truth reconciled; final local and production smoke checks pass; documentation-only commit pushed; final deployment commit and Git cleanliness verified | Pending |

## Required live acceptance matrix

| Layer | Acceptance condition |
| --- | --- |
| Public choice | A visitor can allow or decline analytics, revisit that choice, and continue using every page either way |
| Page view | One allowed fresh public visit creates one valid event for the normalized public path without personal data |
| Contact click | Clicking each tested approved channel still performs native navigation and creates one allowlisted event with the correct type/source |
| Waze | Waze is tracked under an accurate reporting category rather than silently omitted or mislabeled as Google Maps |
| Disabled state | With collection disabled/declined, no analytics UUID storage or analytics request is created |
| Storage failure | A database/configuration failure never blocks reading the site or opening a contact destination, but QA/admin status does not mislabel the dropped event as stored |
| Database | Anonymous/authenticated-unapproved direct access remains denied; only validated service inserts and approved-admin reads succeed |
| Dashboard | Selected Asia/Manila date bounds reconcile exactly with base rows, charts, cards, recent activity, and CSV totals |
| Admin clarity | The administrator can distinguish collection disabled, storage unavailable, no activity in range, and healthy collection with real activity |
| Security | Admin routes remain noindex/private, service credentials never reach browser bundles, and no secret appears in Git or logs |
| Retention | Analytics older than 365 days is eligible for deletion; newer and inquiry records are not; the procedure is documented and proved only with synthetic records during QA |
| Production | Canonical pages, contacts, maps, accessibility, headers, authentication, logout, and protected-route denial still work after deployment |

## Rollback target

The safe rollback state is:

- `ANALYTICS_ENABLED=false` in Vercel Production followed by a fresh deployment, because the flag is used by the statically built public layout;
- public property pages and approved contact destinations remain usable;
- administrator authentication and read-only empty/historical reporting remain available;
- the server-only Supabase credential may be removed if the insertion boundary itself is suspect;
- no genuine stored analytics is deleted as part of rollback.

## Evidence log

### Step 0 -- 2026-08-10

- `git status --short` was empty before this file was added.
- Repository code confirms the false feature flag suppresses both identifier creation and client dispatch.
- Repository code confirms disabled endpoints return `204` and missing service storage returns `202`.
- A read-only production check of `/contact` observed zero analytics requests, no `vv_visitor_id` cookie, and no analytics session storage; both production analytics endpoints returned the expected disabled-state `204`.
- A value-free Vercel Production environment inventory confirmed the analytics flag exists and the server-only service-role variable does not; no environment value was read or exposed.
- Current deployment and handoff documents explicitly record `ANALYTICS_ENABLED=false` and omission of `SUPABASE_SERVICE_ROLE_KEY`.
- Contact cards use the tracked-link component; the Waze navigation action is a confirmed plain-anchor coverage gap.
- The plan explicitly requires scoped QA after every code/database/configuration/documentation step, plus complete pre-deployment regression and live post-deployment QA.
- No application, database, Vercel, Supabase, GitHub, or production runtime state was changed in Step 0.

### Step 1 -- 2026-08-10

**Outcome:** Passed. The empty dashboard was reproduced and traced to disabled collection plus absent server-side write configuration. No code, database row, provider setting, Git history, or production behavior was changed.

#### Browser and endpoint evidence

- All nine public routes returned `200`.
- Normal public navigation across all nine routes generated zero requests to `/api/analytics/page-view` or `/api/analytics/link-click`.
- A safely prevented approved Airbnb action on `/contact` generated zero analytics requests.
- No `vv_visitor_id` cookie, `vv_analytics_session`, or other `vv_*` local/session storage entry was created.
- Safe non-inserting probes returned `204` from both analytics endpoints with private/no-store cache controls. This proves the production endpoint boundary is disabled, not merely failing after validation.
- `/admin/login` returned `200`. An unauthenticated `/admin/dashboard` request returned `307` and ended at the login page without dashboard content.
- Administrator-route navigation generated zero analytics requests and no analytics browser storage.

#### External-action inventory

- The production crawl found 23 rendered outbound-anchor instances across the nine public routes and ten unique route/label/category signatures.
- The instances comprise 14 Airbnb actions, two Google Maps actions, two Waze actions, and one each for Facebook, Messenger, WhatsApp, caretaker telephone, and email.
- All six `/contact` channel cards use `TrackedExternalLink` with the expected allowlisted categories: `airbnb`, `facebook`, `messenger`, `whatsapp`, `phone`, and `email`.
- Google Maps uses the tracked `google_maps` category on both the homepage and Location page.
- Waze is the only confirmed outbound-anchor gap: both rendered instances come from one plain-anchor component, while the TypeScript union, database constraint, reporting labels, and summary function have no `waze` category.
- The click-to-load Google/Waze iframe controls are internal consent/performance controls rather than outbound anchors. They remain outside external-link click totals; the explicit provider navigation anchors are the tracked actions.

#### Supabase evidence

- Exact production baseline: `public.page_views = 0` and `public.link_clicks = 0`.
- Local and remote migration history match for migrations `001` through `007`.
- Four RLS-protected application tables, four analytics views, five dashboard RPCs, and the private administrator-authorization helper are present.
- Anonymous RPC execution is denied; authenticated execution exists behind the underlying approved-administrator RLS checks.
- Linked database lint completed with no warnings or errors.
- The current `link_clicks_type_allowed` constraint does not accept `waze`, confirming that the gap requires a reviewed additive migration rather than a component-only patch.

#### Dashboard range evidence

- The dashboard defaults to an inclusive 30-day Asia/Manila calendar range with start-inclusive and end-exclusive UTC bounds.
- At the time of this audit, the default range was 2026-07-12 through 2026-08-10, represented by `2026-07-11T16:00:00.000Z` through `2026-08-10T16:00:00.000Z`.
- The focused dashboard test file passed all 11 tests, including Manila-day selection, preset/custom ranges, invalid/future/overlong rejection, and aggregate normalization.
- With zero base events, the empty dashboard is consistent with the database. Its wording is still operationally insufficient because it cannot distinguish disabled collection, missing storage configuration, healthy collection with no activity, or stale already-open data.

#### Vercel and deployment evidence

- The linked project and requested team are correct. The active production deployment is `READY`, aliases to the canonical production URL, and was built from `main` commit `759c8c6145b5d572f14d0a5c70b94564c9c399be`, matching local and `origin/main` before this uncommitted plan file.
- Production contains the expected public destination, Supabase public Auth, site URL, analytics flag, and inquiry flag variable names.
- `SUPABASE_SERVICE_ROLE_KEY` is absent. No value from any environment variable was read, printed, or documented.
- Vercel Web Analytics is not operationally integrated: the repository has no package/component integration, the live HTML has no analytics script, and provider feature state is off. Custom contact analytics is designed for `/admin/dashboard`, not the Vercel Analytics tab.
- Provider project settings currently report framework `Other` and Node.js `24.x`, while the active deployment correctly captured Next.js and Node.js `22.x`. Step 6 must reconcile this drift before the activation deployment.

#### Step 1 QA

- Production route/network/storage crawl: passed.
- Disabled endpoint/status/cache-control probes: passed.
- External-action inventory and source-to-category reconciliation: passed with the documented Waze defect assigned to Steps 2-3.
- Exact Supabase counts, migration parity, object/grant/RLS inspection, and linked lint: passed.
- Focused dashboard unit QA: 11 passed.
- Vercel deployment/source/alias/runtime/environment-name audit: passed with framework/runtime setting drift assigned to Step 6.
- Secret/contact-value review of this evidence: passed; no credential or configured contact value is recorded here.

### Step 2 -- 2026-08-10

**Outcome:** Passed. The additive database/type remediation is implemented and locally proved. No remote migration, production row, Vercel setting, deployment, Git commit, or collection behavior changed.

#### Implemented scope

- Added ordered migration `008_add_waze_and_analytics_retention.sql`; previously applied migrations `001` through `007` remain immutable.
- Replaced the effective link-type constraint additively so `waze` is a distinct accepted category while every existing category remains valid. The existing generic link-total view/RPC reports Waze without changing a deployed function return shape.
- Added a parameter-free `private.prune_expired_analytics()` routine that uses invoker rights, an empty search path, one fixed 365-day boundary, and deletes only `page_views` and `link_clicks`.
- Denied `public`, `anon`, `authenticated`, and `service_role` execution of the retention routine and preserved their lack of direct analytics `DELETE` authority.
- Added one named daily Supabase Cron job at `15 18 * * *` GMT, corresponding to 02:15 Asia/Manila. Its scheduling statement explicitly reactivates the returned job ID so replay cannot leave an existing named job disabled.
- Revoked application-role access to the `cron` schema after scheduling, which is the effective boundary around Supabase-owned cron tables and functions.
- Reconciled the Waze category across the analytics union, all three manual database row/insert/update contracts, dashboard labels, destination validation tests, schema tests, and dashboard normalization tests.
- Added ESLint ignores for Supabase's generated `.temp` and `.branches` runtime directories; tracked application and migration source remains linted.
- Updated database and test documentation to identify migration `008` as locally implemented but still pending production application.

#### Database execution and behavior evidence

- Docker-backed local Supabase was rebuilt from scratch with `db reset`; migrations `001` through `008` and the synthetic seed applied in order without migration warnings.
- Local migration history lists all eight migrations as applied. Local database lint at warning level with fail-on-error returned no findings.
- Locally generated TypeScript schema output contained the expected analytics tables, link-type fields, page-view table, and generic dashboard link-total RPC; the reviewed manual Waze union then passed strict TypeScript compilation.
- A rollback-only database probe accepted exact `waze` rows and rejected an unknown link category through the live check constraint.
- The same probe deleted analytics at 366 days, retained analytics at 364 days, retained an older inquiry sentinel, returned the expected deletion counts, and returned zero deletions on an immediate second call.
- The probe confirmed anonymous, authenticated, and service roles cannot call the retention routine, cannot directly delete analytics, and cannot use the `cron` schema.
- Exactly one active named job was observed with the expected schedule, command, current database, migration owner, and GMT cron timezone.
- Replay safety was exercised by disabling the local named job through `cron.alter_job`, replaying the migration's schedule/reactivation statement, and observing exactly one correctly configured active job.
- The rollback boundary was verified after the probe: zero synthetic QA page-view, click, or inquiry rows remained. The local Supabase stack was stopped after QA.
- The daily schedule means deletion may occur up to one run after an event becomes older than 365 days. A paused Supabase project can delay execution further, so documentation must not promise an exact-to-the-second maximum.

#### Step 2 QA

- ESLint: passed.
- Strict TypeScript (`tsc --noEmit`): passed.
- Focused analytics/database/dashboard unit QA: 32 passed.
- Complete unit suite: 9 files, 70 tests passed.
- Independent migration/security review found the cron reactivation gap; it was fixed and the replay behavior was then directly proved.
- Initial concurrent Supabase CLI checks collided only on the CLI's local telemetry file. They were rerun sequentially and passed; no schema result was inferred from the failed attempt.
- Pending-diff whitespace validation passed. A value-free secret-pattern scan found no Supabase/GitHub token, JWT, credential-bearing database URL, or private key in the remediation diff.

### Step 3 -- 2026-08-10

**Outcome:** Passed locally. Collection and administrator clarity are repaired in application code and covered by focused QA. Production configuration, production data, the remote migration history, Git history, and the deployed site were not changed.

#### Implemented scope

- Added a non-modal, explicit **Allow analytics** / **Decline** choice before analytics identifiers or requests can be created, plus a persistent **Analytics settings** control for later changes. The public site remains usable in every preference state.
- Centralized the feature switch through the shared server evaluator. Feature-disabled, undecided, declined, and storage-failure states all fail closed and clear the analytics cookie, session storage, and in-memory identity fallbacks.
- Added independent consent checks at the identity and dispatch boundaries. Re-allowing records the current public route once without duplicating same-path rerenders; administrator routes remain outside the public tracker.
- Hardened the failed-Decline path: if a browser rejects the preference write while a stale `allowed` value exists, the stale value is removed and the current tab remains declined. A full reload returns to undecided rather than silently resuming analytics.
- Routed Waze navigation through the same native, non-blocking tracked-link boundary as the other approved external destinations and its distinct `waze` reporting type.
- Added an administrator operational-status panel that distinguishes collection disabled, write configuration absent, authenticated reporting unavailable, configured with no stored events, and stored activity present. It checks write configuration only as a boolean, reads through the signed-in administrator's RLS-bound client, displays safe last page/link timestamps, and never displays or uses the service-role credential for reporting.
- Added an explicit dashboard refresh control with a last-refreshed Asia/Manila timestamp. The dashboard now visibly lists all nine supported link categories, including zero totals: Airbnb, Facebook, Messenger, Google Maps, Waze, WhatsApp, phone, email, and other.
- Qualified administrator metric language as consent-based/anonymous and preserved the distinction between configuration/read reachability and separately required live-delivery proof.
- Updated the Privacy page to describe the optional choice, minimized event fields, browser storage, administrator-route exclusion, disabled inquiry collection, analytics-only 365-day daily retention, possible scheduler/project-pause delay, and the configured Contact route for privacy requests without embedding a contact value.
- Updated focused component, analytics, dashboard, database, and test documentation. No paid analytics provider or Vercel Web Analytics integration was introduced.

#### Step 3 QA

- Full ESLint: passed.
- Strict TypeScript (`tsc --noEmit`): passed.
- Complete unit/component suite: 10 files, 77 tests passed.
- Enabled analytics browser suite: 7 passed; the feature-disabled-only case was correctly skipped.
- Feature-disabled browser case: 1 passed, proving no request and removal of legacy analytics identifiers even when a stored preference says allowed.
- The failed-Decline browser regression passed across SPA navigation and a full reload: the stale Allow value was absent, no second page-view request occurred, and visitor/session identifiers remained absent.
- Configured Waze browser tracking: 1 passed with temporary provider-valid, non-property fixture URLs. It verified the exact `waze` category/source and preserved native anchor behavior; no real location or contact value was used.
- Privacy browser QA: 1 passed, including responsive layout, keyboard visibility, and Axe analysis.
- Consent-overlay interaction regressions: gallery lightbox focus behavior and both mobile-menu focus/scroll cases passed (3 tests).
- An independent integrated review ran 33 focused unit/component checks, found the stale-consent reload defect, verified its repair, and reported no remaining Step 3 blocker. Credentialed administrator refresh and real write-health proof remain intentionally assigned to Step 7.
- Public external-anchor source audit found one native anchor implementation: `TrackedExternalLink`. Every rendered public external action therefore crosses the consent-aware tracked-link boundary; framework-managed internal links are unaffected.
- Pending-diff whitespace validation passed. A value-free scan found no Supabase/GitHub token, JWT, credential-bearing database URL, private key, or configured contact value in tracked or untracked remediation content.
- Local enabled-browser QA correctly observed storage-unavailable drop warnings because Step 3 did not add a local service credential. Intercepted browser delivery is not presented as a stored production event.
- No remote migration, Supabase production row, Vercel setting, deployment, Git commit, or push was performed.

### Step 4 -- 2026-08-10

**Outcome:** Passed. The complete local quality gate, isolated browser matrix, reproducible database replay/lint, production build, production-mode local smoke test, dependency audit, secret/privacy checks, and independent remediation review all passed. Production services and Git history were not changed.

#### Repository and static quality evidence

- The step began on local `main` at the same commit as `origin/main`; all pending files were the already documented remediation work and nothing was staged.
- Full ESLint passed.
- Strict TypeScript (`tsc --noEmit`) passed.
- The complete unit/component suite passed: 10 files, 77 tests.
- Pending-diff whitespace validation passed.
- A Docker-backed local Supabase reset replayed migrations `001` through `008` plus the synthetic seed in order. Local database lint returned zero findings, and the local stack was stopped after QA.

#### Isolated browser evidence

- The accepted browser run was isolated from ignored local environment values using Next's processed-environment guard, explicit empty credential variables, and provider-valid synthetic public destinations. No real contact, property location, administrator credential, provider token, or database credential was used.
- The complete Chromium suite ran all 53 tests: 50 passed and 3 were explicitly skipped. The skips were the two credentialed live-administrator tests assigned to Step 7 and the mutually exclusive feature-disabled analytics case.
- The complete run covered configured synthetic booking/social/contact destinations, configured location-free Google Maps and Waze fixtures, Waze analytics categorization and native navigation, analytics opt-in/decline/reload behavior, administrator-route exclusion, public/admin accessibility, responsive layouts, protected-route denial, privacy content, headers, inquiry-disabled behavior, and all existing public content regressions.
- The mutually exclusive feature-disabled analytics test was then run separately and passed.
- The inquiry-enabled browser/API branch was also run separately with synthetic `.invalid` form data and unavailable storage: all three inquiry/CSV tests passed without writing an inquiry. The expected storage-unavailable response remained truthful and isolated.
- An earlier browser attempt was terminated before acceptance when the ignored-local-environment loading risk was identified. No result from that attempt was counted; the isolated rerun above is the recorded evidence.

#### Build and production-mode local smoke evidence

- `next build` passed with Next.js 16.2.12, including compilation, TypeScript, page-data collection, and generation of all 14 static outputs; dynamic administrator and API routes were retained correctly.
- A hidden local `next start` process from that build returned `200` for Home, Privacy, Contact, and administrator login; an unauthenticated dashboard request returned `307` to the fixed administrator login route.
- Production-mode responses included Content Security Policy, frame denial, HSTS, and private/no-store administrator-login caching. The analytics choice rendered in the enabled synthetic build, while the real ignored local contact value did not appear.
- The temporary production server was stopped, both QA ports were confirmed free, and no temporary QA script remained in the repository.

#### Dependency, secret, privacy, and review evidence

- Full and production-only `npm audit` checks reported zero vulnerabilities at every severity. The lockfile is version 3, root dependency declarations match, registry resolutions have integrity metadata, no package is deprecated, and a clean-install dry run passed.
- Six extraneous packages were limited to ignored local `node_modules` native/WASM support artifacts and are absent from the lockfile, so they cannot enter a clean deployment or commit.
- The ignored `.env.local` file is not tracked. Git-visible tracked/untracked remediation content contained no Supabase/GitHub token, JWT, credential-bearing database URL, private key, or real ignored contact value.
- Production client artifacts contained no real ignored contact value, local Vercel token, service-role variable name, OIDC variable name, JWT, private token pattern, or other server credential pattern.
- The analytics schema contains no raw-IP, exact-location, or fingerprint column. Public external anchors remain centralized in `TrackedExternalLink`; administrator routes remain outside the tracker.
- An independent full-diff review reported no release-blocking correctness, privacy, security, accessibility, client/server-boundary, dashboard, Waze, consent, or migration defect.
- Known later-step boundaries remain explicit: actual production `201` insertion/readback and credentialed administrator reconciliation belong to Step 7; final current/historical documentation reconciliation belongs to Step 8. In-process rate limiting and the current inline CSP allowance remain documented hardening considerations, not concealed proof claims.
- No Git commit/push, remote migration, production row change, Vercel/Supabase setting change, analytics activation, or deployment occurred in Step 4.

## Next authorized action

On the next exact `continue`, perform **Step 5 only**: review the final pending file set, confirm no secret/unrelated/staged artifact, create the owner-attributed remediation commit on `main`, push it to `origin/main`, and verify the exact local/remote commit equality. Do not apply migration `008` remotely, activate production analytics, change Vercel/Supabase production configuration, or deploy in Step 5.
