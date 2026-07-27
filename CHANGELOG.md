# Changelog

## 2026-07-27 — Final production performance revalidation

- Revalidated the canonical production homepage with two mobile and two desktop Lighthouse 12.8.2 runs after the dependency releases.
- Recorded repeatable 99 mobile and 100 desktop performance scores, with 100 accessibility, best-practices, and SEO scores in all four lab runs; no runtime change was required.

## 2026-07-27 — Dependency maintenance and continuous integration

- Patched the compatible modern `brace-expansion` branch to 5.0.8 while retaining the legacy ESLint branch until its parents publish an API-compatible fix.
- Recorded the one underlying development-only denial-of-service advisory accurately; the production dependency audit remains at zero findings.
- Added a read-only, secretless GitHub Actions workflow for locked installation, production audit, lint, strict types, 67 unit tests, production build, and credential-independent Chromium tests.
- Pinned GitHub-owned actions to immutable release commit SHAs, disabled checkout credential persistence, and limited the workflow token to repository-content reads.
- Added weekly grouped Dependabot checks for npm and pinned GitHub Actions, limiting routine automation to patch/minor releases while leaving security updates eligible at every SemVer level.
- Reviewed and accepted the first grouped production update: Next.js 16.2.12, Lucide React 1.27.0, and Recharts 3.10.1, with release-note review and the full local/CI release gates.
- Reviewed and accepted the first grouped development update: Playwright 1.62.0, eslint-config-next 16.2.12, and PostCSS 8.5.23, including the matching PostCSS override and a fresh Chromium regression run.
- Added a final owner handoff consolidating the verified release, safe defaults, reserved update slots, optional backend boundary, and ongoing maintenance workflow.

## 2026-07-23 — Phase 12 public release and deployment

### Release

- Initialized the repository with owner-attributed commits and published `main` to `nikkineilcarino/VillaVesselaAirbnb`.
- Added a reproducible Vercel/Supabase deployment, activation, post-deploy, rollback, and support runbook.
- Added a Vercel Next.js framework override and an upload allowlist that excludes local environment, build, test-report, database, and documentation artifacts while retaining required server modules.
- Created Vercel project `villa-vessela-airbnb` in `nikkineilcarino-2938s-projects` and deployed the Node 22 build to `https://villa-vessela-airbnb.vercel.app`.
- Configured only the final canonical origin and explicit false analytics/inquiry flags. No Supabase/test credential, private contact, or unapproved external destination was added.

### Release QA

- Made canonical, sitemap, robots, and clipboard browser checks origin-aware so the same assertions validate localhost and the production HTTPS alias.
- Local lint, strict types, 67 unit tests, the 47-pass/2-live-skip browser suite, the separate 3-pass enabled-inquiry run, production build, lockfile simulation, and zero-vulnerability audit pass.
- The final Vercel deployment is Ready and its 39-test production suite passes public/admin-denial routes, mobile/keyboard/dialog interactions, Axe, metadata/JSON-LD, system assets, Privacy, caching, and security headers.
- Production scans find 9/9 public routes available, zero active unapproved external links, zero private-contact or privileged browser markers, and zero `vv_*` cookies. Analytics endpoints return disabled no-op 204 responses; Contact returns 404.
- Supabase migration/RLS/administrator/insertion/dashboard/inquiry/export, retention, and deletion checks remain explicitly blocked.

## 2026-07-23 — Phase 11 SEO, accessibility, performance, security, and privacy

### Added

- Added unique canonical, Open Graph, Twitter, title, and description metadata for all nine public pages.
- Added validated canonical-origin helpers, fail-closed robots behavior, a nine-route sitemap, web manifest, generated PNG social placeholder, and Apple/192/512 rasterized VV icons.
- Added escaped verified-fact `LodgingBusiness` JSON-LD on the homepage and matching `BreadcrumbList` JSON-LD on every inner public page.
- Added a public `/privacy` route covering actual conditional analytics, browser storage, optional inquiries, administrator access, external sites, providers, and unresolved retention/deletion/request controls.
- Added SEO/structured-data components and libraries, directory guidance, seven unit tests, and four browser tests for metadata, system routes/assets, privacy, focus, reduced motion, security headers, and caching.

### Accessibility, performance, and security

- Added a two-color focus indicator, forced-colors fallback, sticky-header focus clearance, safe long-text reflow, and system-font delivery with no external font request.
- Added global CSP, clickjacking/MIME/referrer/permissions/opener/resource/cross-domain headers; production removes development-only `unsafe-eval`, adds HSTS, and upgrades insecure requests.
- Added one-day local logo/image freshness plus stale revalidation. Production inspection confirms no dashboard/Recharts marker in homepage, Gallery, Privacy, or login script responses.
- Kept Contact as the only dynamic public content route; seven public content/privacy routes plus sitemap, robots, manifest, and social image are static.

