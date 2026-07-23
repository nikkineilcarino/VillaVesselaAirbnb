# Implementation Plan

## Delivery rule

Only one phase may be implemented at a time. Every phase begins with a briefing, inspects existing work, updates documentation, implements its stated scope, runs relevant QA, fixes in-scope failures, records evidence, and stops for the exact user instruction `continue`.

Status values are **Not started**, **In progress**, **Blocked**, **Completed**, and **QA passed**.

## Phase summary

| Phase | Scope | Dependencies | Status |
| --- | --- | --- | --- |
| 0 | Repository audit, architecture, documentation, content register, QA plan | Supplied 42-page project package | QA passed |
| 1 | Project foundation: scaffold, dependencies, strict TypeScript, Tailwind, tokens, globals, base utilities/UI | Phase 0 approval | QA passed |
| 2 | Editable SVG branding, header, navigation, mobile menu, footer, public layout | Phase 1 | QA passed |
| 3 | Complete homepage sections and centralized homepage content | Phase 2; labelled image placeholders | QA passed |
| 4 | Accommodation, amenities, guest guide, house rules, FAQ, attractions | Phase 3 | QA passed |
| 5 | Gallery/lightbox, reviews, map/location, contact options, inquiry UI shell | Phase 4; official media/URLs optional and configurable | QA passed |
| 6 | Supabase migrations, constraints, indexes, RLS, typed schema, safe sample seed | Phase 1; Supabase design review | Completed |
| 7 | Admin login/logout, session refresh, server authorization, route protection | Phase 6; Supabase credentials for live QA | Completed |
| 8 | Anonymous visitor/session IDs, page views, tracked links, validation, rate limits | Phases 5–7; approved destinations for full QA | Completed |
| 9 | Dashboard cards, charts, date filters, tables, loading/empty/error states | Phase 8; database or labelled sample data | Completed |
| 10 | Inquiry submission/admin status and protected CSV exports | Phases 6, 7, and 9; feature flag decision | Completed |
| 11 | SEO, structured data, accessibility, performance, security, privacy hardening | All feature phases | Completed |
| 12 | Regression QA, production build, docs audit, Supabase/Vercel release runbook | Phases 1–11 | Not started |

## Detailed phases

### Phase 0 — Repository audit and planning

