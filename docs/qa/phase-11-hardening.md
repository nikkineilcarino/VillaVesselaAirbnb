# Phase 11 QA — SEO, accessibility, performance, security, and privacy

> **Historical snapshot.** Explicit analytics choice, active privacy wording, analytics-only daily 365-day retention, linked database/RLS proof, and production delivery/reporting checks later passed on 2026-08-10; see [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). Inquiry operations remain separately disabled.

**Date:** 2026-07-23  
**Status:** Completed, not fully QA passed

## Scope delivered

Phase 11 gives each of the nine public pages a unique title, description, canonical URL, Open Graph and Twitter metadata, one primary heading, and matching breadcrumb structured data. The homepage also publishes conservative `LodgingBusiness` JSON-LD using only the supplied name, address, capacity, rating/review count, and verified amenity facts. It deliberately omits placeholder images, unapproved contact/map destinations, exact coordinates, prices, conditional capacity, a guessed property identifier, and unsupported claims.

The application now provides a sitemap, fail-closed robots policy, web manifest, favicon, 180 px touch icon, 192/512 px web-app icons, and a 1200 × 630 social image visibly labelled as provisional. Missing, local, invalid, reserved, or non-HTTPS canonical configuration remains non-indexable by design; Phase 12 must supply and inspect the final public HTTPS origin.

The new public Privacy page truthfully describes conditional first-party analytics, optional/default-disabled inquiries, browser identifiers and lifetimes, administrator access, provider/external-site boundaries, and unresolved retention/deletion/request-channel controls. It makes no legal-compliance promise. The footer exposes the page without crowding the primary navigation.

Accessibility hardening adds two-color focus treatment, forced-colors fallback, focus clearance for the sticky header, robust text wrapping, responsive reflow, system reduced-motion behavior, semantic landmark/heading coverage, accessible form and dialog behavior, chart table equivalents, and text/icon state labels that do not depend on color alone.

Security and performance hardening adds a restrictive same-origin Content Security Policy, clickjacking/MIME/referrer/permissions/cross-origin headers, production HSTS, no-store administrator behavior, bounded static logo/image caching, system fonts with no remote font request, intrinsic responsive images, route-scoped client components, bounded queries/pagination, and no protected dashboard/Recharts payload marker in inspected public/login route scripts.

## Automated results

| Check | Actual result | Status |
| --- | --- | --- |
| Lint | `npm run lint`; zero errors and zero warnings | Pass |
| Strict types | `npm run typecheck` | Pass |
| Unit tests | 9 files, 67 tests | Pass |
| Default Chromium suite | 47 passed; 2 live administrator tests explicitly skipped | Pass with documented skips |
| Enabled inquiry Chromium suite | 3 passed | Pass |
| Focused Phase 11 Chromium suite | 4 passed | Pass |
| Production build | Next.js 16.2.11 build; public/static metadata routes generated and private/API routes retained their intended dynamic boundaries | Pass |
| Dependency audit | `npm audit`; 0 vulnerabilities | Pass |
| Lockfile install simulation | `npm ci --dry-run --ignore-scripts` | Pass |
| Page metadata | All 9 public pages expose unique title/description, canonical, Open Graph, Twitter, one `h1`, and parseable JSON-LD | Pass |
| Discovery/install routes | Robots, sitemap, manifest, social PNG, favicon, touch icon, and 192/512 app icons return successfully with expected content/dimensions | Pass |
| Accessibility automation | Privacy/mobile reflow, keyboard focus, reduced motion, and Axe checks pass; existing dialog/form/chart semantic coverage regresses successfully | Pass |
| Production headers | CSP excludes `unsafe-eval`; HSTS, frame denial, MIME protection, referrer, permissions, cross-origin, and origin-agent headers present | Pass |
| Static caching | Local logo/image responses expose one-day freshness and one-week stale revalidation | Pass |
| Client payload inspection | Homepage: 12 scripts / 583,438 response bytes; Gallery: 13 / 590,250; Privacy: 12 / 583,438; login: 14 / 576,202; zero dashboard/Recharts marker files on all four routes | Pass |
| UTF-8 scan | 243 repository text files; 0 invalid UTF-8 and 0 replacement/mojibake-marker files | Pass |
| Private-contact comparison | 2 private mobile patterns detected in the supplied PDF; 0 repository and 0 built-output matches | Pass |
| Populated-secret scan | 0 populated secret assignments in tracked/source text | Pass |
| Browser privilege scan | 0 service-role/key marker files in `.next/static` | Pass |
| Administrator privilege scan | 0 administrator/dashboard/inquiry/export consumers of the service-role client | Pass |
| Raw-IP/sensitive-log scan | 0 raw-IP runtime consumers and 0 logs containing payload/contact/identifier/token/database-error values | Pass |