### Privacy and search safeguards

- Local, malformed, credential-bearing, path-bearing, non-HTTPS, and reserved canonical origins cannot enable indexing.
- Structured data omits placeholders, coordinates, map/contact values, prices, expanded capacity, and unconfirmed amenities/structures.
- Google `VacationRental` rich-result markup is intentionally deferred because the required official photo coverage, precise location, identifier, and eligibility evidence are unavailable.
- The Privacy page makes no legal-compliance claim and treats retention/deletion, request contact, provider review, and any required consent control as release blockers.

### Verification

- `npm run lint`, `npm run typecheck`, 67 Vitest checks, 47 credential-independent Chromium checks, a separate 3-check enabled-inquiry run, and the production build pass.
- All nine public pages pass automated accessibility scans across the existing suites; focused checks cover mobile reflow, keyboard focus, reduced motion, metadata/JSON-LD, static system files, exact icon dimensions, and production headers.
- Dependency audit reports zero vulnerabilities; lockfile dry run, private-contact/secret/browser-bundle/raw-IP/encoding scans pass.
- Two live administrator tests remain skipped. Database role/insertion/dashboard/inquiry/export, retention/deletion, configured public-HTTPS indexing, provider, GitHub, and Vercel checks remain blocked or scheduled for Phase 12 and are not claimed as passed.

## 2026-07-23 — Phase 10 inquiries and protected CSV exports

### Added

- Added a server-runtime `CONTACT_INQUIRY_ENABLED` switch that keeps the Contact form and endpoint disabled by default while preserving the contact page.
- Added an accessible operational inquiry form with name, contact, preferred-date, guest, message, consent, pending, field-error, success, and storage-unavailable states.
- Added a same-origin 8 KiB JSON endpoint with strict sanitization, contact/date/guest/consent/payment-pattern validation, a honeypot, fill-time checks, and bounded per-client/global rate limits.
- Added a protected twenty-row paginated inquiry list, allowlisted status filter, status-only Server Action updates, and loading/error/empty/unavailable states.
- Added authenticated, date-bounded page-view, link-click, and inquiry CSV exports with fixed filenames, paging, a 10,000-row ceiling, UTF-8 BOM/CRLF encoding, universal quoting, and spreadsheet-formula defense.
- Added inquiry/CSV contracts, helpers, focused component/library guidance, 16 new unit checks, three dual-mode browser checks, and `docs/qa/phase-10-inquiries-exports.md`.

### Security and privacy

- Public inquiry writes reach the isolated service-role client only after validation; public reads remain unavailable.
- Administrator inquiry reads, status updates, and exports use the request-scoped authenticated client and remain subject to RLS; no administrator workflow imports the service role.
- CSV output omits database IDs, session IDs, destination URLs, and secrets. Inquiry exports are explicitly treated as private because they contain voluntarily supplied contact/message data.
- Form logs contain fixed reason labels only. The endpoint retains no raw IP, stores no form client identifier, asks for no payment data, and never disguises storage failure as success.

### Verification

- `npm run lint`, `npm run typecheck`, 60 Vitest checks, 43 credential-independent Chromium checks, a separate 3-check enabled-inquiry Chromium run, and the production build pass.
- Dependency audit reports zero vulnerabilities; the lockfile dry run, UTF-8/mojibake scan, privileged browser-bundle scan, private-contact source/build comparison, raw-IP/log scan, and unauthenticated export denial pass.
- Two live administrator checks remain explicitly skipped. Docker/Supabase migration execution, live inquiry persistence, approved administrator reads/status changes/downloads, and role probes remain blocked and are not claimed as passed.

## 2026-07-23 — Phase 9 administrator dashboard

### Added

- Added exact Asia/Manila date resolution for Today, Last 7 days, Last 30 days, Current month, and validated custom ranges of at most 366 days.
- Added migration `007_create_dashboard_functions.sql` with five authenticated-only, `SECURITY INVOKER`, RLS-constrained aggregate functions for summary, daily, device, link, and top-page reporting.
- Added ten database summary cards, five responsive Recharts visualizations, and expandable HTML data-table equivalents with animation disabled.
- Added recent page, link, and inquiry tables limited to 15 rows; anonymous IDs are shortened and inquiry contacts are reduced to channel labels.
- Added responsive administrator navigation, synthetic-seed warnings, and distinct invalid-filter, loading, successful-empty, database-unavailable, and unexpected-error states.
- Added dashboard contracts, pure range/aggregate/display helpers, authenticated query orchestration, component/static-render tests, and directory documentation.
- Installed exact `recharts@3.10.0` and matching `react-is@19.2.8`.

### Security and privacy

