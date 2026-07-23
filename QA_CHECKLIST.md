# QA Checklist

Use `[x]` only for a check supported by evidence. Use `[ ]` for pending checks and annotate blocked items in the phase report. Phase 0 results are recorded in `docs/qa/phase-00-repository-audit.md`.

## Repository setup

- [x] Existing workspace inspected before edits
- [x] Existing framework, package manager files, dependencies, tests, and conventions checked
- [x] Empty/non-Git starting state recorded
- [x] Root planning documents created without application scaffolding
- [ ] Git repository initialized or connected when the owner chooses
- [x] Next.js/npm project scaffolded and lockfile created
- [x] `.gitignore` excludes secrets, build artifacts, and local test artifacts
- [x] `.env.example` documents every variable without real secrets

## Code quality

- [x] ESLint configured and passing
- [x] Formatting and naming conventions documented
- [x] Foundation modules remain small, cohesive, and free from unnecessary duplication
- [x] Important foundation configuration has useful documentation/comments
- [x] No unrelated files are overwritten

## TypeScript

- [x] Strict TypeScript enabled
- [x] No unjustified `any` types in current application/tests
- [ ] Content, environment configuration, database rows, events, and form data typed
- [x] `npm run typecheck` passes

## Public pages

- [x] `/` opens without authentication
- [x] `/accommodation` opens without authentication
- [x] `/amenities` opens without authentication
- [x] `/gallery` opens without authentication
- [x] `/reviews` opens without authentication
- [x] `/location` opens without authentication
- [x] `/guest-guide` opens without authentication
- [x] `/contact` opens without authentication
- [x] `/privacy` opens without authentication
- [x] Root not-found route returns 404 with accessible recovery; loading/error states compile
- [x] Published homepage facts match the supplied source package
- [x] Unconfirmed homepage values are hidden, disabled, or explicitly qualified
- [x] Phase 4 information-page facts match the supplied package and preserve every tracked uncertainty
- [x] Phase 5 gallery, review, location, and contact content matches the supplied package without fabricated media, reviews, or destinations

## Responsive design

- [x] No horizontal overflow at the tested 390px mobile width
- [x] Complete homepage visually reviewed at 390×844 and 1440×1000
- [x] Homepage typography and available controls remain usable at tested viewports
- [x] Homepage images use responsive `next/image` sizing and deliberate aspect-ratio crops
- [x] Homepage sections do not clip or overlap at tested viewports
- [x] Accommodation, Amenities, and Guest Guide pass automated 390px overflow checks and manual 390×844/1440×1000 review
- [x] Gallery, Reviews, Location, Contact, and the open lightbox pass automated 390px overflow checks and manual 390×844/1440×1000 review

## Mobile navigation

- [x] Opens and closes by touch and keyboard
- [x] Visible close control exists
- [x] Background scroll is locked only while open
- [x] Focus is trapped, restored, and remains visible
- [x] Escape closes the menu
- [x] Navigation closes after route selection

## Accessibility

- [x] Homepage uses a main landmark, one logical level-one heading, and ordered section headings
- [x] Current interactive controls are keyboard reachable
- [x] Skip link receives keyboard focus and reaches the main landmark
- [x] Homepage availability and placeholder meaning are conveyed with text, not color alone
- [x] Current public shell passes an automated Axe accessibility scan
- [x] Current logo images have accurate alternative text and decorative SVG is hidden
- [x] Mobile dialog traps/restores focus and closes with Escape
- [x] Global reduced-motion fallback is implemented
- [x] Inquiry form errors are associated with fields and status/error responses are announced
- [x] All five dashboard charts have expandable screen-reader-readable data tables
- [x] Automated checks supplemented with manual keyboard and desktop/mobile visual review for the public shell and homepage
- [x] Each Phase 4 route has one level-one heading, logical section headings, text-based certainty labels, keyboard anchors/native disclosures, and zero Axe violations
- [x] The gallery dialog traps/restores focus, closes with Escape, supports arrow keys, exposes controls, and keeps the full placeholder visible
- [x] Each Phase 5 route has one level-one heading, logical section headings, usable labels/status copy, and zero Axe violations

## Forms

- [x] Inquiry form can be disabled without breaking the contact page
- [x] Name and message required
- [x] At least one contact method required
- [x] Consent required
- [x] Guest count is optional or a positive integer from 1–20
- [x] Preferred dates are both absent or a valid pair with checkout after check-in
- [x] Inputs have strict length limits and control/whitespace sanitization
- [x] Honeypot, fill-time, per-client, global rate, and payment-pattern controls tested
- [x] Pending, stored success, validation, rate, disabled, and storage/network failure states work
- [x] No payment-card data requested

