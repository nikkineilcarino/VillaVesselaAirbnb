# Phase 5 QA — Discovery and Contact Pages

**Date:** 2026-07-23  
**Status:** QA passed  
**Environment:** Windows PowerShell; Node.js v22.18.0; npm 10.9.3; Next.js 16.2.11; Playwright Chromium  
**Scope:** `/gallery`, `/reviews`, `/location`, and `/contact`, including the gallery lightbox, review provenance, address copying, inactive external destinations, and disabled inquiry shell. Phase 6 database work is excluded.

## Expected outcome

- All four routes open publicly, inherit the verified shell, have route metadata/breadcrumbs, and are active in shared navigation.
- Gallery exposes all fourteen source-requested categories without pretending that provisional artwork depicts Villa Vessela.
- The lightbox is keyboard and screen-reader operable, contains its imagery, handles loading/failure, locks background scrolling, and restores focus.
- Reviews reproduce only the supplied Airbnb summary/category values/excerpts; Messenger positions remain visibly empty until approved material exists.
- Location copies only the confirmed text address and does not embed or activate an unverified map destination.
- Contact shows only null-configured, inactive channels. Its inquiry structure cannot submit, persist, or request payment-card data.
- All pages remain responsive, accessible, statically renderable, and free from private caretaker contacts or unverified external anchors.

## Files added

| File | Purpose |
| --- | --- |
| `src/app/(public)/gallery/page.tsx` | Public Gallery route and metadata. |
| `src/app/(public)/reviews/page.tsx` | Public Reviews route and metadata. |
| `src/app/(public)/location/page.tsx` | Public Location route, map-disabled state, and metadata. |
| `src/app/(public)/contact/page.tsx` | Public Contact route, inactive channels, safety copy, and inquiry preview. |
| `src/components/gallery/GalleryImage.tsx` | Responsive local image loading and safe failure UI. |
| `src/components/gallery/GalleryGrid.tsx` | Fourteen category triggers with first-candidate image priority. |
| `src/components/gallery/GalleryLightbox.tsx` | Accessible modal, focus/scroll lifecycle, and image navigation. |
| `src/components/gallery/GalleryExperience.tsx` | Active-image state and trigger focus restoration. |
| `src/components/gallery/README.md` | Gallery contracts, restrictions, configuration, and tests. |
| `src/components/reviews/RatingSummary.tsx` | Supplied overall rating and count. |
| `src/components/reviews/RatingBreakdown.tsx` | Six supplied category scores. |
| `src/components/reviews/ReviewCard.tsx` | One source-labelled supplied excerpt. |
| `src/components/reviews/MessengerReviewPlaceholders.tsx` | Three content-free future review positions. |
| `src/components/reviews/README.md` | Review provenance/privacy guidance. |
| `src/components/location/CopyAddressButton.tsx` | Clipboard action and announced status. |
| `src/components/location/README.md` | Location interaction/privacy guidance. |
| `src/components/forms/ContactInquiryForm.tsx` | Disabled, no-action inquiry structure. |
| `src/components/forms/README.md` | Form activation/security requirements. |
| `src/data/contact.ts` | Six nullable channel records and disabled inquiry configuration. |
| `public/images/placeholders/gallery-generic-placeholder.svg` | Explicit local placeholder reused for categories without subject-specific artwork. |
| `tests/e2e/discovery-contact.spec.ts` | Phase 5 route, behavior, safeguard, responsive, and Axe coverage. |
| `docs/qa/phase-05-discovery-contact.md` | This evidence report. |

## Files modified