- Dashboard queries use only the request-scoped authenticated Supabase client; the service-role factory is not imported.
- Aggregate functions retain base-table RLS, revoke default/anon execution, guard invalid/overlong ranges, and return no full visitor/event IDs.
- The Recharts Client Component receives aggregates only. It receives no inquiry record, destination URL, full visitor ID, event ID, message, consent value, or exact contact value.
- CTR counts only link-clicking anonymous IDs that also appear among period page viewers and returns zero when visitor count is zero.

### Verification

- `npm run lint`, `npm run typecheck`, 44 Vitest checks, 40 credential-independent Chromium checks, and the production build pass.
- Two live administrator tests remain explicitly skipped because dedicated credentials are absent.
- Docker/Supabase migration execution, database lint/type regeneration/role probes, and authenticated populated/empty/chart-interaction QA remain blocked and are not claimed as passed.

All notable project changes are recorded by controlled phase. Dates use ISO format.

## 2026-07-23 — Phase 8: Privacy-safe analytics

### Files added

- Browser analytics: feature context, public page tracker, reusable tracked external anchor, and component guidance.
- Analytics libraries: random identifier/session lifecycle, coarse classification, public-path/referrer normalization, best-effort dispatch, bounded request parsing, fixed-window rate limits, safe server flags/logging, and detailed guidance.
- Configuration/types: normalized public-destination boundary and shared analytics path/category/payload contracts.
- Server endpoints: `/api/analytics/page-view` and `/api/analytics/link-click` POST Route Handlers.
- Evidence: `tests/unit/analytics.test.ts`, `tests/e2e/analytics.spec.ts`, and `docs/qa/phase-08-analytics.md`.

### Files modified

- Public layout now mounts feature-flagged tracking only around public routes; administrator routes remain outside it.
- Header/mobile/home/reviews/location/contact actions now render a tracked native anchor only for a validated configured destination; all current blank values retain prior disabled states.
- Supabase project/service factories, Zod guidance, Playwright test environment, shared directory guides, root architecture/plan/checklist/content/decisions, and environment documentation reflect the Phase 8 boundary.

### Features implemented

- Random 365-day first-party visitor UUID and separate sessionStorage UUID rotating after 30 minutes of inactivity; no fingerprint derivation.
- One page-view dispatch per completed public pathname change, with rerender deduplication and explicit administrator exclusion.
- Allowlisted public paths, origin-only referrers, coarse browser/device categories, strict enums/UUIDs, and 4 KiB JSON request limits.
- Exact normalized destination/type approval for Airbnb, Facebook, Messenger, Google Maps, WhatsApp, telephone, and email; arbitrary values are rejected.
- `sendBeacon` link delivery with keepalive fetch fallback and native navigation preserved regardless of tracking outcome.
- Bounded per-visitor/global in-process rate limits, private/no-store responses, payload-free one-time warnings, and isolated service-key inserts.

### Bugs and risks fixed

- Full referrer paths/queries are reduced in the browser and again at the server boundary before storage.
- Invalid/admin paths, extra fields, malformed media, oversized bodies, URL credentials, insecure remote URLs, and unconfigured destinations fail closed before insertion.
- The service-role client now validates its Supabase project URL independently rather than accepting an arbitrary endpoint string.
- Feature-disabled mode creates no visitor/session IDs and dispatches no browser analytics request.

### QA results

- Lint, strict types, thirty unit tests, forty runnable Chromium tests, production build, dependency audit, lockfile dry run, bundle/secret/privacy/encoding scans pass; two Phase 7 credential-dependent tests remain explicitly skipped.
- Browser QA verifies identifier persistence, session stability, SameSite/Lifetime attributes, origin-only referrer output, navigation deduplication, admin exclusion, endpoint rejections, and public usability during aborted analytics delivery.
- Live page-view/link-click insertion and configured approved-link delivery are blocked because no Supabase credentials or approved destination were supplied.

### Remaining issues

- The in-process limiter is bounded and retains no raw IP but is not globally atomic across serverless instances; an approved distributed/WAF control is required before production-scale collection.
- Analytics/inquiry retention remains unapproved, and the Privacy page belongs to Phase 11.
- Dashboard reporting, operational inquiries/exports, final hardening, GitHub publication, and Vercel deployment remain later phases.

## 2026-07-23 — Phase 7: Administrator authentication

### Files added

- Administrator routes: public `src/app/admin/login/`, protected `(protected)` layout/dashboard shell, logout action, route states, and directory guidance.
- Authentication UI: `src/components/auth/AdminLoginForm.tsx`, protected `AdminHeader.tsx`, and both directory guides.
- Security boundaries: `src/proxy.ts`, `src/lib/supabase/config.ts`, `src/lib/supabase/proxy.ts`, `src/lib/auth/admin.ts`, and focused guidance.
- Validation/tests: `src/lib/validation/auth.ts`, `tests/unit/auth.test.ts`, credential-independent/live Playwright specs, and `docs/qa/phase-07-authentication.md`.

