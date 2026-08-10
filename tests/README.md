# Tests

## Purpose

This directory contains evidence-producing automated checks for pure utilities and browser-visible behavior. Passing tests support—but do not replace—manual accessibility, privacy, security, and content review.

## Current files and responsibilities

- `unit/utils.test.ts` verifies conditional class composition and Tailwind conflict resolution.
- `unit/database-schema.test.ts` verifies ordered/documented migrations, required tables/constraints/indexes, deny-by-default RLS/policy structure, RLS-aware Asia/Manila views, distinct Waze reporting, owner-only analytics retention, and synthetic repeatable seed safeguards.
- `unit/auth.test.ts` verifies login bounds, configuration fail-closed behavior, separate request/server authorization gates, cache/cookie controls, and absence of signup/credential fallbacks.
- `unit/analytics.test.ts` verifies explicit preference parsing, consent-gated identity and dispatch behavior, identifier cleanup, path/referrer/category minimization, inactivity rotation, destination normalization (including provider-specific Waze matching), strict schemas, exact allowlisting, body bounds, bounded rate limiting, delivery fallback, and no raw-IP/payload logging.
- `unit/location-analytics.test.tsx` verifies the Waze navigation action renders through the exact `waze` tracking category and that tracked anchors preserve native navigation when delivery fails.
- `unit/dashboard.test.ts` verifies Asia/Manila date boundaries, presets/custom validation, missing-day filling, exact CTR, aggregate normalization, privacy-safe labels, bounded queries, and absence of service-role dashboard reads.
- `unit/dashboard-components.test.tsx` statically renders chart/table/card populated and empty states, including all five accessible data-table equivalents.
- `unit/inquiries.test.ts` verifies sanitization, contact/date/guest/consent/payment/timing/honeypot rules, endpoint status/storage/rate behavior, admin filters, status-only updates, and service-role separation.
- `unit/csv.test.ts` verifies quoting, embedded delimiters/newlines, formula defense, UTF-8 BOM/CRLF output, row ceilings, protected authorization markers, and technical-field exclusions.
- `unit/seo.test.ts` verifies canonical-origin rejection/fallback/indexing, public route alignment, page/social metadata, verified-fact JSON-LD, script escaping, system routes, manifest, and header/caching configuration.
- `e2e/foundation.spec.ts` verifies unauthenticated root access, mobile overflow, keyboard skip-link behavior, and the accessible 404 response.
- `e2e/public-layout.spec.ts` verifies desktop shell states, the mobile dialog/focus/scroll lifecycle, SVG availability, favicon metadata, and an Axe accessibility scan.
- `e2e/homepage.spec.ts` verifies required homepage sections, important facts and qualifiers, configured/fail-closed destinations, local supplied photography, the opt-in map state, and working About/location anchors.
- `e2e/public-information.spec.ts` verifies Phase 4 public access/navigation, capacity and inclusion safeguards, amenity certainty states, rules, unpublished fees, attractions, native FAQs, section anchors, mobile overflow, inactive external destinations, and Axe results on all three routes.
- `e2e/discovery-contact.spec.ts` verifies public access/navigation, all 41 gallery photographs and three open slots, the six improved attraction assets, lightbox focus/keyboard/image-fit behavior, review provenance, Messenger placeholders, clipboard copying, opt-in Google Maps/Waze switching and zoom, exact consented Waze click dispatch when configured, unapproved contact destinations, the exact configured Nida caretaker telephone and public email links, the disabled no-action inquiry preview, mobile overflow, and Axe results on all four routes.
- `e2e/admin-auth.spec.ts` verifies public/noindex login, private development caching, fixed redirects, non-revealing notices, mobile fit, and Axe results without credentials.
- `e2e/admin-auth.live.spec.ts` verifies approved access/logout and unapproved denial only when dedicated non-production secret credentials are supplied; otherwise both checks are explicitly skipped/blocked.
- `e2e/analytics.spec.ts` verifies feature-disabled cleanup, no identifiers or requests before Allow, persistent allow/decline/settings behavior, cleanup and same-route re-allow, fail-closed blocked storage, browser UUID lifetimes, referrer minimization, route deduplication, admin exclusion, endpoint bounds/allowlisting, and browsing/navigation during delivery failure.
- `e2e/inquiry-workflow.spec.ts` verifies the default-disabled mode, separately runnable enabled form validation/success/failure/mobile/Axe states, real unavailable-storage response, and unauthenticated export denial.
- `e2e/seo-privacy-security.spec.ts` verifies all public canonical/social/JSON-LD output, sitemap/robots/manifest/social/icon routes, active-state analytics choice/minimization/retention/request wording on Privacy, responsive reflow/Axe, focus visibility, reduced motion, security headers, and asset caching.
- Root `vitest.config.ts` and `playwright.config.ts` define runners, paths, browser settings, and local web-server behavior.

## Interactions

Vitest imports browser-independent source through the `@/` alias. Playwright starts the Next.js development server unless `PLAYWRIGHT_BASE_URL` targets an existing environment.

## Adding functionality safely

Add tests with the phase that introduces a behavior. Prefer semantic role/name locators over fragile CSS selectors. Keep fixtures synthetic and clearly labelled. Include failure-path and access-denial cases, not only happy paths.

## Restrictions

- Never commit production credentials, real inquiry records, or visitor data.
- Never weaken a test merely to make a failure disappear.
- Never call a blocked credential-dependent check passed.
- Do not make tests depend on execution order or a developer's existing browser state.

## Environment variables

`PLAYWRIGHT_BASE_URL` is optional and selects a running target. `CONTACT_INQUIRY_ENABLED=true` enables the separate operational-form browser branch; it does not provide storage. `SUPABASE_TEST_ADMIN_EMAIL`, `SUPABASE_TEST_ADMIN_PASSWORD`, `SUPABASE_TEST_NON_ADMIN_EMAIL`, and `SUPABASE_TEST_NON_ADMIN_PASSWORD` enable live Phase 7/9/10 authorization, dashboard, inquiry, and export checks. Secrets must identify dedicated non-production accounts and remain in ignored local/CI storage.

Canonical, robots, sitemap, and clipboard assertions derive their origin from `PLAYWRIGHT_BASE_URL`, so the same release checks cover local HTTP and the configured production HTTPS alias without hard-coded localhost expectations. Production runs must target the stable alias, not a temporary deployment URL.

## Testing commands

- `npm run test` runs Vitest once.
- `npm run test:watch` runs Vitest interactively.
- `npm run test:e2e:install` installs Chromium for Playwright.
- `npm run test:e2e` runs the browser suite.
- `npm run db:start`, `db:reset`, and `db:lint` run live local database checks when Docker is available.

## Security and privacy

Synthetic fixtures must not resemble real private contacts unnecessarily. The database seed uses reserved `.invalid` destinations and creates no Auth identity or administrator. Authentication tests use purpose-created accounts; outputs and screenshots must not expose credentials or personal data.

## Files requiring careful review

Authentication fixtures, database reset helpers, Playwright global setup, and CI secret configuration can affect real data or access controls and must not be changed casually.
