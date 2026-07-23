# Content TODO

This is the authoritative register for missing, conflicting, or unconfirmed business information. Code and public copy must not silently choose an answer. Unknown destinations remain inactive; unknown inclusions/fees remain hidden or say “Please confirm with the host” where context requires a response.

## Identity, destinations, and public contact

Phase 5 interim state: all six planned contact channels and both map destinations are typed as `null` and render as inactive controls. The Contact page exposes no private number, public email, or guessed external URL.

- [ ] Confirm the exact official business name and spelling used on Google Maps. Working name: **Beachfront Tondol Beach Villa Vessela**.
- [ ] Obtain and verify the complete Airbnb listing URL.
- [ ] Obtain and verify the complete Facebook page URL.
- [ ] Obtain and verify the complete Messenger URL.
- [ ] Obtain and verify the Google Maps listing URL and embed URL; do not guess coordinates.
- [ ] Confirm the complete WhatsApp number with country code and permission to publish it.
- [ ] Confirm the public owner email address and permission to publish it.
- [ ] Confirm whether an owner telephone number should be public and obtain the approved number.
- [ ] Confirm whether caretaker contact numbers may be public, shared only after booking, or never public. Default: `showCaretakerContactsPublicly: false`.

## Rates, fees, capacity, and inclusions

Phase 4 interim state: every requested fee key is centralized in `src/data/fees.ts`, but all public amounts remain owner-confirmation-required. Source-draft figures are retained only for reconciliation and are not rendered on the Guest Guide.

- [ ] Confirm weekday, weekend, and holiday rates.
- [ ] Confirm deposit and standard cleaning charges, if any.
- [ ] Confirm the additional-guest fee.
- [ ] Confirm the final maximum capacity.
- [ ] Confirm whether up to 13 guests can always be considered or only under specific conditions.
- [ ] Confirm whether the Blue Kubo is included with a standard booking.
- [ ] Confirm whether the Green Kubo is included with a standard booking.
- [ ] Confirm whether the beach cottage is available and its current charge.
- [ ] Resolve the lost-key fee conflict: one source says PHP 500; another says PHP 1,000.
- [ ] Confirm current pet conditions, accepted size/training requirements, and charges.
- [ ] Confirm cooking-service fee and availability terms.
- [ ] Confirm shopping-service fee and availability terms.
- [ ] Confirm babysitting-service fee and availability terms.
- [ ] Confirm serving-service fee and availability terms.
- [ ] Confirm additional-cleaning fee and availability terms.
- [ ] Confirm any other damage/lost-item charges before publication.

Known amounts from the supplied package, still subject to owner review before final publication: soiled linen PHP 500; damaged screen door PHP 1,000; lost or damaged remote control PHP 1,500 each.

## Property details and services

- [ ] Confirm the exact sleeping arrangement for five beds across two bedrooms.
- [ ] Confirm the exact number and location of the main bathroom, external toilets, and showers.
- [ ] Confirm whether the washer remains available to guests.
- [ ] Confirm whether potable drinking water is always included and how it should be described.
- [ ] Confirm the final terms for reunions, birthdays, celebrations, and other gatherings.
- [ ] Confirm the current mobile-network guidance and whether any network names should be mentioned.
- [ ] Confirm the precise status and guest use of the separate frying/kitchen kubo.
- [ ] Confirm current tour availability and prices before displaying any figures.

## Media, reviews, and brand

Phase 5 interim state: six homepage illustrations plus one reusable generic gallery illustration are visibly labelled as placeholders. The fourteen requested gallery categories are represented without pretending that the artwork documents the property. The assets confer no approval and must be replaced individually through the permission, alt-text, responsive-image, and QA workflow in `public/images/README.md`. Three Messenger review positions are empty publication reservations, not fabricated feedback.

- [ ] Obtain approved high-resolution exterior, villa, bedroom, living, dining, kitchen, bathroom, balcony, garden, kubo, beach, parking, and nearby-attraction photographs.
- [ ] Confirm that each supplied photograph may be published and obtain accurate alt-text context.
- [ ] Obtain an approved social-sharing image or approve a clearly labelled placeholder.
- [ ] Obtain two or three approved Facebook Messenger review excerpts or redacted screenshots.
- [ ] Confirm whether guest names in reviews should be first name only, abbreviated, or hidden.
- [ ] Confirm permission for the supplied Airbnb excerpts and final attribution presentation.
- [ ] Confirm final logo direction and colors after editable VV concepts are presented.