### Files modified

- Exact dependencies now include Zod 4.4.3; the lockfile and environment example document optional non-production test credentials.
- Supabase browser/server clients share validated public configuration and consistent SameSite plus production-Secure cookie options.
- `next.config.ts` applies private/no-store/noindex headers to every administrator route.
- Root, route, library, database, test, QA, architecture, decision, plan, and content documentation now records the Phase 7 boundary and blockers.

### Features implemented

- Email/password login through a bounded Server Action with no registration, password-reset, default credential, open redirect, or client-side secret handling.
- Next.js 16 request proxy using verified claims to refresh sessions and redirect unauthenticated protected requests.
- Independent server authorization using a freshly verified Auth user and RLS-visible `admin_profiles` membership.
- Protected dynamic dashboard shell, approved-profile display name, public-site return link, and Server Action logout.
- Generic sign-in/authorization errors, fail-closed missing configuration, noindex metadata/header, and private/no-store production responses.

### Bugs and risks fixed

- Browser QA caught and fixed insufficient contrast on the login registration notice.
- Next's development server replaces custom cache headers with its own `no-cache, must-revalidate`; production `next start` verification confirms the intended private/no-cache/no-store policy and noindex header.
- Request-proxy checks are explicitly documented/tested as optimistic only, preventing middleware from becoming the sole authorization boundary.
- Unsafe non-HTTPS remote Supabase endpoints now fail closed; documented localhost endpoints remain available in development.

### QA results

- Lint, strict types, eighteen unit tests, credential-independent admin Playwright tests, public regression, production build, dependency audit, lockfile dry run, secret/import scans, encoding scan, and privacy scan pass.
- The production server returns `private, no-cache, no-store, must-revalidate, max-age=0` and `X-Robots-Tag: noindex, nofollow` on `/admin/login`; an unauthenticated dashboard request ends at the fixed login route.
- Live approved-admin sign-in/redirect/access/logout, unapproved-user denial, session refresh, and issued-cookie inspection are blocked because no Supabase project or dedicated test credentials were supplied. These checks are not represented as passed.

### Remaining issues

- The dashboard is a protected shell only; Phase 9 owns analytics cards/charts/tables.
- Phase 6 migrations/RLS and all live Phase 7 identity states still require a running approved database project.
- Analytics, operational inquiries/exports, Privacy, final hardening, GitHub publication, and Vercel deployment remain later phases.

## 2026-07-23 — Phase 6: Supabase database

### Files added

- Ordered migrations: `supabase/migrations/001_create_admin_profiles.sql` through `006_create_analytics_views.sql`.
- Database runtime files: `supabase/config.toml`, `supabase/seed.sql`, `supabase/README.md`, and `supabase/migrations/README.md`.
- Typed boundaries: `src/lib/supabase/client.ts`, `server.ts`, `service.ts`, and directory guidance.
- Schema types: `src/types/database.ts` and `src/types/README.md`.
- Automated evidence: `tests/unit/database-schema.test.ts` and `docs/qa/phase-06-database.md`.

### Files modified

- `package.json` and `package-lock.json` — added exact Supabase SSR/client/CLI dependencies and local database scripts.
- `.gitignore` — excludes local Supabase runtime/link state while preserving migrations, seed, and configuration.
- `src/lib/README.md`, `src/app/README.md`, and `tests/README.md` — documented client trust boundaries, route independence, schema tests, and blocked live checks.
- Root project documentation — recorded the Phase 6 architecture, decisions, constraints, QA evidence, and unresolved runtime/retention requirements.

### Features implemented

- Four bounded application tables: Auth-linked administrator profiles, minimized page views, approved link clicks, and optional contact inquiries.
- Date, visitor, session, path, link-type, check-in, and inquiry-status indexes.
- Enum-like device/browser/link/role/status checks plus text, contact, date-order, consent, and guest-count bounds.
- RLS on every table, direct client privilege revocation, no anon/direct insert policies, approved-administrator reads, and status-only inquiry updates.
- Private search-path-hardened administrator membership helper with scalar policy evaluation.
- Explicit insert-only analytics/inquiry service grants and out-of-band administrator-profile provisioning grants.
- Four security-invoker daily reporting views using Asia/Manila calendar dates.
- Disabled-signup local Supabase configuration and repeatable demonstration data with no Auth/admin seed identity.
- Typed optional browser/server clients subject to RLS and a separate server-only privileged client.

### Bugs and risks fixed