## Authentication

- [x] No guest login or guest registration
- [x] No public administrator registration
- [ ] Admin email/password login works with configured test credentials (blocked: no Supabase project/test account)
- [ ] Session refresh is reliable live (implementation/static review pass; blocked: no issued session)
- [ ] Authenticated admin is redirected away from login (blocked: no approved test account)
- [ ] Logout clears/revokes the live session (implementation/static review pass; blocked: no approved test account)
- [x] Errors do not reveal sensitive account state

## Authorization

- [x] `/admin/login` remains public
- [x] Other `/admin/*` routes redirect unauthenticated visitors to one fixed login route
- [ ] Authenticated users without `admin_profiles` membership are denied live (code/RLS review pass; blocked: no unapproved test identity)
- [x] Approved administrator membership is checked server-side independently of the request proxy
- [x] Admin queries, status action, and export handler enforce authorization independently; live approved/unapproved data probes remain blocked
- [x] Hiding navigation is not treated as authorization

## Database

- [x] Seven migrations are ordered, fully documented, and covered by a structural contract test
- [ ] Migrations apply reproducibly to a disposable local/remote database (blocked: Docker engine/project unavailable)
- [x] Migration SQL defines the required tables, constraints, indexes, and defaults
- [x] Device, browser, link, role, and inquiry-status values are constrained
- [x] Text, contact, date-order, consent, and guest-count bounds are defined
- [x] Seed records are repeatable, safe, visibly labelled sample data and create no administrator
- [x] Reviewed application database types mirror the migration contract
- [ ] Generated live database types match the reviewed mirror (blocked with database execution)

## Row Level Security

- [x] Migration SQL enables RLS on every application table
- [x] Migration SQL revokes anon/authenticated access before adding narrow policies
- [x] No anon policy or direct public insert policy exists
- [x] Administrator grants are limited to protected reads and inquiry `status` updates
- [x] Security-definer membership helper uses a private schema and empty search path
- [x] Analytics and inquiry inserts are server-mediated, independently validated, bounded, and rate-limited; live insertion remains blocked
- [ ] Policy behavior tested with anon, unapproved authenticated, approved admin, and service identities (blocked: database runtime/identities unavailable)

## Analytics

- [x] Random first-party anonymous visitor ID created without fingerprinting
- [x] Separate session UUID rotates after 30 minutes of inactivity
- [x] One page-view request is dispatched per completed public navigation without rerender duplicates
- [x] Administrator routes are outside the tracker layout and reject analytics paths
- [x] Paths/categories are allowlisted and length-limited; referrers are reduced to HTTP(S) origins
- [x] Tracking/storage failures never disrupt public browsing or internal navigation
- [x] Phase 6 analytics schema contains no raw IP, exact GPS, personal name, or invasive fingerprint field
- [x] Phase 6 aggregate views use documented Asia/Manila date handling

## External-link tracking

- [x] Supported link types are enum-validated
- [x] Destination and link type must exactly match normalized approved configuration
- [x] Arbitrary public destination URLs are rejected
- [x] `sendBeacon` and keepalive fallback behave safely
- [x] Tracking failure does not block native anchor navigation
- [x] Missing destinations render inactive, not guessed, actions

## Administrator dashboard

- [x] Cards use authenticated database results and one consistent date filter
- [x] Estimated visitors, sessions, views, clicks, CTR, and inquiries are defined correctly
- [x] Daily visitors count distinct anonymous IDs by Asia/Manila date
- [x] Most-viewed normalized paths are calculated by a bounded aggregate function
- [x] Activity rows omit event IDs, destination URLs, messages, consent, and exact contact values
- [x] Responsive wrapping admin navigation plus invalid, loading, empty, unavailable, and error states are implemented
- [x] Synthetic seed data is detected and visibly labelled
- [ ] Live approved-administrator populated/empty/error state rendering (blocked: no database runtime/project/identity)

## Charts

- [x] Daily visitors line chart
- [x] Page-view trend line chart
- [x] Link-click comparison bar chart
- [x] Device distribution doughnut chart
- [x] Most-viewed pages bar chart
- [ ] Charts resize without clipping in an authenticated browser (blocked: no approved live administrator runtime)
- [ ] Tooltips/legends are usable in a live browser (blocked); all five textual table summaries pass static rendering checks

## CSV export