Script-byte figures are the sum of raw JavaScript response bodies referenced by each rendered document, not compressed transfer sizes. They are recorded as a regression baseline rather than a performance-budget guarantee.

## Browser and visual review

- Desktop and 390 px Privacy views render without horizontal overflow and maintain readable hierarchy.
- Keyboard focus remains visible and is not hidden beneath the sticky header.
- The social image is legible at 1200 × 630 and visibly identifies its illustrated-placeholder status.
- The mechanically rasterized 512 px application icon was visually inspected against the editable VV SVG mark.
- System metadata, social-image, and icon routes return the intended types and dimensions.
- Local `robots.txt` disallows crawling, which is the expected fail-closed behavior without a configured public HTTPS origin.

## Structured-data boundaries

`LodgingBusiness` and `BreadcrumbList` are used because their published facts can be supported now. Google `VacationRental` rich-result markup is intentionally deferred: the project does not yet have the required stable identifier, precise geographic data, sufficient official property/room photography, final public URL, or verified eligibility. Placeholder illustration paths and unresolved business details are not emitted merely to fill fields.

## Blocked live and release checks

These checks remain blocked or scheduled rather than passed:

1. Configure the final public HTTPS origin and re-check production canonical, Open Graph, robots allow rules, sitemap URLs, redirect behavior, and search-console validation.
2. Apply and lint all Supabase migrations and execute anonymous, unapproved, approved, and service-role probes against an approved non-production project.
3. Verify live analytics/inquiry inserts, administrator login/dashboard/inquiry/export behavior, deletion operations, outage recovery, and real cookie/header behavior.
4. Approve and implement retention/deletion schedules, a privacy-request channel, processor/provider review, and any jurisdiction-specific consent control required by the owner’s legal review.
5. Supply official photography, approved public booking/contact/map destinations, final business facts, and any eligible richer property markup.
6. Initialize/publish the GitHub repository, configure Vercel/Supabase secrets, deploy, and run the Phase 12 production smoke/accessibility/security/privacy checks.

Docker Desktop is installed but its Linux engine is unavailable, and no approved Supabase project or dedicated administrator/non-administrator test identities were supplied. The two credential-dependent Playwright checks therefore remain explicitly skipped.

## Release safeguards

- Keep `CONTACT_INQUIRY_ENABLED=false` until storage, authorization, consent copy, retention/deletion, and operational ownership are approved and live-tested.
- Keep `ANALYTICS_ENABLED=false` until the database policy, provider, retention, privacy notice, and production behavior are approved and verified.
- Do not configure public destinations or structured-data facts until the owner supplies exact approved values.
- Do not permit public indexing until `NEXT_PUBLIC_SITE_URL` is the final HTTPS origin and its output is inspected after deployment.
- Never copy the private caretaker contacts from the planning package into source, configuration, analytics, metadata, or public content.

## Primary references reviewed

- Next.js metadata and social images: <https://nextjs.org/docs/app/getting-started/metadata-and-og-images>
- Next.js JSON-LD guidance: <https://nextjs.org/docs/app/guides/json-ld>
- Google structured-data introduction: <https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data>
- Google vacation-rental structured data: <https://developers.google.com/search/docs/appearance/structured-data/vacation-rental>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- WCAG 2.2 techniques: <https://www.w3.org/WAI/WCAG22/Techniques/>
- OWASP Secure Headers Project: <https://owasp.org/www-project-secure-headers/>