## Product decisions

Phase 5 interim state: `contactInquiryEnabled` is false. The Contact page shows the intended field structure in a disabled fieldset, with no action, API call, validation workflow, or persistence.

Phase 6 interim state: the database schema and RLS policy design are committed, but no production project is linked, no administrator is seeded, and no migration has been applied remotely. Analytics and inquiry retention/deletion periods remain deliberately unimplemented until owner approval.

Phase 7 interim state: the administrator login/protection shell is implemented without registration or credentials. Live approved-admin access, unapproved-user denial, refresh/logout, and issued-cookie verification require a configured non-production Supabase project plus dedicated test identities; none has been supplied.

Phase 8 interim state: anonymous analytics collection/validation is implemented and feature-flagged, but no event has been persisted to a live Supabase project. All configured public destinations remain blank. A privacy-compatible distributed rate limiter/WAF policy and retention period must be approved before production-scale collection.

Phase 9 interim state: the administrator dashboard, exact aggregate functions, date filters, cards, charts, activity tables, and truthful states are implemented. Migration `007`, populated/empty/demo database states, and responsive chart interactions have not been exercised against Supabase because Docker is unavailable and no approved non-production project/administrator credentials were supplied.

Phase 10 interim state: the inquiry form, endpoint, administrator list/status workflow, and protected exports are implemented. `CONTACT_INQUIRY_ENABLED` remains false by default because launch activation and retention/deletion are unapproved. Enabled-mode browser/API failure tests pass, but no inquiry/status/export has been exercised against a live database.

Phase 11 interim state: the Privacy page, metadata, social placeholder, sitemap, fail-closed robots, manifest/icons, conservative structured data, accessibility hardening, performance review, and security headers are implemented. Production indexing remains disabled until `NEXT_PUBLIC_SITE_URL` is a final public HTTPS origin. The structured data deliberately omits official property images, exact coordinates, map/contact destinations, prices, conditional capacity, and other unresolved facts. A retention/deletion schedule, privacy-request channel, provider review, and any legally required consent control remain owner/production decisions and are not silently invented.

Phase 12 release state: the public site is deployed at `https://villa-vessela-airbnb.vercel.app`, which is now the configured canonical origin. GitHub and Vercel publication, indexing/header/accessibility/privacy smoke checks, and private-contact/browser-secret scans pass. Analytics and inquiries are explicitly disabled in production; no Supabase or test credential is configured. Official photos, public booking/contact/map destinations, rates, conditional inclusions, database activation, administrator identities, retention/deletion, and privacy-request operations remain unresolved and omitted.

- [ ] Confirm whether the website inquiry form should be active at launch.
- [ ] Confirm whether English-only content is desired or English/Filipino language switching is required.
- [ ] Confirm the public analytics retention period and inquiry retention/deletion process before production.
- [ ] Approve a public privacy-request contact channel, responsible person, response process, and deletion procedure.
- [ ] Confirm whether production analytics requires an additional consent or preference control for the intended jurisdictions.
- [x] Provide the final public HTTPS origin for canonical URLs, robots, sitemap, and social metadata: `https://villa-vessela-airbnb.vercel.app`.
- [x] Confirm the initial production domain and canonical site URL: `https://villa-vessela-airbnb.vercel.app`.
- [ ] Provide or create the Supabase project and production credentials in a secure channel during the relevant phase.
- [ ] Provide an approved administrator email and use the documented secure out-of-band Auth plus `admin_profiles` provisioning process; never commit credentials.
- [ ] Provide dedicated non-production approved and unapproved accounts through ignored local/CI secret storage for live Phase 7 QA.
- [ ] Provide an approved non-production Supabase environment for live page-view/link-click insertion and admin-read verification.
- [ ] Approve a distributed/serverless analytics rate-limit provider or Vercel WAF policy that does not persist raw IP addresses.

## Publication safeguards already decided

- Do not advertise conventional fixed Wi-Fi or guaranteed mobile speed.
- Do not claim consistently strong water pressure.
- Do not claim the kubos or beach cottage are included until confirmed.
- Do not activate incomplete external contact or booking links.
- Do not display caretaker numbers by default.
- Do not fabricate Facebook reviews or present old tour prices as current.
- Do not use unrelated stock photographs as though they depict Villa Vessela.
- Do not state or imply that Airbnb endorses the independent website.