- Wrapped the RLS membership helper in scalar subqueries after current guidance review, avoiding per-row reevaluation.
- Revoked authenticated view privileges explicitly before granting select, protecting legacy projects with broader default grants.
- Added explicit minimal service-role grants because current Supabase defaults do not auto-expose new objects.
- Removed an unused local Studio environment reference so every real configuration variable remains documented.
- An npm cleanup step reported one non-blocking Windows `EPERM` warning; the CLI version check, lockfile dry run, audit, tests, and build all passed afterward.

### QA results

- Lint, strict types, eight unit tests, thirty-one Chromium regression tests, production build, dependency audit, and lockfile dry run passed.
- Static database tests verify migration order/headers, tables, constraints, indexes, privilege/policy shape, RLS-aware views, local signup denial, and safe seed records.
- Official Supabase/PostgreSQL guidance was checked for RLS helpers, view security, and privileged server-client isolation.
- `db:start`, `db:reset`, `db:lint`, and `db:types` are blocked because Docker Desktop's engine is unavailable; no approved remote project or role identities were supplied.

### Remaining issues

- Migrations have not been applied to a local or remote database, so SQL execution, lint, generated-type comparison, and live anon/unapproved/admin/service role behavior remain unverified.
- No administrator identity exists; manual Auth/profile provisioning belongs to Phase 7.
- Retention/deletion periods for analytics and inquiries require owner approval.
- Analytics collection, authentication, dashboard, inquiry submission/export, Privacy, SEO hardening, and deployment remain later phases.

## 2026-07-23 — Phase 5: Gallery, reviews, location, and contact

### Files added

- Public routes: `src/app/(public)/gallery/page.tsx`, `reviews/page.tsx`, `location/page.tsx`, and `contact/page.tsx`.
- Gallery: `src/components/gallery/GalleryImage.tsx`, `GalleryGrid.tsx`, `GalleryLightbox.tsx`, `GalleryExperience.tsx`, and directory guidance.
- Reviews: `src/components/reviews/RatingSummary.tsx`, `RatingBreakdown.tsx`, `ReviewCard.tsx`, `MessengerReviewPlaceholders.tsx`, and directory guidance.
- Location/contact: `src/components/location/CopyAddressButton.tsx`, `src/components/forms/ContactInquiryForm.tsx`, both directory guides, and `src/data/contact.ts`.
- Media and tests: `public/images/placeholders/gallery-generic-placeholder.svg` and `tests/e2e/discovery-contact.spec.ts`.
- QA evidence: `docs/qa/phase-05-discovery-contact.md`.

### Files modified

- `src/data/gallery.ts`, `reviews.ts`, and `site.ts` — extended homepage data with fourteen gallery records, Messenger publication reservations, and nullable public contact destinations.
- `src/data/navigation.ts` — activated Gallery, Reviews, Location, and Contact after their route QA.
- `tests/e2e/public-layout.spec.ts` — updated navigation availability and mobile-menu focus expectations.
- Root and directory documentation — recorded Phase 5 architecture, provisional content, decisions, safeguards, QA, and remaining limitations.

### Features implemented

- Four unauthenticated discovery/contact pages with route metadata, breadcrumbs, active shared navigation, and responsive layouts.
- Fourteen-category gallery using local labelled placeholders, responsive lazy images, loading/error feedback, and a contained-image lightbox with focus management, scroll locking, Escape, arrows, and visible previous/next/close controls.
- Source-labelled Airbnb summary, six category ratings, three supplied excerpts, disabled full-listing action, and three honest Messenger placeholders containing no invented feedback.
- Confirmed text address and directions, clipboard-copy status, non-navigational map illustration, and disabled Maps action.
- Six null-configured contact channels, Airbnb payment-safety guidance, and a disabled no-action/no-persistence inquiry-form preview with no payment-card fields.

### Bugs fixed

- Replaced an unavailable Lucide brand icon with a neutral share icon and removed an unused import/unescaped apostrophe found by lint.
- Corrected browser assertions to account for disabled controls inherited from a disabled fieldset.
- Waited for the homepage level-one heading before a shell Axe scan to avoid checking its route-loading transition.
- Switched lightbox imagery from crop to contain sizing after mobile visual review found that the placeholder disclosure could be cut off; added a browser regression assertion.
- Prioritized the first gallery tile and location illustration after development diagnostics identified them as possible largest-contentful-paint images.

### QA results

- Lint, strict types, two unit tests, thirty-one Chromium tests, eight route-level Axe scans, production build, dependency audit, XML/SVG safety, destination, encoding, and private-data scans passed.
- Gallery, Reviews, Location, Contact, and the open lightbox were manually inspected at 1440×1000 and 390×844 without observed clipping, overlap, or horizontal overflow after the lightbox correction.
- Clipboard behavior, disabled contact/inquiry behavior, zero unverified external anchors, and the absence of payment-card fields were browser-verified.