- `src/data/site.ts` — added nullable email, telephone, and WhatsApp destinations.
- `src/data/gallery.ts` — preserved homepage previews and added fourteen typed gallery records.
- `src/data/reviews.ts` — exported the review type and added three content-free Messenger placeholders plus provenance copy.
- `src/data/navigation.ts` — activated Gallery, Reviews, Location, and Contact.
- `src/app/(public)/location/page.tsx` — prioritized the possible above-the-fold/LCP illustration after final diagnostics.
- `src/components/gallery/GalleryGrid.tsx` — prioritized only the first possible LCP tile; later tiles remain lazy.
- `tests/e2e/public-layout.spec.ts` — updated disabled-link counts and final mobile focus/navigation target.
- `README.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `QA_CHECKLIST.md`, `CONTENT_TODO.md`, `CHANGELOG.md`, and `DECISIONS.md` — recorded Phase 5 implementation, evidence, safeguards, decisions, and pending facts.
- `src/app/README.md`, `src/components/README.md`, `src/data/README.md`, `tests/README.md`, and `public/images/README.md` — updated directory ownership and safe-extension guidance.

## Source and safeguard audit

| Topic | Verified public treatment |
| --- | --- |
| Gallery | Fourteen requested categories are present. Every item says official photography is pending, and artwork is local/provisional. |
| Overall reviews | 4.76/5 and 21 reviews are labelled as supplied Airbnb listing information, not live-synced data. |
| Category scores | Cleanliness 4.8, Accuracy 4.6, Check-in 5.0, Communication 5.0, Location 4.7, and Value 4.7 are presented as source values. |
| Excerpts | Only the three supplied Airbnb excerpts and their supplied first-name/date attribution are shown. |
| Messenger | Three cards contain no quote, reviewer identity, rating, or screenshot. |
| Address/directions | The confirmed text address and supplied approach directions are shown; the map remains an illustration only. |
| External destinations | Airbnb, Google Maps, Facebook, Messenger, WhatsApp, telephone, and email values are null/non-links. |
| Inquiry | Disabled fieldset, no form action, no fetch/API route, no persistence, and no payment-card fields. |
| Privacy | No private operational contact is displayed or copied into source, documentation, or built output. |

## Commands and actual results

| Check | Command or probe | Actual result | Status |
| --- | --- | --- | --- |
| Lint | `npm run lint` | Exit 0. | Pass |
| Strict types | `npm run typecheck` | Exit 0. | Pass |
| Unit tests | `npm run test` | 1 file, 2 tests passed. | Pass |
| Browser suite | `npm run test:e2e` | Final rerun: 31 Chromium tests passed using one deterministic worker. | Pass |
| Accessibility | Axe in Phase 4/5 and public-shell suites | Eight completed public-route scans returned zero violations. | Pass |
| Responsive behavior | Playwright plus manual review | Phase 5 routes had no 390px horizontal overflow; full desktop/mobile captures and open lightbox were reviewed. | Pass |
| Production build | `npm run build` | 10 static pages generated; all eight implemented public destinations plus not-found are listed as static routes. | Pass |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities. | Pass |
| Destination/form scan | Literal and operational-pattern probe over Phase 5 source | No HTTP(S), telephone, email destination, form action/API call, or payment-card field pattern. | Pass |
| SVG regression | XML parse plus active-content/reference probe | All 13 SVGs parsed; no script, event handler, or remote executable reference. | Pass |
| Encoding | Numeric-code-point mojibake scan | No anomaly across 96 text/source files. | Pass |
| Privacy | In-memory PDF comparison against repository and `.next` output | 2 redacted source contact patterns absent from 1,084 scanned files; values were not printed or stored. | Pass |

## Browser coverage

The nine Phase 5 tests extend the existing suite with:

- public 200 access, route titles, breadcrumbs, H1s, and exact active primary links for four routes;
- all fourteen gallery triggers, local generic placeholder availability, and a controlled image-request failure with visible fallback UI;
- lightbox open/close, initial focus, focus wrapping, Escape, left/right arrows, body-scroll cleanup, exact-trigger restoration, and contained image sizing;
- exact supplied review summary/provenance and three honest Messenger reservations;
- disabled Maps state, no iframe, clipboard permission/action/content, and announced result;
- six disabled contact-channel controls, a disabled fieldset and every child control, no form action, no payment field, and payment-safety copy;
- zero active unverified external anchors on every Phase 5 route;
- 390px overflow checks and a completed-page Axe scan on every Phase 5 route.

## Manual visual and keyboard review

- Inspected `phase-05-gallery-desktop.png` and `phase-05-gallery-mobile.png`.
- Inspected `phase-05-reviews-desktop.png` and `phase-05-reviews-mobile.png`.
- Inspected `phase-05-location-desktop.png` and `phase-05-location-mobile.png`.
- Inspected `phase-05-contact-desktop.png` and `phase-05-contact-mobile.png`.
- Inspected `phase-05-lightbox-desktop.png` and `phase-05-lightbox-mobile.png` after its contained-image correction.
- Verified hero/breadcrumb hierarchy, active navigation, card wrapping, exact rating/source messaging, disabled states, address/map differentiation, inquiry field readability, footer layout, focus visibility, dialog controls, and viewport containment.
- The mobile full-gallery capture showed expected visible loading labels for lazy images reached by the automated full-page capture; loaded and failure states remain covered by the component contract.
- The black Next.js development indicator in screenshots is tooling-only and is absent from the production build.

## Errors discovered, fixes, and retests

1. **Lint/type implementation findings:** removed an unused import, escaped an apostrophe, and replaced a nonexistent Lucide Facebook brand icon with the neutral `Share2` icon. Lint and types passed.
2. **Disabled-fieldset assertion:** the first browser assertion counted only explicit child `disabled` attributes even though HTML fieldset inheritance correctly disabled them. The final test checks the fieldset attribute and each control's browser-disabled state. 
3. **Shell Axe timing:** the first expanded suite could scan the homepage loading transition. The shell audit now waits for the homepage H1 before running Axe.
4. **Mobile lightbox crop:** visual review found that cover sizing could crop the placeholder disclosure. The dialog now uses contained sizing, screenshots were recaptured, and a browser class assertion prevents regression.
5. **Containment assertion wording:** the first final browser run passed 30 tests but its new image locator used wording that differed from canonical alt text. The assertion was aligned to `src/data/gallery.ts`; the full rerun passed 31/31.
6. **Possible LCP candidates:** development diagnostics identified the first gallery tile and location illustration. They now load with priority while below-fold gallery items remain lazy; the final browser suite and build passed.
7. **Encoding probe transport:** a first standalone scanner command was altered by Windows console encoding before Node parsed it. The probe was rewritten with numeric Unicode code points and passed; no application file caused the scanner error.

Playwright still prints the harmless warning that `FORCE_COLOR` overrides `NO_COLOR`; it does not affect application output or results.

## Remaining limitations

- All fourteen gallery positions remain provisional until approved official photography and accurate image-specific alt context are supplied.
- Messenger cards remain empty until two or three publication-approved excerpts or privacy-safe screenshots are supplied.
- The exact Airbnb, Facebook, Messenger, Google Maps, WhatsApp, telephone, and email destinations remain pending and inactive.
- The inquiry form is a disabled preview. Feature approval, validation, sanitization, anti-spam/rate limiting, RLS-backed storage, administration, and operational QA belong to Phase 10.
- The Privacy route remains unimplemented. Git, database, authentication, analytics, dashboard, SEO hardening, and deployment remain in later phases.

No unresolved defect blocks Phase 5 completion.
