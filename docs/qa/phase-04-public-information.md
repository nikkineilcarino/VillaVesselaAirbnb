# Phase 4 QA — Public Information Pages

**Date:** 2026-07-23  
**Status:** QA passed  
**Environment:** Windows PowerShell; Node.js v22.18.0; npm 10.9.3; Next.js 16.2.11; Playwright Chromium  
**Scope:** `/accommodation`, `/amenities`, and `/guest-guide`, including the anchored house-rules, fee, attractions, and FAQ sections. Phase 5 gallery/review/location/contact features are excluded.

## Expected outcome

- All three routes open publicly without authentication and inherit the verified public shell.
- Accommodation presents standard facts separately from conditional capacity, reported facilities, and unconfirmed inclusions.
- Amenities groups supplied information and uses an explicit confirmation state for water, washer, frying-kubo, services, and other changeable arrangements.
- Guest Guide covers preparation, self-catering, shopping, water/connectivity, rules, fees, nearby attractions, and FAQs without publishing unresolved amounts or promises.
- Navigation activates only implemented routes; incomplete external destinations remain non-links.
- Pages have accurate titles/descriptions, breadcrumbs, one level-one heading, keyboard-accessible navigation, responsive layouts, and no automatic Axe violations.

## Source and content audit

The public copy was checked against the relevant sections of the supplied 42-page project package and `CONTENT_TODO.md`.

| Topic | Verified public treatment |
| --- | --- |
| Standard capacity | 10 guests, 2 bedrooms, 5 beds, and 1 main bathroom remain the primary supplied arrangement. |
| Expanded capacity | Up to 13 is conditional on prior host approval and additional charges. |
| External facilities | Additional toilets/shower are described as reported and awaiting final arrangement confirmation. |
| Kubos | Blue/Green inclusion is unconfirmed; frying-kubo access/current use is confirmation-required. |
| Beach cottage | Presented only as potentially available for an additional, unconfirmed charge. |
| Water/washer | Both retain confirmation notes; the guide warns against expecting consistently strong water pressure. |
| Connectivity | Explicitly mobile-network/personal-hotspot based; no fixed Wi-Fi, provider, signal, speed, or uninterrupted-service guarantee. |
| Optional services | Cooking, shopping, babysitting, serving, and cleaning are availability- and fee-dependent. |
| Fees | All requested keys are centralized. No PHP amount appears in rendered Phase 4 content; every item says to confirm with the host. |
| Rules | Smoking, bonfires, 10:00 PM videoke cutoff, pets, child supervision, garden care, water conservation, and checkout returns are included. |
| Attractions | Ten supplied destinations/activities/foods use weather, tide, provider, schedule, safety, and current-price qualifications. |
| Booking/contact | No external, telephone, or email destination is active or invented. |
| Privacy | No private operational contact is displayed or copied into source/build output. |

## Commands and actual results

| Check | Command or probe | Actual result | Status |
| --- | --- | --- | --- |
| Lint | `npm run lint` | Exit 0. | Pass |
| Strict types | `npm run typecheck` | Exit 0 after the optional-field guard fix. | Pass |
| Unit tests | `npm run test` | 1 file, 2 tests passed. | Pass |
| Browser suite | `npm run test:e2e` | 22 Chromium tests passed using one deterministic worker. | Pass |
| Route access/metadata | `public-information.spec.ts` | Three 200 responses, correct H1s, title templates, breadcrumbs, and active primary links. | Pass |
| Responsive behavior | Playwright plus manual review | All three pages had no 390px horizontal overflow; 390×844 and 1440×1000 screenshots reviewed. | Pass |
| Accessibility | Axe in `public-information.spec.ts` and public-shell suite | Accommodation, Amenities, Guest Guide, and homepage shell returned zero violations after final render. | Pass |
| Production build | `npm run build` | Six static pages generated; `/`, `/accommodation`, `/amenities`, `/guest-guide`, and not-found listed as static routes. | Pass |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities. | Pass |
| Destination scan | HTTP(S) literal probe over `src/` | No active URL literal found. | Pass |
| SVG regression | XML parse plus active-content/reference probe | All 12 SVGs parsed; no script, `onload`, or remote HTTP(S) reference. | Pass |
| Encoding | Mojibake-pattern scan | No anomaly found. | Pass |
| Privacy | In-memory PDF comparison against source and `.next` output | Passed against 2 redacted source contact patterns; values were not printed or stored. | Pass |

