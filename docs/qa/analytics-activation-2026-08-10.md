# Production analytics and administrator reporting activation — 2026-08-10

## Outcome

Consent-based first-party analytics is active at `https://villa-vessela-airbnb.vercel.app`. Production uses the reviewed Next.js/Supabase implementation from application commit `98a5c316ea1451f6dad34c1e376b946107e00145` and activation evidence baseline `678e9af591cca78b9d008e660a4fa84c41e20d03`. Activation deployment `dpl_Hq2gcedwbYnEJCht5fLdqR2HnxWy` reached Ready on Next.js with Node.js `22.x` and received the canonical Vercel aliases.

`ANALYTICS_ENABLED` is true and `CONTACT_INQUIRY_ENABLED` remains false. Migrations `001` through `008` are applied and lint-clean. One retained owner-approved administrator remains authorized; all disposable QA identities were deleted. No credential, contact value, destination URL, browser/Auth UUID, database row identifier, cookie value, or raw CSV content is recorded here.

## Activated scope

- Visitors receive a non-modal **Allow analytics** / **Decline** choice plus a persistent **Analytics settings** control.
- Undecided, declined, storage-blocked, and feature-disabled states create no analytics identifier or request. Decline clears the analytics visitor cookie, session identifier, and in-memory identity.
- Allowed analytics retains only random first-party visitor/session UUIDs, normalized public paths, origin-only referrers, coarse device/browser categories, and exact approved external-link type/source/destination fields.
- Every configured booking, social, messaging, telephone, email, Google Maps, and Waze action crosses the same non-blocking tracked-link boundary. Waze has a distinct reporting category.
- Migration `008` schedules one daily database job that deletes only page views and link clicks once they are older than 365 days. Inquiry rows are outside this routine. The daily interval or a paused provider project can delay execution.
- The protected dashboard distinguishes disabled collection, missing write configuration, unavailable authenticated reporting, configured/no stored events, and stored activity. It exposes only safe readiness booleans and last-event timestamps, lists all nine link categories, and provides an explicit refresh action.

## Security and privacy boundary

- Public browsers receive no direct table access. Analytics POST handlers require same-origin bounded JSON, strict schemas, implemented public paths, and an exact normalized type/destination pair before using the server client.
- The modern Supabase backend secret bypasses RLS and is full privilege. It is configured only as a sensitive Production server variable; effective narrowness comes from secret isolation, the two active reviewed analytics handler call sites, and the separately reviewed default-disabled inquiry handler, not an insert-only credential claim.
- Administrator reads use a request-scoped authenticated client and remain governed by `admin_profiles` authorization plus RLS. They never import the backend secret.
- Anonymous users have no analytics table privileges. Authenticated users can read only when the approved-administrator policy recognizes their profile and cannot directly write analytics.
- Administrator routes remain outside the public analytics layout, `noindex`, and private/no-store.
- Analytics contains no visitor-supplied name, email, telephone number, inquiry message, raw IP, visitor/device geolocation, fingerprint, full user agent, screen signature, or claim that the system identifies who clicked. Link rows do retain the exact owner-approved public destination, which can contain a configured public contact or the public Villa Vessela property pin.
- Failed delivery never blocks public reading, internal navigation, or a native approved external action.

## Activation correction and mandatory rollback

The first valid production page-view probe returned `202`, which proved that the configured backend write boundary was not usable. No Contact action followed that failed prerequisite. Direct server-secret access to the linked database succeeded, isolating the failure to the Vercel copy created by an interrupted command-line standard-input transfer.

The rollback rule was applied immediately: analytics was set false, a fresh safe deployment was promoted, both analytics endpoints returned disabled-state `204`, and a clean browser displayed no analytics choice, identifier, or request. A second command-line transfer remained unusable, so production stayed disabled. The value was then replaced through Vercel's authenticated environment API with the secret supplied only through value-suppressed JSON standard input. A fresh false-state deployment again proved `204` before the flag was restored to true and rebuilt.

The secret value was never printed, written to a file, placed in a command argument, committed, or exposed through a public variable. A valid direct endpoint probe then returned `201`; its exact row was read back and deleted before browser acceptance began.

## Live acceptance evidence

| Check | Result | Status |
| --- | --- | --- |
| Fresh browser before choice | Choice visible; no analytics request, preference, visitor cookie, or session identifier | Passed |
| Failure isolation | Locally aborted page/link delivery did not block content or native navigation; no request reached production | Passed |
| Browser page view | One internal navigation to `/contact` returned one production `201` | Passed |
| Approved Contact action | One trusted Control-click on the configured Airbnb action returned one production `201` | Passed |
| Native navigation | A top-level provider request began and `noreferrer` omitted the Referer header | Passed |
| Exact database readback | One `/contact` page row and one `airbnb` `/contact` link row matched the same browser identity and bounded QA window | Passed |
| Preference reversal | Decline removed visitor/session identity and retained only the declined preference | Passed |
| Operational status | Collection enabled, write storage configured, authenticated reporting available, exact last-event timestamps | Passed |
| Summary and categories | Six summary cards and all nine link-category cards reconciled | Passed |
| Charts and activity | Five accessible chart tables plus recent page/link rows reconciled | Passed |
| Date range and RPCs | One Asia/Manila custom range matched all five database RPCs and base rows | Passed |
| Refresh | Last-refreshed feedback changed while values remained reconciled | Passed |
| Page/link CSV | Both protected exports matched row counts/minimized fields and were not truncated | Passed |
| Logged-out denial | Dashboard and protected exports returned no protected data | Passed |
| Authenticated-unapproved denial | Generic browser denial; exact-row reads and aggregate RPC results exposed no QA data | Passed |
| Administrator tracking exclusion | Administrator navigation created no analytics request or browser identity | Passed |

