# Content TODO

This is the authoritative register for missing, conflicting, or unconfirmed business information. Code and public copy must not silently choose an answer. Unknown destinations remain inactive; unknown inclusions/fees remain hidden or say “Please confirm with the host” where context requires a response.

## Identity, destinations, and public contact

Current state: the owner-approved Airbnb listing, Facebook page, Messenger conversation, WhatsApp contact, verified Google Maps/Waze pin, Nida's caretaker telephone, and public email are active through validated public configuration. Evelyn has been removed from the contact list; the owner-phone destination remains inactive. The Contact page exposes no unapproved private value or guessed external URL.

- [ ] Confirm the exact official business name and spelling used on Google Maps. Working name: **Beachfront Tondol Beach Villa Vessela**.
- [x] Obtain, approve, and verify the Airbnb listing URL; production uses the stable canonical room path without the supplied tracking query.
- [x] Obtain, approve, and verify the complete Facebook page URL.
- [x] Obtain, approve, and verify the complete Messenger conversation URL.
- [x] Verify the public Waze property pin and use its exact coordinates for matching Google Maps and Waze navigation/embed URLs on 2026-07-27. The official Google Maps business-listing name remains a separate unchecked item.
- [x] Owner supplied and approved a complete country-code WhatsApp contact for public use on 2026-07-27. The value remains environment-configured and absent from Git.
- [x] Owner supplied and approved the public email address for display on 2026-08-08. The value remains environment-configured and absent from Git.
- [ ] Confirm whether an owner telephone number should be public and obtain the approved number.
- [x] Owner retained Nida's caretaker telephone contact and removed Evelyn from the public contact list on 2026-08-08. The remaining telephone value stays environment-configured and absent from Git; WhatsApp availability was not inferred.

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
- [x] Owner confirmed on 2026-07-27 that the separate kitchen kubo is shared by guests staying in the Blue and Green kubos. Access for a main-villa-only booking remains confirmation-required.
- [ ] Confirm current tour availability and prices before displaying any figures.

## Media, reviews, and brand

Photo integration state: the local application now defines 41 owner-supplied, privacy-reviewed JPEG photographs for the homepage, accommodation page, Guest Guide, and Gallery, with accurate alternative text and qualified captions. The six nearby-attraction crops are implemented locally but remain pending Step 5 verification and Step 6 deployment. The passenger-boat image is intentionally unpublished because it contains recognizable people and a vessel identifier. Blue Kubo, Green Kubo, and parking retain explicit future photo slots; the parking arrangement is confirmed even though its dedicated photograph is pending. Interactive maps use the verified pin, and the social card uses approved photography. `OWNER_UPDATE_GUIDE.md` documents the later replacement workflow. Three Messenger review positions are empty publication reservations, not fabricated feedback.

### Nearby-attractions image package — staged implementation

Source received on 2026-08-08: `Nearby_Attractions_Improved_Images (1).pdf` (35,759,658 bytes; SHA-256 `77BED4E120827A1103AB874EFBE6B627621EB62CD12D72EF3C3F7A534529DF6C`). The owner supplied the file and asked for its contents to be added to the website. The PDF contains six raster-only pages at 1654 × 2339 pixels, with one complete page image and one visible caption per page; it does not contain separately embedded original photographs or extractable text. Website-ready photographs must therefore be cropped from the page artwork and optimized rather than publishing PDF pages with their headings, captions, margins, and page numbers.

| PDF page | Supplied visible caption | Website mapping | Intake note | Status |
| --- | --- | --- | --- | --- |
| 1 | Bolinao - Silaki Island - Giant clams | Add a photo-led Silaki Island attraction and a new Gallery record | Sea excursion image includes small human figures; complete the normal privacy/identifier crop review | Mapped |
| 2 | Bolinao floating restaurant | Add a qualified floating-dining attraction and a new Gallery record without naming an unconfirmed operator | Floating dining structures on the water; do not imply current opening hours, operator, price, or availability | Mapped |
| 3 | Bolinao - Tara Falls | Add Tara Falls as its own photo-led attraction and new Gallery record | Keep the supplied Tara Falls label separate from the broader Bolinao Falls entry | Mapped |
| 4 | Bolinao Falls | Add Bolinao Falls as its own photo-led attraction and new Gallery record | Do not infer a numbered falls, swimming permission, fee, or operating condition from the image alone | Mapped |
| 5 | 100 islands | Add the image to the existing Hundred Islands attraction and replace its lower-resolution Gallery asset | Use the established “Hundred Islands” website title; the official destination is Hundred Islands National Park | Mapped |
| 6 | Tondol Tanduyong Island. Walk during low tide | Add Tanduyong Island separately and replace the current generic low-tide-island Gallery record | Preserve the low-tide qualification; do not rename or remove Toothbrush Island without evidence that the names refer to the same place | Mapped |