- **Tasks:** inspect workspace and tools; identify existing stack/conventions/conflicts; extract source requirements; create root project documents; define directory documentation; record decisions and unknown content; create honest QA evidence.
- **Files:** `README.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `QA_CHECKLIST.md`, `CONTENT_TODO.md`, `CHANGELOG.md`, `DECISIONS.md`, `docs/qa/phase-00-repository-audit.md`.
- **Completion:** required files exist, required topics are covered, private caretaker numbers are not copied, no application implementation is started, and documentation checks pass.

### Phase 1 — Project foundation

- **Tasks:** scaffold a compatible Next.js App Router project using npm; enable strict TypeScript; configure Tailwind, ESLint, and scripts; add design tokens/global styles; create `.env.example`; establish base route layouts, utilities, types, and minimal reusable UI primitives.
- **Expected files:** package/config/lock files, `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/`, `src/types/`, `src/components/ui/`, `.env.example`, and relevant README files.
- **QA:** clean install, file/import checks, lint, typecheck, initial tests where meaningful, and production build.
- **Completion note:** Completed with exact dependency locking, an audit-clean override policy, four reusable UI primitives, route states, two passing unit tests, four passing Chromium tests, a successful production build, and Phase 1 evidence in `docs/qa/phase-01-foundation.md`. Shared domain types are deferred until their owning content/analytics phases to avoid speculative abstractions.

### Phase 2 — Branding and public layout

- **Tasks:** create original editable full, mark, light, dark, and favicon SVGs; build accessible header, desktop/mobile navigation, footer, shared public layout, focus behavior, scroll locking, and reduced-motion behavior.
- **Expected files:** `public/logo/`, `src/components/branding/`, `src/components/layout/`, navigation data, public layout.
- **QA:** SVG validity, route/navigation checks, keyboard and focus checks, mobile menu behavior, reduced motion, lint/types/build.
- **Completion note:** Completed with six validated SVG assets, shared public header/footer, one typed navigation model, explicit upcoming/unverified states, a focus-managed mobile dialog, Axe coverage, nine passing Chromium tests, responsive visual inspection, and evidence in `docs/qa/phase-02-branding-layout.md`.

### Phase 3 — Homepage

- **Tasks:** hero, trust indicators, summary, about/accommodation/amenities/gallery/reviews/location/attractions previews, booking CTA, and Airbnb attribution/disclaimer. Missing URLs stay disabled; image substitutes are labelled placeholders.
- **Expected files:** public home page, `src/components/home/`, relevant `src/data/`, placeholder assets.
- **QA:** content-to-source audit, responsive viewport checks, keyboard/accessibility review, image behavior, inactive-link checks, lint/types/build and homepage Playwright checks.
- **Completion note:** Completed with eleven composed homepage sections, seven focused typed content modules, six clearly labelled local SVG placeholders, truthful disabled booking/map/review actions, responsive `next/image` behavior, a zero-violation Axe run, fourteen passing Chromium tests, desktop/mobile visual inspection, and evidence in `docs/qa/phase-03-homepage.md`.

### Phase 4 — Public information pages

- **Tasks:** build accommodation, amenities, guest guide, house rules, FAQs, and attractions content without overstating Wi-Fi, water pressure, services, capacity, inclusions, or tour prices.
- **Expected files:** public route pages and centralized content modules.
- **QA:** all routes public, source/content audit, responsive and keyboard review, structured headings, lint/types/build.
- **Completion note:** Completed with public `/accommodation`, `/amenities`, and `/guest-guide` routes; anchored rules, fees, attractions, and 20 native FAQs; focused typed data/configuration; explicit supplied-versus-confirm states; unpublished draft fees; active navigation; three-page Axe/mobile coverage; twenty-two passing Chromium tests; responsive visual review; and evidence in `docs/qa/phase-04-public-information.md`.

### Phase 5 — Gallery, reviews, location, and contact

- **Tasks:** category-driven gallery, accessible lightbox, Airbnb review summary/excerpts, Messenger placeholders only, configurable map/copy-address controls, approved contact action UI, and disabled/enabled inquiry shell.
- **Expected files:** gallery/review/form components, route pages, content data, related README files.
- **QA:** lightbox keyboard/escape/focus tests, image fallbacks, review attribution, no fabricated reviews, no unverified active destinations, form UI accessibility, lint/types/build/e2e.
- **Completion note:** Completed with public `/gallery`, `/reviews`, `/location`, and `/contact` routes; fourteen category placeholders; an accessible focus-managed lightbox; supplied and attributed review data; three honest Messenger reservations; confirmed-address copying; null-configured map/contact actions; a disabled no-action inquiry preview; four-page Axe/mobile coverage; thirty-one passing Chromium tests; responsive visual review; and evidence in `docs/qa/phase-05-discovery-contact.md`.

### Phase 6 — Supabase database

- **Tasks:** create documented, ordered migrations for admin profiles, analytics, inquiries, constraints, indexes, RLS, policies, and aggregate support; create clearly labelled development seed data and database types.
- **Expected files:** `supabase/migrations/*.sql`, `supabase/seed.sql`, Supabase client/server modules, database types and README files.
- **QA:** SQL review/lint where available, local or remote migration application when configured, constraint/index inspection, RLS role tests; missing database access is marked blocked.
- **Completion note:** Completed with six ordered/documented migrations, four bounded tables, reporting indexes, deny-by-default RLS, a private administrator-membership helper, limited administrator/service grants, four `security_invoker` Asia/Manila views, disabled-signup local configuration, synthetic repeatable seed data, typed Supabase clients/schema, eight passing unit tests, full public regression/build, and evidence in `docs/qa/phase-06-database.md`. Docker's engine and an approved remote project are unavailable, so migration application, database lint, generated-type comparison, and live role probes remain explicitly blocked.

### Phase 7 — Administrator authentication

- **Tasks:** Supabase email/password login/logout/session refresh, no registration, server-side `admin_profiles` authorization, protected admin layout/routes, safe redirects and errors.
- **Expected files:** admin login/layout/dashboard shell, auth and middleware modules.
- **QA:** unauthenticated redirects, non-admin denial, approved-admin access, logout, cookie/session review, no client secret leakage, e2e with configured test account or explicit blocker.
- **Completion note:** Completed with a public no-registration login, bounded Zod Server Action, Next.js 16 request proxy using verified claims for refresh/optimistic access, fixed redirects, authoritative server `getUser()` plus RLS-visible `admin_profiles` authorization, protected dynamic dashboard shell, logout, consistent SameSite/production-Secure cookie options, private/no-store/noindex production responses, eighteen passing unit tests, credential-independent admin browser/accessibility checks, full public regression, and evidence in `docs/qa/phase-07-authentication.md`. Live approved-admin, unapproved-user, refresh/logout, and issued-cookie checks are explicitly blocked because no configured Supabase project or dedicated credentials exist; the phase is therefore `Completed`, not `QA passed`.

### Phase 8 — Privacy-safe analytics

- **Tasks:** random first-party visitor/session IDs, route page-view tracker, approved-destination tracked external links, Zod schemas, normalization, rate limiting, safe logging and failure isolation.
- **Expected files:** analytics components/lib/types, validation modules, page-view and link-click route handlers.
- **QA:** deduplication, no admin tracking, allowed link types/destinations, event insert tests, outage/non-blocking navigation tests, privacy field audit, unit/e2e checks.
- **Completion note:** Completed with feature-flagged public tracking, random visitor/session UUIDs, a 365-day SameSite=Lax/HTTPS-Secure visitor cookie, 30-minute inactivity session rotation, public-path deduplication, origin-only referrers, coarse categories, exact normalized destination configuration, reusable non-blocking tracked links, two same-origin/4 KiB/Zod-validated POST handlers, bounded per-visitor/global in-process rate limits, payload-free one-time failure logs, and service-client insert isolation. Thirty unit tests and forty runnable Chromium tests pass; two Phase 7 live-auth checks remain skipped. Database inserts and configured real-link delivery remain explicitly blocked by missing Supabase credentials/approved URLs, and distributed rate limiting remains a deployment-hardening requirement. Evidence is in `docs/qa/phase-08-analytics.md`; the phase is `Completed`, not `QA passed`.

### Phase 9 — Administrator dashboard

- **Tasks:** consistent Asia/Manila date filters and aggregate definitions, metric cards, Recharts views, accessible summaries, recent activity tables, responsive admin navigation, loading/empty/error states.
- **Expected files:** admin routes, analytics query modules/types/components.
- **QA:** aggregate/date/CTR unit tests, authorization, responsive/keyboard/chart summary review, pagination/limits, database-backed or explicitly labelled sample-state checks.
- **Completion note:** Completed with five validated Asia/Manila date modes, one shared inclusive-local/exclusive-UTC interval, ten exact database cards, five route-scoped Recharts visualizations with expandable data tables, three 15-row recent-activity tables, shortened anonymous identifiers, contact-channel-only inquiry summaries, synthetic-data detection, and distinct invalid/empty/loading/unavailable/error states. Migration `007` adds five bounded authenticated-only `SECURITY INVOKER` aggregates; dashboard reads use the authenticated RLS client rather than the service role. Forty-four unit tests and forty credential-independent Chromium checks pass; two live administrator checks remain skipped. Docker/database execution and authenticated populated/empty/chart interaction QA remain blocked, so the phase is `Completed`, not `QA passed`. Evidence is in `docs/qa/phase-09-dashboard.md`.

### Phase 10 — Inquiries and CSV export

- **Tasks:** feature-flagged contact submission, schemas, consent, date/guest/contact validation, sanitization, anti-spam/rate limits, admin inquiry management, protected exports with escaping.
- **Expected files:** contact route and schema/form, inquiries admin page/actions, CSV module/export route.
- **QA:** disabled and enabled modes, invalid/valid input, no payment fields, public read denial, admin updates, auth/date validation and CSV escaping/download tests.
- **Completion note:** Completed with an exact default-off server feature switch, disabled and operational form variants, 8 KiB same-origin JSON handling, strict sanitization/contact/date/guest/consent/payment-pattern rules, honeypot/fill-time/per-client/global abuse controls, explicit stored/unavailable UI states, and isolated service-role insertion. Administrators receive an RLS-backed 20-row paginated inquiry list, allowlisted status-only Server Action updates, and three authenticated date-bounded/formula-safe CSV exports paged by 1,000 with a 10,000-row ceiling. Sixty unit tests pass; disabled and enabled browser modes, mobile fit/Axe, storage-unavailable truthfulness, and unauthenticated export denial pass. Live database insertion, approved administrator update/download, and role probes remain blocked, so the phase is `Completed`, not `QA passed`. Evidence is in `docs/qa/phase-10-inquiries-exports.md`.

### Phase 11 — SEO, accessibility, performance, and security

- **Tasks:** page metadata, canonical/Open Graph configuration, placeholder share asset, favicon/icons, sitemap, robots, verified structured data, semantic/focus/contrast audit, image/JS/query optimization, headers, redirect and privacy reviews.
- **Expected files:** metadata/system routes, structured data/breadcrumb components, assets and config changes.
- **QA:** automated and manual accessibility checks, metadata/structured-data inspection, performance review, public-bundle secret scan, security/privacy checklist, lint/types/tests/build.
- **Completion note:** Completed with unique metadata for nine public pages; validated canonical-origin handling; fail-closed non-production indexing; static sitemap/robots/manifest/social-image routes; favicon plus inspected 180/192/512 icons; conservative verified-fact `LodgingBusiness` and breadcrumb JSON-LD; a public Privacy page matching actual analytics/inquiry/storage/admin behavior; two-color/forced-color focus, focus clearance, reflow, and reduced-motion hardening; restrictive global/production headers; static-asset caching; and route-scoped system-font performance review. Sixty-seven unit tests, forty-seven credential-independent Chromium checks, a separate three-check enabled-inquiry run, production build/header/visual checks, dependency audit, and privacy/secret/encoding/bundle scans pass. Two live administrator checks plus database/retention/deletion/deployment checks remain blocked, so the phase is `Completed`, not `QA passed`. Evidence is in `docs/qa/phase-11-hardening.md`.

### Phase 12 — Final QA and deployment readiness

- **Status:** Completed with Supabase-dependent acceptance criteria blocked.
- **Tasks:** full regression, dependency and documentation review, build, final Vercel/Supabase runbook, production checklist and owner-verification list.
- **Expected files:** final QA report and updates to all project/directory documents.
- **QA:** lint, typecheck, unit tests, full Playwright suite, build, route matrix, access-control and privacy regression. Any credential-dependent check remains explicitly blocked until executed.
- **Completion note:** The owner-attributed `main` branch is published at `nikkineilcarino/VillaVesselaAirbnb`. Vercel project `villa-vessela-airbnb` is deployed in the requested team and aliased to `https://villa-vessela-airbnb.vercel.app` from application commit `8275f9840d3bc306bddf2d7bfd697d69da776be7`. The audited Node line is pinned to 22.x. Only the canonical origin plus explicit false analytics/inquiry flags are configured; no Supabase credential, test credential, private contact, or public destination was added. Local lint, types, 67 unit tests, 47 browser checks with 2 explicit live skips, the separate 3-check inquiry run, audit, lockfile simulation, and build pass. The final deployment reports Ready and 39 production browser checks plus route/header/privacy/bundle/cookie scans pass. Supabase migrations, RLS role probes, administrator access, data insertion/readback, retention, and deletion remain blocked. Evidence is in `docs/qa/phase-12-release.md`.

## Directory README plan

Create each README when its directory is introduced, not as an empty placeholder. Each must explain purpose, responsibilities, interactions, safe extension, restrictions, environment variables, testing, privacy/security, and sensitive files.

| Directory README | Planned phase |
| --- | --- |
| `src/app/README.md` | 1 |
| `src/app/admin/README.md` | 7 |
| `src/app/api/README.md` | 8 |
| `src/components/README.md` | 1 |
| `src/components/analytics/README.md` | 8 |
| `src/components/gallery/README.md` | 5 |
| `src/data/README.md` | 3 |
| `src/lib/README.md` | 1 |
| `src/lib/analytics/README.md` | 8 |
| `src/lib/auth/README.md` | 7 |
| `src/lib/supabase/README.md` | 6 |
| `src/lib/validation/README.md` | 8 |
| `supabase/README.md` | 6 |
| `supabase/migrations/README.md` | 6 |
| `tests/README.md` | 1 |
| `public/images/README.md` | 3 |

Additional major directories may receive a README when their complexity warrants it; tiny presentational folders should not get redundant documentation.