### Remaining issues

- Official photography, complete approved external/contact destinations, and publishable Messenger feedback remain pending.
- The map action and all contact channels remain disabled; the inquiry preview cannot submit or store data.
- Privacy, Git, database, authentication, analytics, operational inquiries, SEO hardening, and deployment remain in later phases.

## 2026-07-23 — Phase 4: Public information pages

### Files added

- Public routes: `src/app/(public)/accommodation/page.tsx`, `amenities/page.tsx`, and `guest-guide/page.tsx`.
- Shared public presentation: `src/components/public/PageHero.tsx`, `PageSectionHeading.tsx`, `DisclosureNote.tsx`, `AvailabilityBadge.tsx`, and directory guidance.
- Typed content: `src/data/guestGuide.ts`, `houseRules.ts`, `fees.ts`, and `faqs.ts`.
- Browser coverage: `tests/e2e/public-information.spec.ts`.
- QA evidence: `docs/qa/phase-04-public-information.md`.

### Files modified

- `src/data/accommodation.ts`, `amenities.ts`, and `attractions.ts` — added full-page grouped content and explicit certainty/condition notes while preserving homepage exports.
- `src/data/navigation.ts` — activated Accommodation, Amenities, and Guest Guide after route implementation.
- `src/components/layout/DesktopNavigation.tsx` — marks the exact active information route.
- `src/app/layout.tsx` — declared intentional smooth scrolling for Next.js route transitions.
- `tests/e2e/public-layout.spec.ts` — updated availability counts and the mobile focus-trap endpoint.
- Root and directory documentation — recorded Phase 4 architecture, content policy, QA, decisions, and limitations.

### Features implemented

- Public Accommodation page with capacity, spaces, facilities, bathroom qualification, and booking-inclusion safeguards.
- Public Amenities page with grouped supplied/confirm states, mobile-connectivity guidance, and optional-service caveats.
- Public Guest Guide with arrival times, packing lists, self-catering/shopping guidance, water/connectivity notes, house rules, centralized unpublished-fee states, ten nearby attractions, and twenty native FAQs.
- Route metadata, breadcrumbs, internal cross-links, guest-guide section navigation, active desktop/mobile/footer navigation, and fully public access.

### Bugs fixed

- Added an explicit union-property guard after strict TypeScript rejected access to optional amenity detail fields.
- Made duplicated rule/FAQ test locators exact or disclosure-scoped.
- Updated the mobile focus-trap test after Guest Guide became the final active link.
- Waited for each final level-one heading before Axe scans to avoid auditing the transient route loading state.
- Declared the existing smooth-scroll behavior on the root HTML element to satisfy Next.js route-transition guidance.
- Removed duplicated site-name suffixes from page metadata by relying on the root title template.

### QA results

- Lint, strict types, two unit tests, twenty-two Chromium tests, four route-level Axe scans, production build, dependency audit, content/privacy/destination scans, and SVG regression checks passed.
- All three routes were manually inspected at 1440×1000 and 390×844 without observed clipping, overlap, or horizontal overflow.
- The source-content audit found no public fee amount, fixed-Wi-Fi promise, guaranteed signal/water pressure, or unqualified kubo/cottage inclusion.

### Remaining issues

- All business fees, expanded-capacity terms, pet/service conditions, water/washer details, and kubo/cottage inclusions still require owner confirmation.
- Gallery, reviews, location, and contact remain upcoming until Phase 5.
- Official imagery, external destinations, Git, database, authentication, analytics, inquiries, and deployment remain pending.

## 2026-07-23 — Phase 3: Complete homepage

### Files added

- Homepage components: `src/components/home/SectionHeading.tsx` plus hero, trust, highlights, about, accommodation, amenities, gallery, reviews, location, attractions, and booking-call-to-action sections.
- Typed public content: `src/data/site.ts`, `accommodation.ts`, `amenities.ts`, `gallery.ts`, `reviews.ts`, `location.ts`, and `attractions.ts`.
- Six explicit local illustrations in `public/images/placeholders/` for the hero, exterior, bedroom, garden, beach, and non-navigational location positions.
- Browser coverage in `tests/e2e/homepage.spec.ts`.
- Directory guidance in `src/components/home/README.md` and `public/images/README.md`.
- Phase evidence in `docs/qa/phase-03-homepage.md`.

### Files modified

- `src/app/(public)/page.tsx` — replaced the Phase 2 status screen with the composed homepage.
- `src/data/navigation.ts` — activated the implemented About homepage anchor while keeping future routes and Airbnb unavailable.
- `tests/e2e/foundation.spec.ts` and `tests/e2e/public-layout.spec.ts` — updated assertions for the complete homepage and new available anchor.
- Root and directory documentation — recorded the implemented homepage, content boundaries, decisions, QA, and limitations.