#### Step 2 mapping decision

The six images will use the existing Guest Guide and Gallery rather than creating another public route. `src/data/attractions.ts` remains the single source for nearby-attraction copy, while `src/data/gallery.ts` remains the single source for lightbox records. The homepage attraction preview keeps its current four-item scope so the new package does not crowd the landing page.

| Supplied item | Data/category plan | Guest Guide plan | Gallery/asset plan |
| --- | --- | --- | --- |
| Silaki Island — giant clams | Add one condition-qualified `day trip` entry focused on the conservation destination | Photo-led card | Add `silaki-island-giant-clams.jpg` |
| Bolinao floating restaurant | Add one condition-qualified `food` entry; keep the operator generic | Photo-led card | Add `bolinao-floating-restaurant.jpg` |
| Tara Falls | Add one condition-qualified `day trip` entry distinct from Bolinao Falls | Photo-led card | Add `tara-falls-bolinao.jpg` |
| Bolinao Falls | Add one condition-qualified `day trip` entry without assigning Falls 1, 2, or 3 | Photo-led card | Add `bolinao-falls.jpg` |
| Hundred Islands | Enrich the existing `day trip` entry rather than creating a duplicate | Convert the existing entry to a photo-led card | Replace `hundred-islands-view.jpg` with the improved crop; keep the existing record identity |
| Tanduyong Island | Add one condition-qualified `activity` entry and keep Toothbrush Island unchanged | Photo-led card with low-tide safety wording | Replace the generic `island-at-low-tide-sunset.jpg` record with `tanduyong-island-low-tide.jpg` and a truthful named caption |

The completed local mapping moves the Gallery dataset from 37 to 41 published photographs: four net-new records and two improved replacements. No external destination, route, navigation item, price, distance, travel time, operator promise, or live-availability claim is added by this package.

Mapping evidence and restraint:

- The Philippine News Agency and Bolinao/DOST material support Silaki Island's giant-clam conservation identity; public copy will still require guests to verify whether visitor activities are currently operating.
- Philippine Information Agency material documents a floating restaurant experience in Bolinao, but the supplied caption does not identify a business; the website will therefore avoid naming or endorsing an operator.
- The Bolinao municipal site and current provincial safety material recognize waterfalls as local visitor destinations; the two supplied waterfall labels remain separate and operational details stay unclaimed.
- The City of Alaminos identifies the official destination as Hundred Islands National Park, so the supplied “100 islands” caption maps to the existing Hundred Islands entry.
- No sufficiently reliable source reviewed during mapping established that Tanduyong Island and Toothbrush Island are alternate names for one place. Both remain separate until the owner provides that confirmation.

