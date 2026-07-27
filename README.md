# Villa Vessela Website

## Project overview

This repository contains the independent website for **Beachfront Tondol Beach Villa Vessela**, a vacation-rental property in Tondol, Purok 2, Anda, Pangasinan, Philippines.

The public site helps families and groups understand the property and can continue to an approved booking or contact channel after the owner supplies one. A separate administrator area is implemented for privacy-safe aggregate analytics and optional inquiry management, but remains unavailable until an approved Supabase project is configured. Public visitors never need an account.

The source of truth is the 42-page *Villa Vessela Website Project Package* dated July 2026. Unknown or conflicting business details must stay hidden, disabled, or explicitly unconfirmed until the owner approves them.

## Current status

Phase 12 public release is complete. The source is published on [GitHub](https://github.com/nikkineilcarino/VillaVesselaAirbnb), and the production site is live at [villa-vessela-airbnb.vercel.app](https://villa-vessela-airbnb.vercel.app). The final Node 22 Vercel deployment passed its provider build and production Chromium checks covering all public routes, mobile/keyboard/dialog behavior, Axe, canonical/social/structured metadata, discovery assets, security headers, Privacy, and administrator denial. The local gate passes lint, strict types, 68 unit tests, 47 credential-independent browser tests with 2 live administrator checks explicitly skipped, the separate enabled-inquiry branch, lockfile simulation, and production build. The production dependency audit remains clean. A July 27 re-audit found one newly published denial-of-service advisory propagated through nine development-only ESLint package entries; the compatible modern branch is patched, while the legacy branch has no compatible upstream fix yet. The reviewed disposition is documented in [`docs/qa/dependency-audit-2026-07-27.md`](docs/qa/dependency-audit-2026-07-27.md). The owner subsequently approved the Airbnb listing, Facebook page, Messenger conversation, WhatsApp contact, verified Google Maps/Waze property pin, and two source-package caretaker telephone contacts for public use. These destinations are validated through Vercel environment configuration; telephone and messaging values remain absent from Git history. Maps remain unloaded until a visitor selects a provider. Scans continue to find zero privileged browser markers, active unapproved external links, or analytics cookies. Analytics is an explicit no-op and Contact submission is unavailable because both production feature flags are false and no Supabase credential was configured. Database-backed role, insertion, dashboard, inquiry, export, retention, and deletion checks remain blocked rather than passed.

## Technology stack

- Next.js App Router 16.2.12 and React 19.2.8
- TypeScript 6.0.3 in strict mode
- Tailwind CSS 4.3.3 with project-owned semantic design tokens
- Supabase PostgreSQL, Authentication, and Row Level Security
- Zod for server-side validation
- Recharts for the protected analytics dashboard
- Lucide React 1.27.0 for supporting interface icons
- Playwright 1.62.0, Axe Playwright 4.12.1, and Vitest 4.1.10
- ESLint 9.39.5, TypeScript checks, and production-build validation
- Vercel for application hosting

Lucide React, Axe Playwright, typed Supabase browser/server clients, the local Supabase CLI, Zod, Recharts 3.10.1, and matching React Is 19.2.8 are installed for their implemented phases. Exact installed versions are locked in `package-lock.json`. PostCSS, Sharp, and the compatible 5.x `brace-expansion` branch use documented security overrides until their parent packages update their transitive dependencies; see `DECISIONS.md`.

## Planned features

- Responsive, photo-focused public property website with no guest sign-in
- Accommodation, amenities, gallery, reviews, location, guest guide, contact, and privacy pages
- Original editable VV monogram and related logo assets
- Configurable external booking and contact destinations
- Accessible gallery lightbox and mobile navigation
- Optional, validated contact inquiry form
- Anonymous page-view and approved external-link click tracking
- Protected administrator login, dashboard, date filters, charts, tables, and CSV exports
- Page metadata, structured data, sitemap, robots rules, and social-sharing assets
- Documented security, privacy, accessibility, testing, and deployment practices

## Local installation

Prerequisites: Node.js 20.9 or later and npm. The audited environment uses Node.js `v22.18.0` and npm `10.9.3`.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000` for the homepage. The implemented public routes are `/accommodation`, `/amenities`, `/gallery`, `/reviews`, `/location`, `/guest-guide`, `/contact`, and `/privacy`. Provide only approved values in `.env.local`; blank destinations intentionally remain unconfigured. Local or invalid canonical configuration is automatically non-indexable. Database migrations are present, but Supabase-backed features remain inactive without complete configuration.

Do not add secrets or approved public contact values to committed files; configure them through ignored local or Vercel environment values.

## Future owner updates

Missing photos, public destinations, and business facts have deliberate extension points rather than guessed values. See [`OWNER_UPDATE_GUIDE.md`](OWNER_UPDATE_GUIDE.md) for the reserved Blue Kubo, Green Kubo, parking, and high-resolution hero photo workflow; future email and telephone configuration; WhatsApp/map replacement; and the required publication checks.

## Environment variables

The committed `.env.example` documents the current environment contract:

| Variable | Exposure | Requirement | Example format | Used by / warning |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Required for production | `https://example.com` | Canonical URLs, metadata, sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Required for Supabase features | `https://project.supabase.co` | Supabase endpoint; not a secret |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Required for Supabase features | Supabase anon key | Safe only with correct RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Required only for privileged server operations | Supabase service-role key | Never expose or prefix with `NEXT_PUBLIC_` |
| `SUPABASE_TEST_ADMIN_EMAIL` | Test process only | Optional; required for live approved-admin QA | Dedicated non-production account | Store only in ignored local/CI secrets |
| `SUPABASE_TEST_ADMIN_PASSWORD` | Test process only | Optional; required for live approved-admin QA | Dedicated test password | Never commit or expose to browser code |
| `SUPABASE_TEST_NON_ADMIN_EMAIL` | Test process only | Optional; required for live denial QA | Dedicated unapproved account | Must have no `admin_profiles` row |
| `SUPABASE_TEST_NON_ADMIN_PASSWORD` | Test process only | Optional; required for live denial QA | Dedicated test password | Never commit or expose to browser code |
| `NEXT_PUBLIC_AIRBNB_URL` | Public | Configured in production | Canonical HTTPS listing URL | Owner-approved; omit transient tracking parameters |
| `NEXT_PUBLIC_FACEBOOK_URL` | Public | Configured in production | Full HTTPS page URL | Owner-approved |
| `NEXT_PUBLIC_MESSENGER_URL` | Public | Configured in production | Full HTTPS Messenger URL | Owner-approved |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Public | Configured in production | Verified coordinate-based Maps URL | Must resolve to the approved property pin |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Public | Configured in production | Verified Maps embed URL | Loaded only after visitor choice |
| `NEXT_PUBLIC_WAZE_URL` | Public | Configured in production | Verified Waze deep link | Must resolve to the same approved pin |
| `NEXT_PUBLIC_WAZE_EMBED_URL` | Public | Configured in production | Waze Live Map iframe URL | Loaded only after visitor choice |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | Configured in production | Approved international country-code digits | Keep the value out of Git history |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Optional until confirmed | `name@example.com` | Becomes visible to visitors |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public | Optional until confirmed | International telephone number | Must not use caretaker numbers by default |
| `NEXT_PUBLIC_CARETAKER_NIDA_PHONE` | Public | Optional; explicitly approved | International telephone number | Named caretaker contact; keep the value out of Git history |
| `NEXT_PUBLIC_CARETAKER_EVELYN_PHONE` | Public | Optional; explicitly approved | International telephone number | Named caretaker contact; keep the value out of Git history |
| `ANALYTICS_ENABLED` | Server/build configuration | Optional; disabled unless exactly `true` | `true` | Rebuild after changing; collection/storage failures never disrupt public use |
| `CONTACT_INQUIRY_ENABLED` | Server runtime configuration | Optional; disabled unless exactly `true` | `true` | Requires applied schema, server-only service key, owner approval, and retention process; Contact remains usable when false |

## Development and testing commands

- `npm run dev` — local development
- `npm run lint` — static linting
- `npm run typecheck` — strict TypeScript validation
- `npm run test` — focused unit tests
- `npm run test:e2e` — Playwright browser tests
- `npm run build` — production build validation
- `npm run db:start` / `db:stop` — start or stop the local Supabase stack (Docker required)
- `npm run db:reset` — reset only the local database, apply all migrations, and load synthetic seed data
- `npm run db:lint` — lint the running local database
- `npm run db:types` — print locally generated database types for review

Command results must be recorded in the relevant file under `docs/qa/`. A command that cannot run is marked blocked, never passed.

The read-only [GitHub Actions quality workflow](.github/workflows/quality.yml) repeats the locked install, production dependency audit, lint, strict type check, 68 unit tests, production build, and credential-independent Chromium suite on every push and pull request to `main`. It receives no Supabase, administrator, production, or private-contact secret; the two live administrator tests therefore remain explicitly skipped rather than passed.

[Dependabot](.github/dependabot.yml) checks npm and pinned GitHub Actions every Monday in the Asia/Manila timezone. Compatible patch/minor updates are grouped by production or development scope, while routine major upgrades remain manual. Security updates remain eligible regardless of SemVer level and must pass the complete quality workflow before merge.

## Database and administrator setup

The database layer supplies local Supabase configuration, seven versioned migrations, synthetic seed, typed schema/client factories, and detailed setup in `supabase/README.md`. Migration `007` adds the authenticated, `SECURITY INVOKER` dashboard functions and must be applied before `/admin/dashboard` can load data. Start Docker Desktop, run `npm run db:start`, then `npm run db:reset` and `npm run db:lint`. No administrator identity is seeded. Create an Auth user only through an approved administrative path, then provision its matching `admin_profiles` row through trusted SQL/service access as documented in `src/lib/auth/README.md` and `supabase/README.md`. Authentication alone never grants administration, signup remains disabled, and no password or project credential belongs in source.

## Deployment

Production is deployed through the `villa-vessela-airbnb` project in the `nikkineilcarino-2938s-projects` Vercel team. The canonical production origin is `https://villa-vessela-airbnb.vercel.app`; Node is pinned to the audited `22.x` line. The reproducible GitHub, Vercel, and Supabase procedure in `docs/DEPLOYMENT.md` covers environment separation, migration order, administrator provisioning, canonical setup, rollback, and post-deployment checks. Exact release evidence is in `docs/qa/phase-12-release.md`.

## Important folders

- `src/app/` — document shell, homepage, eight public routes, metadata/system routes, protected dashboard/inquiry/export routes, analytics/contact POST endpoints, global tokens, and route states
- `src/components/` — UI primitives, branding, public/admin layouts, authentication/analytics/SEO UI, accessible dashboard/inquiry UI, public presentation, gallery, reviews, location, and feature-flagged inquiry form
- `src/data/` — typed navigation, property, amenity, guide, rules, fee, FAQ, gallery, review, location, and attraction content
- `src/lib/` — shared utilities, typed Supabase boundaries, bounded validation/rate limits, administrator authorization, dashboard/inquiry/CSV helpers, canonical/SEO safeguards, public-destination configuration, and privacy-safe analytics logic
- `src/types/` — reviewed database mirror plus shared analytics, dashboard, inquiry, and export contracts
- `public/` — editable SVG brand assets, mechanically rasterized app icons, 37 approved local property/stay photographs, and clearly labelled placeholders for unresolved positions
- `supabase/` — ordered SQL migrations, local configuration, synthetic seed data, RLS/policy guidance, and blocked-live-test instructions
- `tests/` — Vitest utility/database/auth/analytics/dashboard/inquiry/CSV/SEO coverage and Playwright public, administrator, analytics, inquiry-mode, metadata, privacy, security-header, interaction, responsive, and accessibility checks
- `docs/qa/` — phase-specific, evidence-based QA reports
- `.github/` — read-only continuous-integration workflow and grouped weekly dependency maintenance policy
- `FINAL_HANDOFF.md` — current release evidence, safe defaults, future owner inputs, and backend activation boundary
- `OWNER_UPDATE_GUIDE.md` — owner-facing instructions for filling reserved photo, destination, contact, and business-information slots later

## Known limitations

- The Privacy page is implemented, but no production retention/deletion schedule, privacy-request channel, or deletion operation has been approved or live-tested. Inquiry submission, status management, and CSV exports remain default-disabled/not live-verified and require the applied schema, approved runtime configuration, administrator identities, and retention approval.
- Every item in the current primary navigation is available, and Privacy is available from the footer. The approved Airbnb listing, Facebook page, Messenger conversation, WhatsApp contact, Google Maps/Waze pin, and two caretaker telephone contacts can be active from validated environment configuration; owner-phone, email, and other external destinations remain disabled because no complete approved value has been supplied.
- Draft fee amounts are retained only for reconciliation and are not rendered. Every public fee prompt requires current host confirmation.
- Thirty-seven supplied, privacy-reviewed photographs now cover the villa, rooms, facilities, garden, nearby beach/attractions, food examples, and pet guidance. The social-share card uses the approved high-resolution photo-wall image. Blue Kubo, Green Kubo, and confirmed parking retain explicit placeholders; a higher-resolution front-of-villa hero is still recommended.
- The Airbnb, Facebook, Messenger, and caretaker telephone production destinations are supplied. Supabase credentials and administrator test credentials have not been supplied. Docker's installed engine is not running, so migrations/policies/functions, live analytics insertion, populated dashboard rendering, and approved/unapproved authentication behavior have not been executed against a database.
- The Contact page defaults to the disabled form because the owner has not approved launch activation. Enabled-mode UI/API failure paths pass locally, but no inquiry has been persisted to a live database.
- Live database migration/RLS/dashboard/inquiry/export, authentication, and analytics insertion testing cannot occur until their required runtime/configuration is available. Public Vercel deployment testing has passed.
- Analytics and inquiry rate limiting is bounded per-process and deliberately retains no raw IP. A distributed/serverless limiter or approved WAF rule remains required before launch-scale traffic.
- Search indexing is enabled only on the configured Vercel HTTPS canonical origin and fails closed elsewhere. Google `VacationRental` rich-result markup is intentionally omitted until a stable property identifier, required official photo coverage, and eligibility are available.
- The Content Security Policy permits same-origin inline scripts/styles required by the current Next.js rendering, JSON-LD, responsive image, and chart implementation; production excludes `unsafe-eval`, permits no third-party script origin, and allows frames only from the exact Google Maps and Waze embed origins.
- The supplied package contains conflicting or unconfirmed business facts. They are tracked in `CONTENT_TODO.md` and will not be silently resolved.

## Content awaiting confirmation

The remaining publishing blockers include the exact official Google Maps business name/listing, public owner contact details, Blue/Green Kubo and confirmed parking photos, a higher-resolution front-of-villa hero, rates and extra fees, exact expanded capacity, kubo and beach-cottage inclusion, the lost-key fee, bathroom layout, washer availability, inquiry-form status, and language choice. See `CONTENT_TODO.md` for the authoritative list.

## Privacy baseline

Caretaker phone values from the private planning package are not repeated in Git history. After explicit owner approval, two named telephone contacts are supplied only through validated public environment variables and must be treated as intentionally public. Public analytics uses random first-party anonymous identifiers and aggregate wording. It does not store raw IP addresses, exact GPS, fingerprints, full referrer paths, or claim to identify who clicked an external link. Inquiry details are voluntary, purpose-limited, default-disabled, and never treated as booking confirmation. The public `/privacy` route documents the implemented behavior and clearly identifies retention, deletion, request-channel, provider, consent, and live-database work that remains before production readiness.
