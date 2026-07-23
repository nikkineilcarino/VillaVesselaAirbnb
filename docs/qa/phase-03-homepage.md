# Phase 3 QA — Complete Homepage

**Date:** 2026-07-23  
**Status:** QA passed  
**Scope:** public homepage only; standalone information pages, full gallery/lightbox, live map, contact, database, analytics, and administrator features remain later phases.

## Delivered outcome

The temporary Phase 2 root content was replaced by a responsive public homepage containing the hero, trust indicators, property highlights, About, accommodation, amenities, gallery, reviews, location, nearby-attraction previews, and closing booking call to action. The route is composed from focused Server Components and typed local data.

Six local SVG illustrations reserve the photo/map positions. Every illustration is identified as provisional in its artwork, alternative text, caption, or adjacent disclosure. No illustration is presented as an actual Villa Vessela photograph or navigational map.

## Source and content audit

The rendered content was compared with the supplied 42-page project package and the existing `CONTENT_TODO.md` safeguards.

| Topic | Verified homepage treatment |
| --- | --- |
| Identity/location | Uses the supplied Villa Vessela name and Tondol, Purok 2, Anda, Pangasinan address. |
| Capacity | Shows 10 guests as standard; up to 13 is expressly conditional on host approval and additional charges. |
| Layout | Shows 2 bedrooms and 5 beds; the confirmed main bathroom is separated from reported external facilities awaiting confirmation. |
| Connectivity | Describes mobile-network/personal-hotspot use and does not advertise conventional fixed Wi-Fi or guaranteed speed. |
| Frying kubo | States that supplied material mentions it while guest-use details remain unconfirmed. |
| Gallery/map | Uses disclosed local illustrations; the map is expressly non-navigational and its action is disabled. |
| Reviews | Uses the supplied Airbnb summary/excerpts, labels their source, and states that Airbnb does not endorse the independent site. |
| Attractions | Avoids tour prices and qualifies access by weather, tide, schedules, conditions, and local-provider confirmation. |
| Booking/contact | Contains no active external, telephone, or email destination; unverified actions remain disabled. |
| Private operations | Caretaker contacts are absent; a redacted source-to-repository comparison passed. |

## Automated evidence

| Check | Command or probe | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Passed, exit 0. |
| Strict types | `npm run typecheck` | Passed, exit 0. |
| Unit tests | `npm run test` | Passed: 1 file, 2 tests. |
| Browser suite | `npm run test:e2e` | Passed: 14 Chromium tests using one deterministic worker. |
| Accessibility | Axe within `public-layout.spec.ts` | Passed with zero automatically detectable violations on the complete homepage. |
| Production build | `npm run build` | Passed; `/` and `/_not-found` statically generated. |
| Dependency audit | `npm audit --audit-level=moderate` | Passed: 0 vulnerabilities. |
| SVG XML | PowerShell XML parse over both SVG directories | Passed: all 12 brand/placeholder SVGs parsed. |
| SVG safety | Ripgrep active-content/remote-reference probe | Passed: no script, `onload`, or remote HTTP(S) reference found. |
| Destination safety | HTTP(S) literal scan of `src/` | Passed: no active URL literal found. |
| Encoding | Mojibake-pattern scan over source, public files, tests, and documentation | Passed. |
| Privacy | In-memory PDF/repository phone-pattern comparison | Passed against 2 redacted source contact patterns; values were not printed or stored. |

The browser coverage verifies unauthenticated access, mobile overflow, skip-link behavior, 404 recovery, every required homepage section, important facts/qualifiers, disabled unverified actions, local placeholder availability, working About/location anchors, shell availability states, the mobile focus/scroll lifecycle, brand assets, favicon, and Axe.

## Manual responsive and visual review

- Captured and inspected the complete homepage at 1440×1000 and 390×844 viewport sizes.
- Inspected the corrected gallery at desktop section scale after the lead/supporting tile arrangement changed.
- Verified hierarchy, wrapping, spacing, responsive cards, image crops, placeholder labels, sticky-header behavior, footer layout, and absence of visible horizontal overflow.
- Confirmed that disabled actions look unavailable and that the available About/location anchors remain distinguishable and usable.
- Screenshots were generated in ignored `test-results/` artifacts: `phase-03-homepage-desktop.png`, `phase-03-homepage-mobile.png`, and `phase-03-gallery-section.png`.

During an exploratory screenshot run, using `127.0.0.1` against a development server configured for `localhost` produced Next.js's development-only HMR origin warning. The final automated suite uses `localhost`; the optimized production build is unaffected.

## Issues found and corrected

1. **Muted label contrast:** the first Axe run found several small light-background labels below WCAG AA contrast. Their text opacity was raised.
2. **Dark-section eyebrow contrast:** the next Axe run isolated gold text on deep blue at 3.62:1. The inverted section eyebrow now uses a high-contrast light color.
3. **Ambiguous test locator:** “View location” also matched “Review location.” The browser locator now requests an exact accessible name.
4. **Desktop gallery imbalance:** visual review found the fourth item wrapping beneath the lead tile. The lead now spans two rows and the final tile spans the supporting columns.
5. **Frying-kubo certainty:** the content audit found wording that could imply confirmed guest access. Both references now preserve its unconfirmed status.
6. **Development router race:** six simultaneous fresh-page hydrations caused a Next.js/Turbopack router-initialization log despite passing assertions. The same suite was clean serially, so Playwright now uses one documented deterministic worker; the final rerun passed without the router error.

The Playwright process still prints a harmless environment warning because `FORCE_COLOR` takes precedence over `NO_COLOR`; it does not affect application behavior or test results.

## Remaining limitations

- Official photographs and an approved social image have not been supplied. All current imagery is provisional.
- The Airbnb, Facebook, Messenger, Google Maps, email, telephone, and WhatsApp destinations remain unconfirmed and inactive.
- Final logo colors and the business/content decisions in `CONTENT_TODO.md` still require owner input.
- Navigation to standalone public routes remains visibly disabled until Phases 4 and 5 deliver and test those routes.
- The workspace is not a Git repository.
- No database, authentication, analytics, inquiry, or deployment QA is applicable to Phase 3.

No unresolved defect blocks completion of the Phase 3 homepage.