## Browser coverage

The final 22-test suite covers the existing foundation/homepage/shell behavior plus:

- public access to all three Phase 4 routes;
- exact active-navigation states and updated mobile focus trapping;
- route titles, breadcrumbs, and level-one headings;
- standard and conditional accommodation facts;
- unconfirmed kubo, cottage, bathroom, water, washer, connectivity, service, and fee treatment;
- absence of rendered PHP amounts and active unverified external links;
- house rules, ten attractions, twenty native FAQ disclosures, and section-anchor navigation;
- 390px overflow checks and a completed-page Axe scan for each route.

## Manual visual and keyboard review

- Inspected `phase-04-accommodation-desktop.png` and `phase-04-accommodation-mobile.png`.
- Inspected `phase-04-amenities-desktop.png` and `phase-04-amenities-mobile.png`.
- Inspected `phase-04-guest-guide-desktop.png` and `phase-04-guest-guide-mobile.png`.
- Verified hero/breadcrumb hierarchy, active header state, section wrapping, certainty badges, long-copy readability, anchor strip behavior, native FAQ summaries, card alignment, footer layout, and visible disabled/upcoming states.
- Confirmed no observed clipping, overlap, unexpected horizontal scroll, or misleading image/inclusion treatment.

The ignored full-page screenshot run caused Next.js development tooling to suggest eager loading for the accommodation illustration after the capture scrolled it into view. The asset is below the initial hero and overview, so it remains intentionally lazy-loaded. This is not a production-build warning.

## Errors discovered, fixes, and retests

1. **Optional detail typing:** strict TypeScript rejected direct `item.detail` access because supplied-only literal items omit that property. Added an `in` guard. Typecheck passed on rerun.
2. **Duplicated rule locator:** a videoke assertion matched the rule and FAQ answer. Made the rule locator exact.
3. **Changed mobile focus endpoint:** the old shell test expected About to be the final active menu link. Updated it to Guest Guide and verified close-after-route-navigation.
4. **Duplicated water guidance:** scoped the water assertion to the opened native FAQ disclosure.
5. **Transient Axe timing:** the first long-guide scan reached the route loading state before its H1 rendered. The audit now waits for the route's expected H1 and then scans the completed page; all three routes pass.
6. **Smooth-scroll framework notice:** added `data-scroll-behavior="smooth"` to the root HTML element as required by Next.js for intentional global smooth scrolling.
7. **Metadata title duplication risk:** changed leaf titles to `Accommodation`, `Amenities`, and `Guest Guide` so the root template produces one `| Villa Vessela` suffix. Browser assertions pass.

The Playwright process still prints the harmless environment warning that `FORCE_COLOR` overrides `NO_COLOR`; it does not affect application output or test results.

## Remaining limitations

- All draft fee amounts and the lost-key conflict require owner confirmation before public display.
- Final expanded-capacity terms, pet conditions, optional-service availability/fees, water provision, washer access, bathroom layout, kubo inclusion/access, and beach-cottage terms remain open in `CONTENT_TODO.md`.
- Official photography and all unverified external booking/contact/map destinations remain pending.
- Gallery, reviews, location, and contact route implementation begins only in Phase 5.
- The workspace is not a Git repository; database, authentication, analytics, inquiry, SEO-hardening, and deployment work remain in later phases.

No unresolved defect blocks Phase 4 completion.