The inquiry CSV was intentionally not downloaded because inquiry data can contain guest personal information. Public inquiry submission remains disabled, so this report does not claim inquiry insertion, status mutation, or inquiry-export completion.

## Exact cleanup

Cleanup required both random browser identifiers, both database primary identifiers, exact timestamps, the `/contact` path/source, `airbnb` type, and a destination hash before either deletion could proceed. Exactly one page row and one link row were removed. The target pair then returned zero rows, every non-QA analytics identifier captured before cleanup remained present, and inquiry counts were unchanged.

The temporary approved profile and two disposable Auth identities were deleted and verified absent. The pre-existing owner administrator remained present and was not edited, reset, or rotated. Immediately after exact cleanup, the production snapshot was zero page views, zero link clicks, and zero inquiries. This was a point-in-time QA result, not a promise that genuine consented traffic will remain zero after activation.

## Final Step 8 regression — 2026-08-24

The final documentation/release gate is recorded here after it runs. No check is treated as passed until its result is observed.

| Check | Result | Status |
| --- | --- | --- |
| ESLint | `npm run lint` completed with no errors | Passed |
| Strict TypeScript | `npm run typecheck` completed with no errors | Passed |
| Unit/component suite | 77 tests in 10 files passed | Passed |
| Complete isolated Chromium suite and mutually exclusive branches | Main synthetic suite: 50 passed and 3 environment-explicit skips; analytics-disabled branch: 1 passed; inquiry-enabled branch: 3 passed | Passed |
| Production build and local production-mode smoke | Next.js `16.2.12` built all 14 static outputs; a credential-free local production server passed 18 route, redirect, consent, header, malformed-analytics, and inquiry-disabled assertions and was then stopped | Passed |
| Complete and production dependency audits | Full and production-only npm audits reported zero vulnerabilities; clean-install dry run passed | Passed |
| Local/linked migration parity and database lint | Local and linked histories match migrations `001` through `008`; linked warning-level lint returned no findings | Passed |
| Documentation whitespace, links, encoding, privacy, secret, and contact-value scans | All 30 changed paths are documentation; diff, 24 local links, UTF-8/mojibake, generic-secret, two ignored-environment-value, and 11 configured-destination-value checks passed with zero findings | Passed |
| Canonical production route/security/consent/inquiry-disabled smoke | Public routes and login returned `200`; protected dashboard redirected to fixed login; consent and security/noindex/no-store markers passed; malformed analytics returned `415`/`415`; disabled inquiry returned `404`; no valid event was sent | Passed |
| Final Git/remote/deployment equality and clean worktree | Reconciliation commit `450f6f3c026123b06a907c94be5a6801704d5fea` matched local `main`, `origin/main`, and GitHub; Quality run `32654949226` passed; Ready deployment `dpl_24MdnUs75ecrsTXSBiVbxu1f9otm` used that exact source and held both canonical aliases; the release worktree was clean | Passed |

The canonical post-deployment smoke passed 41 assertions across all nine public routes, canonicals, consent marker, security headers, fixed administrator denial, both malformed analytics endpoints, the disabled inquiry endpoint, and robots directives. No valid production analytics event was sent. The post-deployment Supabase snapshot remained zero page views, zero link clicks, and zero inquiries, with one retained administrator/Auth user; the one daily retention job remained active and all seven runs in the preceding seven days had succeeded. The completion-record commit necessarily postdates this release proof, so its final immutable Git/Vercel identifiers are reported in the operator handoff rather than self-referenced here.

## Current limitations

- `CONTACT_INQUIRY_ENABLED` remains false. No live inquiry insert, status mutation, inquiry CSV handling, or inquiry deletion procedure is claimed.
- Dedicated retained test credentials are intentionally absent from Git, Vercel, and credential-free CI. Production QA used isolated disposable identities and deleted them exactly.
- Analytics/inquiry rate limits are bounded per process and deliberately retain no raw IP. They are not globally atomic across serverless instances; add a privacy-compatible distributed limiter or WAF before sustained or adversarial traffic.
- Forced token-expiry refresh and production-authenticated mobile chart tooltip/legend interaction remain narrow maintenance follow-ups. Ordinary approved login/protected navigation/logout and accessible chart-table reporting passed.
- This project uses custom Supabase analytics. Vercel's Analytics tab is not the reporting surface; the protected `/admin/dashboard` is.

## Rollback

If consent, delivery, reporting, navigation, or privacy behavior regresses, set Production `ANALYTICS_ENABLED=false` and create a fresh deployment because the public layout consumes the flag during build. Confirm both analytics endpoints return `204`, the choice UI is absent, and a fresh browser creates no analytics identifier or request. Remove the Production backend secret and redeploy only if the insertion boundary itself is suspect.

Keep migration `008` applied while collection is disabled. It is dormant with respect to new collection and must be corrected through a reviewed additive migration rather than destructive history rewriting. Do not delete genuine analytics as part of rollback.

## Evidence references

- [`ANALYTICS_ADMIN_REMEDIATION_PLAN.md`](../../ANALYTICS_ADMIN_REMEDIATION_PLAN.md) — step-by-step control record and complete activation evidence
- [`admin-activation-2026-08-10.md`](admin-activation-2026-08-10.md) — retained owner administrator and original empty-dashboard activation
- [`phase-08-analytics.md`](phase-08-analytics.md) — historical pre-activation analytics implementation evidence
- [`phase-09-dashboard.md`](phase-09-dashboard.md) — historical pre-activation dashboard implementation evidence
- [`../DEPLOYMENT.md`](../DEPLOYMENT.md) — current production, rollback, and maintenance procedure