### Features implemented

- Complete responsive homepage with all required preview sections and a single public level-one heading.
- Centralized, typed property content with explicit qualifiers for conditional capacity, reported bathroom facilities, mobile connectivity, frying-kubo status, and weather/tide/provider-dependent attractions.
- Responsive local placeholder artwork with visible disclosures and accurate alternative text.
- Airbnb rating/review attribution and non-endorsement copy without an active unverified destination.
- Confirmed address/direction presentation with a disabled map action and non-navigational illustration.
- Working About and location in-page navigation; unverified booking, reviews, and map actions remain disabled.

### Bugs fixed

- Increased small muted text contrast after Axe identified sub-threshold labels on light surfaces.
- Replaced the dark-section gold eyebrow with a high-contrast light style after the accessibility rerun isolated the remaining violation.
- Made the location-link Playwright locator exact after it also matched the closing “Review location” action.
- Balanced the desktop gallery collage after visual inspection found the fourth tile wrapping beneath the lead image.
- Qualified the supplied frying-kubo references so the homepage does not imply confirmed guest access.
- Serialized Playwright workers after the Next.js development server logged a router-initialization race during six simultaneous page hydrations; the serial rerun was clean.

### QA results

- Lint, strict typecheck, two unit tests, fourteen Chromium tests, full-page Axe scan, production build, dependency audit, SVG XML/safety checks, and private-data/unverified-link scans passed.
- Desktop 1440×1000 and mobile 390×844 full-page screenshots were manually inspected; the corrected desktop gallery was also inspected at section scale.
- All six placeholder assets loaded locally and were confirmed as visibly/semantically provisional.

### Remaining issues

- Standalone information routes and the full gallery/lightbox begin in Phases 4 and 5.
- Official property photography, final logo colors, exact external destinations, and other owner confirmations remain pending in `CONTENT_TODO.md`.
- The workspace is not connected to Git; database, authentication, analytics, inquiries, and deployment remain in their scheduled phases.

## 2026-07-23 — Phase 0: Repository audit and planning

### Files added

- `README.md` — project purpose, planned stack/features, environment contract, setup/deployment outline, limitations, and privacy baseline.
- `ARCHITECTURE.md` — planned public/admin/data/security/deployment architecture and diagrams.
- `IMPLEMENTATION_PLAN.md` — controlled Phases 0–12, dependencies, expected files, QA gates, and directory README schedule.
- `QA_CHECKLIST.md` — cross-project verification checklist with honest Phase 0 marks.
- `CONTENT_TODO.md` — all known conflicts, missing destinations, permissions, fees, facts, media, and product decisions.
- `CHANGELOG.md` — phase history.
- `DECISIONS.md` — initial architecture and process decision records.
- `docs/qa/phase-00-repository-audit.md` — Phase 0 commands, observations, validation, and limitations.

### Features implemented

- None. Phase 0 intentionally performed planning and documentation only.

### Bugs fixed

- None; no application existed to test.

### QA results

- Workspace, Git status, and available Node/npm runtimes inspected.
- Eight required Phase 0 documents created.
- Documentation presence and required-topic checks passed.
- Private caretaker telephone numbers were intentionally excluded from repository documentation.
- Application lint, typecheck, tests, and build were not applicable because scaffolding is Phase 1.

### Remaining issues

- The workspace is not yet a Git repository and has no application scaffold or dependency manifest.
- Business/content confirmations remain in `CONTENT_TODO.md`.

## 2026-07-23 — Phase 2: Branding and public layout

### Files added

- Brand assets: `public/logo/villa-vessela-logo.svg`, `villa-vessela-logo-dark.svg`, `villa-vessela-logo-light.svg`, `villa-vessela-mark.svg`, `villa-vessela-mark-light.svg`, and `favicon.svg`.
- Branding components: `src/components/branding/VillaLogo.tsx` and `SampaguitaDivider.tsx`.
- Layout components: `src/components/layout/Header.tsx`, `DesktopNavigation.tsx`, `MobileNavigation.tsx`, and `Footer.tsx`.
- Public route group: `src/app/(public)/layout.tsx` and `src/app/(public)/page.tsx`.
- Typed navigation: `src/data/navigation.ts`.
- Documentation: `src/components/branding/README.md`, `src/components/layout/README.md`, `src/data/README.md`, `public/logo/README.md`, and `docs/qa/phase-02-branding-layout.md`.
- Browser coverage: `tests/e2e/public-layout.spec.ts`.

### Files modified