- [x] Endpoint repeats approved-administrator authorization and unauthenticated browser denial passes
- [x] Export type and date range are allowlisted/validated
- [x] Quotes, commas, line breaks, and formula-like values are handled by tested encoding
- [x] Columns and fixed filenames are human-readable
- [x] Database IDs, session IDs, destination URLs, and secret/internal fields are excluded
- [x] Page-view, link-click, and inquiry mappings plus CSV encoding are structurally/unit tested
- [ ] Live approved-administrator downloads and contents (blocked: no database/identity)

## SEO

- [x] Page-specific titles and descriptions
- [x] Canonical base URL configurable and rejects credentials, paths, queries, fragments, non-local HTTP, and invalid values
- [x] Open Graph/Twitter metadata and visibly provisional sharing image
- [x] Sitemap, fail-closed robots, and manifest outputs verified
- [x] SVG favicon metadata resolves and loads
- [x] Apple/web-app PNG icons have exact 180/192/512 dimensions and resolve from metadata/manifest
- [x] Structured data contains verified facts only and omits placeholders, coordinates, contacts, prices, and unconfirmed facts
- [x] Breadcrumbs used on every inner public page and mirrored by `BreadcrumbList` JSON-LD
- [x] Phase 4 routes include page-specific titles/descriptions and breadcrumbs
- [x] Homepage Airbnb rating/review attribution includes an independent-site non-endorsement statement

## Security

- [x] Service-role key access is isolated to a `server-only` module and privileged markers are absent from browser bundles
- [ ] Secrets and private contacts absent from Git
- [x] Auth, analytics, and inquiry schemas, length limits, normalization/sanitization, and bounded rate limits are applied
- [x] Auth cookie options are SameSite=Lax and Secure in production; live issued-cookie inspection remains blocked
- [x] Administrator redirects are constrained to fixed internal targets
- [x] Development and production security headers reviewed; production CSP excludes `unsafe-eval` and adds HSTS/HTTPS upgrade
- [x] Authentication errors/logging do not expose credentials, provider details, or account approval state
- [x] Public experience remains independent of absent Supabase configuration/database availability
- [x] Dependency and build security warnings reviewed; audit returns zero findings

## Privacy

- [x] Private caretaker numbers remain absent from repository source, documentation, seed, and built output through Phase 11
- [x] Unknown public owner contact details remain pending
- [x] Public privacy page matches actual conditional collection, browser storage, administrator access, and unresolved retention behavior
- [x] Public/dashboard analytics copy says anonymous/estimated and never “who clicked”
- [x] Inquiry consent, response purpose, and non-booking status are explicit in enabled UI
- [ ] Retention/deletion procedures documented before production
- [ ] Messenger review media removes private profile details unless approved

## Performance

- [x] Current root and not-found routes are statically rendered
- [x] Seven content/discovery/privacy routes and four metadata system routes are static; Contact is intentionally dynamic for its runtime server feature switch
- [x] Current client JavaScript is limited to route-aware navigation, mobile navigation, gallery/address interactions, authentication state, feature-flagged analytics/inquiry dispatch, status pending UI, and aggregate-only protected dashboard charts
- [x] Homepage image positions use local SVG placeholders, responsive sizes, intrinsic layout, and default lazy loading below the fold
- [x] Recharts code is confined to the dynamic protected dashboard route and receives aggregate-only props
- [x] System font stack requires no external font request
- [x] Local logo/image assets use bounded public caching with stale revalidation
- [x] Production public route inspection loads no dashboard/Recharts marker and Gallery adds only its route-scoped interaction chunk
- [x] Aggregate queries are index-backed, range-guarded, and limited to 366 days/top 10 pages
- [x] Each recent-activity table is limited to 15 records
- [x] Inquiry administration is paginated at 20 rows; CSV reads page by 1,000 and stop at 10,000

## Production build

- [x] Dependency installation and lockfile dry run succeed
- [x] `npm run lint` passes
- [x] `npm run typecheck` passes
- [x] `npm run test` passes (67 tests across utility, database, auth, analytics, dashboard, inquiry, CSV, SEO, structured-data, system-route, and header boundaries)
- [x] Default credential-independent Playwright coverage passes (47 passed, 2 live checks skipped); the separate enabled-inquiry run passes (3 passed)
- [x] `npm run build` passes
- [x] Built output scan contains no private caretaker numbers

## Deployment readiness

- [ ] Vercel project and production environment variables documented
- [ ] Supabase migrations applied in order
- [ ] RLS and production admin membership verified
- [ ] Canonical URL and approved external destinations configured
- [ ] Official photography and public contact permissions resolved or omitted
- [ ] Post-deploy public access, admin denial, link, inquiry, privacy, and error checks pass
- [ ] Rollback and support limitations documented
- [x] All QA evidence, changelog, decisions, and content TODO are current through Phase 11