Evidence checked on 2026-08-08: [Philippine News Agency — Silaki Island giant-clam tourism project](https://www.pna.gov.ph/articles/1217945), [DOST Region 1 — Silaki Island marine-conservation context](https://region1.dost.gov.ph/news/%F0%9D%90%80-%F0%9D%90%8F%F0%9D%90%AB%F0%9D%90%A2%F0%9D%90%9C%F0%9D%90%9E%F0%9D%90%A5%F0%9D%90%9E%F0%9D%90%AC%F0%9D%90%AC-%F0%9D%90%86%F0%9D%90%A2%F0%9D%90%9F%F0%9D%90%AD-%F0%9D%90%9F%F0%9D%90%AB/), [Philippine Information Agency — Bolinao floating-restaurant context](https://mirror.pia.gov.ph/features/2023/05/05/experience-the-taste-of-the-north-food-and-gastronomy-tour-in-pangasinan), [Municipality of Bolinao — official visitor overview](https://elgu-bolinao-pangasinan-news.e.gov.ph/), [Philippine Information Agency — current Bolinao visitor-safety controls](https://pia.gov.ph/news/pangasinan-town-heightens-holy-week-safety-measures/), and [City of Alaminos — Hundred Islands National Park](https://www.alaminoscity.gov.ph/ecological-profile/content/chapter2/hundred_islands_national_park.html).

#### Step 3 asset preparation

The photograph boundary was detected and visually confirmed on every raster page. Pages 1 and 4 use crop box `(95, 180)–(1558, 2009)`; pages 2, 3, 5, and 6 use `(90, 542)–(1564, 1647)`. These crops exclude the PDF title, horizontal rules, margins, supplied caption text, and page numbers.

| Website asset | Dimensions | Encoded size | Step 3 role and review |
| --- | ---: | ---: | --- |
| `silaki-island-giant-clams.jpg` | 1463 × 1829 | 486,179 bytes | New; small figures remain silhouettes with no discernible face, readable identifier, or private text |
| `bolinao-floating-restaurant.jpg` | 1474 × 1105 | 408,025 bytes | New; no discernible face, readable operator sign, or private text |
| `tara-falls-bolinao.jpg` | 1474 × 1105 | 542,115 bytes | New; no person, identifier, or private text visible |
| `bolinao-falls.jpg` | 1463 × 1829 | 768,940 bytes | New; no person, identifier, or private text visible |
| `hundred-islands-view.jpg` | 1474 × 1105 | 346,468 bytes | Improved replacement written over the existing lower-resolution file |
| `tanduyong-island-low-tide.jpg` | 1474 × 1105 | 240,770 bytes | New named replacement; Step 4 removed the superseded generic low-tide asset after changing its code reference |

All six outputs are RGB progressive JPEGs encoded at quality 85, open successfully at their declared dimensions, contain zero EXIF entries, and contain no embedded ICC profile. The optimized files total 2,792,497 bytes. The full-resolution and post-encoding visual reviews found no PDF-layout residue, clipping, corrupted areas, readable vessel/vehicle identifiers, private records, or discernible faces.

#### Step 4 local content integration

The six verified photographs are now connected to photo-led cards in the existing Guest Guide attractions section. `src/data/attractions.ts` owns their dimensions, truthful alternative text, and condition-qualified copy; non-photo attraction cards keep their existing icon treatment. Hundred Islands is enriched in place, while Silaki Island, the generic Bolinao floating-restaurant experience, Tara Falls, unnumbered Bolinao Falls, and Tanduyong Island are distinct entries. Toothbrush Island remains unchanged.

`src/data/gallery.ts` now defines 41 approved photographs and three explicit placeholders. Four new records were added, the Hundred Islands image and dimensions were replaced in place, and the old generic low-tide record was replaced with the named Tanduyong record. The superseded Git-tracked `island-at-low-tide-sunset.jpg` asset was removed only after the application source stopped referencing it. Page copy, repository guides, and browser-test expectations now use the 41-photo/44-total-lightbox-item structure. The homepage preview remains a four-item selection but its link copy reports the current Gallery count.

#### Step 5 verification

Local verification completed on 2026-08-08. ESLint and strict TypeScript passed; all 68 Vitest unit tests passed. The final isolated Chromium run passed 47 browser tests, with only the two deliberately credential-gated live-administrator checks skipped because no approved test accounts were supplied. That run covers all 44 Gallery items, direct loading of the six attraction JPEGs, the six photo-led Guest Guide cards, mobile overflow, keyboard navigation, lightbox and menu focus behavior, automated Axe accessibility checks, metadata, analytics boundaries, and security headers.

All six attraction JPEGs decode successfully at their declared dimensions as RGB progressive JPEGs, contain no EXIF or ICC metadata, and retain the completed visual privacy review. Changed-text credential scanning, the excluded-contact scan, and the superseded-runtime-reference scan passed. `npm audit --audit-level=high` reported zero vulnerabilities. The optimized Next.js production build compiled, type-checked, generated all 14 static outputs, and completed successfully. The local development preview was restored after the exclusive browser/build checks.

#### Step 6 publication

The verified application changes were committed as `c06ed146facfc1f74cba99cde529d05dd109f1c5` (`feat: add nearby attraction photo guide`) using the configured `nikkineilcarino` contributor identity and pushed to `origin/main` at `nikkineilcarino/VillaVesselaAirbnb`. Local `HEAD` and the remote branch were confirmed identical after the push.

Vercel production deployment `dpl_AZMBK154nZE4fQxn1TGqd3uCV31p` completed successfully and reported `Ready`; the project alias resolves to `https://villa-vessela-airbnb.vercel.app`. The canonical homepage, Guest Guide, and Gallery returned HTTP 200. All six attraction JPEGs returned HTTP 200 with `image/jpeg` content types and public cache headers, while the superseded generic asset returned HTTP 404. Live content checks confirmed the six attraction headings, 41-photo Gallery count, homepage count, canonical URL, and security headers. A focused Chromium run against the canonical production alias passed all seven Gallery, Guest Guide, mobile-overflow, keyboard/lightbox, and Axe accessibility checks.

Implementation checkpoints:

- [x] Confirm the source file is readable, unencrypted, six pages long, and visually inspect every page.
- [x] Record the six supplied captions exactly enough for source reconciliation without silently correcting place names.
- [x] Map each supplied attraction to the existing `src/data/attractions.ts`, Guest Guide, homepage preview, and Gallery structure; decide whether each item is added, replaces an existing image, or remains separate.
- [x] Reconcile “100 islands” with the existing Hundred Islands item. Keep Tanduyong Island separate from Toothbrush Island because the reviewed sources do not establish equivalence.
- [x] Crop only the photograph area from each raster page, excluding PDF headings, margins, caption text, rules, and page numbers.
- [x] Use truthful filenames and dimensions, strip metadata, and optimize the final website formats without enlarging beyond the supplied pixels. Alternative text and public captions remain part of Step 4 data integration.
- [x] Complete a full-resolution and post-encoding privacy/identifier review, especially for the silhouetted human figures and boats on page 1.
- [x] Keep all attraction claims qualified by current weather, tide, access, operator, schedule, safety, and price checks; publish no guessed distance or travel time.
- [x] Update relevant data/components/tests and the published-photo count only after the final asset set is known.
- [x] Run responsive, keyboard, image-loading, accessibility, privacy, lint, type, unit, browser, build, and dependency checks.
- [x] Commit and push with the configured contributor identity, deploy to Vercel, and verify the canonical production site.

Step boundary: source intake, factual reconciliation, website mapping, cropping, privacy review, asset optimization, local data integration, Guest Guide presentation, Gallery integration, test updates, documentation, full local verification, GitHub publication, Vercel deployment, and canonical production verification are complete.

- [ ] Obtain approved high-resolution front-of-villa, Blue Kubo, Green Kubo, and confirmed-parking photographs; current exterior, bedroom, living-room, entrance, and some garden sources are below 500 pixels on their longest side.
- [ ] Obtain publication permission for the passenger-boat photograph or a crop without recognizable people and the vessel identifier.
- [x] Publish a 1200 × 630 social-sharing card using the approved high-resolution Villa Vessela photo-wall image.
- [ ] Obtain two or three approved Facebook Messenger review excerpts or redacted screenshots.
- [ ] Confirm whether guest names in reviews should be first name only, abbreviated, or hidden.
- [ ] Confirm permission for the supplied Airbnb excerpts and final attribution presentation.
- [ ] Confirm final logo direction and colors after editable VV concepts are presented.

## Product decisions

Phase 5 interim state: `contactInquiryEnabled` is false. The Contact page shows the intended field structure in a disabled fieldset, with no action, API call, validation workflow, or persistence.

Phase 6 production state: an owner-approved Supabase project is linked locally through ignored CLI state. Migrations `001` through `007` were applied remotely in order on 2026-08-10, remote migration history matches, and linked schema lint reports no errors. No synthetic seed data was applied. Analytics and inquiry retention/deletion periods remain deliberately unimplemented until owner approval.

Phase 7 production state: one owner-approved, email-confirmed Auth identity and its exact `admin_profiles` authorization row were provisioned out of band on 2026-08-10. Direct password authentication and RLS-authorized profile access passed. Production browser checks passed approved sign-in, dashboard and inquiry-page access, logout, post-logout protected-route denial, and generic denial for an authenticated user without a profile. Disposable unapproved identities were deleted after testing; no credential is committed or stored in Vercel test variables.

Phase 8 interim state: anonymous analytics collection/validation is implemented and feature-flagged, but no event has been persisted to a live Supabase project. Approved public destinations can be configured independently while analytics remains disabled. A privacy-compatible distributed rate limiter/WAF policy and retention period must be approved before production-scale collection.

Phase 9 production state: migration `007` is applied and the approved administrator successfully opened the RLS-backed empty Analytics dashboard and Inquiries page in production. Populated/demo metrics, chart tooltips, and CSV reconciliation remain untested because analytics and inquiries are disabled and the production database intentionally contains no visitor or inquiry records.

Phase 10 interim state: the inquiry form, endpoint, administrator list/status workflow, and protected exports are implemented. `CONTACT_INQUIRY_ENABLED` remains false by default because launch activation and retention/deletion are unapproved. Enabled-mode browser/API failure tests pass, but no inquiry/status/export has been exercised against a live database.

Phase 11 state: the Privacy page, metadata, approved photo-based social card, sitemap, fail-closed robots, manifest/icons, conservative structured data, accessibility hardening, performance review, and security headers are implemented. Production indexing is enabled only for the final public HTTPS origin. The structured data deliberately omits property images, exact coordinates, map/contact destinations, prices, conditional capacity, and other unresolved facts. A retention/deletion schedule, privacy-request channel, provider review, and any legally required consent control remain owner/production decisions and are not silently invented.

Phase 12 release state: the public site is deployed at `https://villa-vessela-airbnb.vercel.app`, which is now the configured canonical origin. GitHub and Vercel publication, indexing/header/accessibility/privacy smoke checks, and private-contact/browser-secret scans pass. The Airbnb listing, Facebook page, Messenger conversation, WhatsApp contact, Google Maps/Waze pin, Nida's caretaker telephone, and public email are approved public destinations. Supabase production Auth/database configuration and one approved administrator are active. Analytics and inquiries remain explicitly disabled; the service-role key and test credentials are not deployed. The remaining photo gaps, owner telephone destination, rates, conditional inclusions, retention/deletion, and privacy-request operations remain unresolved and omitted.

- [ ] Confirm whether the website inquiry form should be active at launch.
- [ ] Confirm whether English-only content is desired or English/Filipino language switching is required.
- [ ] Confirm the public analytics retention period and inquiry retention/deletion process before production.
- [ ] Approve a public privacy-request contact channel, responsible person, response process, and deletion procedure.
- [ ] Confirm whether production analytics requires an additional consent or preference control for the intended jurisdictions.
- [x] Provide the final public HTTPS origin for canonical URLs, robots, sitemap, and social metadata: `https://villa-vessela-airbnb.vercel.app`.
- [x] Confirm the initial production domain and canonical site URL: `https://villa-vessela-airbnb.vercel.app`.
- [ ] Obtain explicit purchase approval, billing/registrant details, and annual-renewal approval for `villavessela.com`. A read-only registry/DNS/Vercel check on 2026-07-29 reported it available at `$11.25` for the first year and `$11.25` per annual renewal; availability and pricing must be rechecked at checkout.
- [x] Create the owner-approved Supabase project, apply and lint the seven migrations, and configure only the public URL/anon key required for production administrator authentication on 2026-08-10.
- [x] Provision the owner-approved administrator identity and exact `admin_profiles` row out of band, then verify production sign-in/authorization/logout without committing its email or credentials on 2026-08-10.
- [ ] Provide dedicated non-production approved and unapproved accounts through ignored local/CI secret storage for live Phase 7 QA.
- [ ] Provide an approved non-production Supabase environment for live page-view/link-click insertion and admin-read verification.
- [ ] Approve a distributed/serverless analytics rate-limit provider or Vercel WAF policy that does not persist raw IP addresses.

## Publication safeguards already decided

- Do not advertise conventional fixed Wi-Fi or guaranteed mobile speed.
- Do not claim consistently strong water pressure.
- Do not claim the kubos or beach cottage are included until confirmed.
- Do not activate incomplete external contact or booking links.
- Display caretaker telephone contacts only when their separately approved public environment values validate; do not infer WhatsApp or publish other private details.
- Do not fabricate Facebook reviews or present old tour prices as current.
- Do not use unrelated stock photographs as though they depict Villa Vessela.
- Do not state or imply that Airbnb endorses the independent website.