- `package.json` and `package-lock.json` — added exact Lucide and Axe Playwright dependencies.
- `src/app/layout.tsx` — registered the SVG favicon.
- `src/app/not-found.tsx` — disabled unnecessary Home prefetch.
- `tests/e2e/foundation.spec.ts` — updated the Phase 2 placeholder heading expectation.
- Root and directory documentation — recorded the Phase 2 implementation, decisions, and evidence.

### Files removed

- `src/app/page.tsx` — replaced by the equivalent root route inside the `(public)` route group so administrator pages will not inherit public chrome.

### Features implemented

- Original editable VV horizontal, emblem, light/dark, and favicon SVG identity.
- Responsive sticky public header and verified-information footer.
- Required navigation labels with safe available/upcoming states.
- Accessible mobile navigation dialog with scroll lock, focus trap/restoration, Escape, backdrop and navigation closure.
- Disabled Airbnb booking state that does not contain an invented destination.
- Shared public route-group layout and temporary Phase 2 status page.

### Bugs fixed

- Removed a synchronous state update from a React effect after the lint rule identified it.
- Refreshed stale Next development route types after moving the root page.
- Disabled unnecessary Home-link prefetch after it caused a concurrent development router-initialization warning.
- Corrected the final SVG safety probe to distinguish a true no-match result from a scanner syntax/error exit, then reran it successfully.

### QA results

- Six SVG files parsed successfully as XML and five served brand assets plus the favicon were verified in Chromium.
- Lint, strict types, two unit tests, nine Chromium tests, Axe, production build, and dependency audit passed.
- Desktop and open-menu mobile screenshots were manually inspected without observed clipping, overlap, or logo-rendering failure.
- Private-data and configured-destination scans found no caretaker number, populated service key, or active unverified external booking link.

### Remaining issues

- The complete homepage and all future public content routes remain unimplemented.
- The Airbnb link remains disabled until a complete verified URL is supplied.
- Final logo colors still require owner approval; current tokens follow the project package's suggested palette.
- The workspace is not connected to Git, and all Phase 1 content/credential limitations still apply.
- Credentials and production destinations have not been supplied and are not needed for Phase 2.

## 2026-07-23 — Phase 1: Project foundation

### Files added

- Package/configuration: `package.json`, `package-lock.json`, `.gitignore`, `.env.example`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts`, and `playwright.config.ts`.
- Application shell: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/loading.tsx`, `src/app/error.tsx`, and `src/app/not-found.tsx`.
- Reusable foundation: `src/components/ui/Button.tsx`, `Card.tsx`, `Container.tsx`, `SkipLink.tsx`, and `src/lib/utils.ts`.
- Tests: `tests/unit/utils.test.ts` and `tests/e2e/foundation.spec.ts`.
- Directory documentation: `src/app/README.md`, `src/components/README.md`, `src/lib/README.md`, and `tests/README.md`.
- QA evidence: `docs/qa/phase-01-foundation.md`.

### Files modified

- `README.md` — replaced planning-only setup with the verified foundation stack, commands, status, and limitations.
- `ARCHITECTURE.md` — recorded the implemented foundation separately from planned systems.
- `IMPLEMENTATION_PLAN.md` — marked Phase 1 QA passed and recorded its concrete outcome.
- `QA_CHECKLIST.md` — checked only evidence-supported foundation items.
- `DECISIONS.md` — recorded compatibility pins and narrow security overrides.
- `CHANGELOG.md` — added this phase record.

### Features implemented

- Runnable static Next.js App Router shell with baseline metadata and semantic design tokens.
- Accessible skip link, root loading/error/not-found states, and reusable button/card/container primitives.
- Strict TypeScript, Tailwind 4/PostCSS, ESLint, Vitest, Playwright, npm scripts, and documented environment contract.
- Temporary foundation status page; final branding/homepage remain intentionally out of scope.

### Bugs fixed

- Replaced TypeScript 7 and ESLint 10 with versions inside all current peer ranges.
- Removed deprecated TypeScript `baseUrl` usage.
- Aligned the Playwright base URL to prevent Next.js development cross-origin warnings.
- Overrode vulnerable Next transitive PostCSS/Sharp versions with patched compatible releases.
- Redacted private caretaker-number literals that the final privacy check found in a QA command example, then reran the repository scan successfully.

### QA results

- Lint, strict typecheck, two unit tests, four Chromium tests, production build, lockfile dry run, and npm audit passed.
- Root and 404 routes were statically generated.
- Desktop/mobile screenshots were manually inspected with no observed clipping or overlap.
- Source/build privacy scans found no private caretaker numbers and source has no explicit `any` usage.

### Remaining issues

- The workspace is not a Git repository.
- The current root route is a temporary Phase 1 status page.
- All later branding, public content, Supabase, authentication, analytics, dashboard, inquiry, SEO, and deployment phases remain unimplemented.
- Business/content confirmations remain in `CONTENT_TODO.md`.
