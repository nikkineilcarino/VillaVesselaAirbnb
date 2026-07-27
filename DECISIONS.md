# Decision Records

## Decision 001 — Treat the supplied project package as the content source of truth

- **Context:** The workspace began empty, while the 42-page PDF contains the confirmed facts, implementation brief, privacy rules, conflicts, and controlled workflow.
- **Options considered:** infer a conventional rental website; copy only selected facts; use the complete package with explicit unknowns.
- **Selected approach:** use the complete package as the baseline and maintain every conflict or missing fact in `CONTENT_TODO.md`.
- **Reason:** it minimizes invented content and makes owner approvals traceable.
- **Consequences:** some links, prices, media, and features will remain disabled or qualified until confirmed.
- **Date:** 2026-07-23

## Decision 002 — Use the recommended Next.js/Supabase architecture

- **Context:** There is no existing framework to preserve. Requirements combine SEO-friendly public content, server validation, authentication, relational analytics, and Vercel deployment.
- **Options considered:** static HTML with third-party analytics; separate frontend/backend services; Next.js App Router with Supabase.
- **Selected approach:** plan for strict TypeScript Next.js App Router, Tailwind CSS, Supabase PostgreSQL/Auth/RLS, Zod, Recharts, Playwright, and Vercel.
- **Reason:** it satisfies the requested feature set in a cohesive architecture while keeping public rendering and trusted server work together.
- **Consequences:** Phase 1 must choose compatible versions and lock them; database-dependent QA will require a Supabase environment later.
- **Date:** 2026-07-23

## Decision 003 — Separate authentication from administrator authorization

- **Context:** A valid Supabase user must not automatically gain access to analytics or inquiries.
- **Options considered:** trust all authenticated users; store an admin flag only in browser/session metadata; verify membership in a protected table.
- **Selected approach:** Supabase Auth proves identity and server-side membership in `admin_profiles` grants administration.
- **Reason:** database-backed authorization is explicit, auditable, and enforceable with RLS.
- **Consequences:** administrator provisioning requires both Auth user creation and approved profile membership; there is no public registration.
- **Date:** 2026-07-23

## Decision 004 — Use privacy-safe, first-party aggregate analytics

- **Context:** The owner needs visitor, page, and external-link performance information without invasive identification.
- **Options considered:** third-party behavioral tracking; IP/fingerprint-based identification; random first-party IDs and coarse event data.
- **Selected approach:** random visitor/session UUIDs, limited event fields, no raw IP/exact GPS/fingerprint, and dashboard wording such as “estimated unique visitor.”
- **Reason:** it supplies useful trends while matching the package's explicit privacy limits.
- **Consequences:** analytics cannot and must not claim who clicked. Tracking may undercount because privacy and public usability take precedence.
- **Date:** 2026-07-23

## Decision 005 — Centralize editable property content and approved destinations

- **Context:** Many facts appear across multiple pages and several destinations/fees are not confirmed.
- **Options considered:** hardcode copy in components; fetch all content from a CMS; use typed local data/configuration modules.
- **Selected approach:** store property data, fees, reviews, gallery items, rules, FAQs, attractions, and destinations in typed modules consumed by UI.
- **Reason:** it reduces drift, keeps unknown values representable, and makes routine owner-approved updates safer without adding a CMS prematurely.
- **Consequences:** components must not duplicate business facts; any later CMS adoption requires a documented migration decision.
- **Date:** 2026-07-23

## Decision 006 — Make analytics and inquiries failure-isolated

- **Context:** Database or network failure must not prevent visitors from reading the property site or opening approved external destinations.
- **Options considered:** require successful tracking before navigation; couple public rendering to live database queries; use best-effort server writes with graceful UI behavior.
- **Selected approach:** render core public content independently, send analytics best-effort, never block outbound navigation, and feature-flag inquiries.
- **Reason:** booking discovery is the primary business goal and should remain available during supporting-service outages.
- **Consequences:** some events may be lost; monitoring and safe server logs should identify recurring failures without collecting sensitive payloads.
- **Date:** 2026-07-23

## Decision 007 — Delay application scaffolding until Phase 1 approval

- **Context:** The supplied workflow requires Phase 0 to audit and plan without building the homepage or proceeding automatically.
- **Options considered:** scaffold immediately; create empty future directories; limit Phase 0 to meaningful documentation.
- **Selected approach:** create only the required root documents and Phase 0 QA evidence now.
- **Reason:** it preserves the user's phase-control gate and avoids presenting untested placeholders as implementation.
- **Consequences:** code-quality/build commands are not applicable in Phase 0 and become mandatory Phase 1 checks.
- **Date:** 2026-07-23

## Decision 008 — Lock a peer-compatible current foundation

- **Context:** Registry-current TypeScript 7 and ESLint 10 exceed the peer ranges of the TypeScript ESLint and Next-bundled lint plugins. Installing all latest tags produced peer-resolution warnings and no usable first lockfile.
- **Options considered:** ignore peer warnings; use prerelease tooling throughout; pin current releases inside every declared compatibility range.
- **Selected approach:** use stable Next.js 16.2.11 and React 19.2.8 with TypeScript 6.0.3 and ESLint 9.39.5. Keep exact versions in `package.json` and `package-lock.json`.
- **Reason:** exact, supported versions make local and CI results reproducible without overriding declared lint-tool compatibility.
- **Consequences:** upgrades are deliberate maintenance changes and require lint, type, test, build, and audit reruns.
- **Date:** 2026-07-23

## Decision 009 — Override two vulnerable Next.js transitive dependencies

- **Context:** Stable Next.js 16.2.11 pins PostCSS 8.4.31 and allows Sharp 0.34.x. The current audit reports vulnerabilities in those lines, while the patched Next preview already uses PostCSS 8.5.x and Sharp 0.35.x.
- **Options considered:** accept audit findings; downgrade Next to npm's unsuitable suggested version; move the whole application to a Next preview; narrowly override the affected transitive packages.
- **Selected approach:** retain stable Next.js and use npm overrides for PostCSS 8.5.22 and Sharp 0.35.3.
- **Reason:** it removes the known findings while avoiding a framework prerelease. The versions match the dependency lines already adopted by the next official preview.
- **Consequences:** the overrides must be removed or reassessed when stable Next updates its own dependencies. Every install and production build must confirm compatibility; `npm audit` must remain part of phase QA.
- **Date:** 2026-07-23

## Decision 010 — Keep the Villa Vessela identity as editable local SVG

- **Context:** The project requires an original VV monogram, light sampaguita wreath, optional wave, horizontal and emblem forms, light/dark variants, and favicon clarity.
- **Options considered:** raster logo generation; remote design asset; editable repository-native SVG geometry.
- **Selected approach:** create local SVG masters with a deep-coastal-blue emblem, overlapping white/gold VV strokes, restrained flower placements, and a small ocean-blue wave.
- **Reason:** SVG stays crisp, editable, fast, local, and auditable without inventing photography or adding a remote dependency.
- **Consequences:** final color preference remains an owner confirmation in `CONTENT_TODO.md`; future geometry or filename changes require XML, browser, accessibility, build, and visual retesting.
- **Date:** 2026-07-23

## Decision 011 — Represent unbuilt and unverified destinations as non-links

- **Context:** Phase 2 must show the required navigation and booking CTA, but later public routes and the complete Airbnb URL do not exist yet.
- **Options considered:** link to 404 routes; hide all future labels; guess destinations; show labelled disabled states.
- **Selected approach:** centralize availability in `src/data/navigation.ts`; render Home as the only current link, future pages as disabled “Soon” entries, and Airbnb as a disabled button with an explicit reason.
- **Reason:** visitors can understand the planned information architecture without encountering broken pages or fabricated links.
- **Consequences:** each later route phase must activate entries only after implementation and public-access QA. Link tracking cannot begin until a destination is verified.
- **Date:** 2026-07-23

## Decision 012 — Use explicit local illustrations until official photography is approved

- **Context:** Phase 3 needs a complete photo-led composition, but no approved Villa Vessela photographs or verified map asset were supplied.
- **Options considered:** leave every image position blank; use unrelated stock photography; generate realistic property imagery; create visibly labelled repository-native illustrations.
- **Selected approach:** use six restrained local SVG illustrations with placeholder text, accurate alternative text, nearby disclosure copy, and a documented replacement workflow.
- **Reason:** the homepage can be designed and tested without representing invented imagery as the real villa or depending on a remote asset provider.
- **Consequences:** the images are intentionally provisional and must not be used as factual evidence of appearance or navigation. Each official replacement requires permission, accurate alt text, responsive-image checks, and removal of only the corresponding placeholder disclosure.
- **Date:** 2026-07-23

## Decision 013 — Keep Phase 3 content in focused typed modules

- **Context:** The homepage repeats facts that later public pages will expand, while several details remain conditional or unconfirmed.
- **Options considered:** hardcode copy inside each section; create one large site-content object; divide content by real subject area.
- **Selected approach:** use focused `site`, `accommodation`, `amenities`, `gallery`, `reviews`, `location`, and `attractions` modules consumed by small homepage Server Components.
- **Reason:** subject-level modules make source auditing and future page reuse practical while keeping null destinations and uncertainty qualifiers explicit.
- **Consequences:** later phases should extend these modules instead of duplicating facts. A content change requires checking every consumer, its owner-confirmation status, and relevant browser assertions.
- **Date:** 2026-07-23

## Decision 014 — Keep rules, fees, attractions, and FAQs inside the Guest Guide route

- **Context:** Phase 4 names six information topics, but the supplied route architecture defines top-level routes only for Accommodation, Amenities, and Guest Guide. Inventing `/house-rules`, `/faqs`, or `/attractions` would diverge from the approved navigation model.
- **Options considered:** create six undocumented top-level routes; omit the three secondary topics; place them in clearly labelled sections within `/guest-guide`.
- **Selected approach:** implement `/accommodation` and `/amenities` as focused pages, and make arrival, packing, self-catering, house rules, fees, nearby attractions, and FAQs anchored sections of `/guest-guide`.
- **Reason:** this satisfies all Phase 4 content while preserving the explicit route architecture and keeping guest preparation in one coherent destination.
- **Consequences:** the Guest Guide is intentionally long and includes a keyboard-accessible horizontal section index. FAQs use native `<details>` elements, so no additional client JavaScript or dialog state is needed.
- **Date:** 2026-07-23

## Decision 015 — Separate source-draft fees from publishable fee output

- **Context:** The package asks for one typed fee configuration and supplies some draft amounts, but the content register requires owner review and contains a direct lost-key conflict.
- **Options considered:** publish the non-conflicting draft figures; omit fee configuration; centralize source figures with an explicit non-publishable status.
- **Selected approach:** `src/data/fees.ts` stores every requested fee key and source-draft amount for reconciliation, assigns `owner-confirmation-required` to every record, and exposes one public confirmation message. The Guest Guide never renders an amount.
- **Reason:** the implementation preserves source information for later approval without presenting an incomplete schedule as current business terms.
- **Consequences:** no fee may become public merely by changing presentation code. Owner confirmation must update the typed status and public amount model, `CONTENT_TODO.md`, browser assertions, and phase documentation together.
- **Date:** 2026-07-23

## Decision 016 — Use one accessible lightbox state machine for provisional gallery media

- **Context:** Phase 5 requires fourteen gallery categories and a modal experience, but no approved property photography is available.
- **Options considered:** publish unrelated imagery; create fourteen realistic invented images; omit the gallery; reuse visibly provisional local illustrations behind one accessible interaction.
- **Selected approach:** keep every category and alt description in `src/data/gallery.ts`, render local labelled placeholders with loading/error states, and operate one dialog with explicit close/previous/next controls, arrow keys, Escape, scroll locking, focus trapping, and focus restoration.
- **Reason:** this tests the complete browsing and accessibility behavior without implying that invented media shows the villa.
- **Consequences:** repeated provisional artwork is intentional. Lightbox images use contained sizing so disclosure labels are never cropped; official replacements require permission, accurate alt text, and responsive/lightbox regression checks.
- **Date:** 2026-07-23

## Decision 017 — Keep all unverified contact paths and inquiries non-operational

- **Context:** The requested Contact page names six possible channels and an optional inquiry form, while the package supplies no complete approved public destination and defers secure submission to Phase 10.
- **Options considered:** guess links; publish private operational contacts; create a client-only form that appears to submit; show the intended structure in an explicit disabled state.
- **Selected approach:** store every channel destination as `null`, render non-link controls with specific pending reasons, and show the inquiry fields inside a disabled fieldset with no form action, endpoint, or persistence.
- **Reason:** visitors can understand future contact choices without being sent to an incorrect/private destination or entrusting data to a non-existent workflow.
- **Consequences:** no contact channel or website inquiry works until owner-approved configuration and the relevant security/validation phase are complete. Airbnb payment guidance remains visible and the form never requests payment-card data.
- **Date:** 2026-07-23

## Decision 018 — Deny direct public database operations and mediate future writes on the server

- **Context:** The package requires public analytics and optional inquiries but also requires validation, rate limiting, approved link destinations, consent, and no public reads. A permissive anon insert policy cannot enforce the complete application-level rules safely by itself.
- **Options considered:** grant anon table inserts under RLS; expose broad authenticated operations; deny client operations and insert only through narrowly validated service-role endpoints.
- **Selected approach:** revoke `anon` and `authenticated` privileges on every application table, create no public insert policy, and grant approved administrators reads plus only inquiry `status` updates. Phase 8/10 endpoints will use the server-only service client after validation and abuse controls.
- **Reason:** the database starts deny-by-default, public request bodies cannot choose arbitrary operations/destinations, and the privileged bypass remains isolated to explicit server code.
- **Consequences:** direct Supabase browser inserts intentionally fail. Endpoint failures must remain non-revealing and non-blocking where required; the service-role module is a high-risk file and live role tests are mandatory before deployment.
- **Date:** 2026-07-23

## Decision 019 — Keep administrator aggregates RLS-aware and seed no identity

- **Context:** Later dashboards need efficient daily metrics, but ordinary PostgreSQL views can execute with owner privileges, and a seeded administrator would require an invented Auth identity or credential.
- **Options considered:** query raw tables only; create owner-executed views; use security-invoker views and seed a default admin; use security-invoker views with only synthetic business records.
- **Selected approach:** create four daily `security_invoker` views using Asia/Manila dates and base-table indexes. Seed only clearly marked analytics/inquiry samples with reserved `.invalid` destinations; create no `auth.users` or `admin_profiles` row.
- **Reason:** dashboard queries gain a safe aggregate foundation without bypassing RLS or committing credentials and identities.
- **Consequences:** an administrator must be created and approved manually in Phase 7. The reviewed type mirror must be compared with generated types after migrations can run; local execution remains blocked while Docker is unavailable.
- **Date:** 2026-07-23

## Decision 020 — Layer request session refresh and server administrator authorization

- **Context:** Next.js Proxy can refresh/verify cookies early, but current framework guidance warns that Proxy must not be the only authorization check. Supabase authentication also does not prove Villa Vessela administrator approval.
- **Options considered:** trust any cookie/session in Proxy; check only Auth identity in the protected layout; use Proxy for optimistic identity plus a fresh Auth and RLS-protected profile check at the server boundary.
- **Selected approach:** match `/admin/*` in one Next.js 16 `proxy.ts`, use `auth.getClaims()` for early verification/refresh, and enforce protected rendering with request-scoped `auth.getUser()` plus an RLS-visible `admin_profiles` row. Login repeats authorization before success and uses only fixed redirects.
- **Reason:** session maintenance, identity verification, and business authorization remain explicit independent layers; an authenticated but unapproved user cannot enter the admin shell.
- **Consequences:** administrator pages are dynamic/noindex/private, no registration or arbitrary return target exists, and Supabase/project/test identities are required to finish live refresh/approved/unapproved/logout/cookie QA. Until then Phase 7 is completed but not marked QA passed.
- **Date:** 2026-07-23

## Decision 021 — Minimize analytics before server-mediated insertion

- **Context:** The package requests useful traffic/link metrics while prohibiting identity, raw IP, exact GPS, invasive fingerprints, arbitrary destinations, and navigation coupling. No distributed limiter or live Supabase project is available.
- **Options considered:** third-party analytics; direct public Supabase inserts; server endpoints using IP/fingerprint identity; random first-party IDs with strict server validation and an isolated insert client.
- **Selected approach:** create a 365-day random visitor UUID cookie plus a 30-minute-inactivity session UUID, allow only implemented public paths/origin-only referrers/coarse categories, require exact normalized destination configuration, and insert only after 4 KiB Zod validation plus bounded per-visitor/global process limits. Link delivery never prevents native navigation.
- **Reason:** this answers aggregate questions without pretending to identify visitors and keeps the privileged database bypass behind a narrow, testable boundary.
- **Consequences:** analytics is opt-in via an exact `true` build/server flag; disabled or failed storage does not break the site. Process-local limits do not provide globally atomic serverless enforcement, so an approved privacy-compatible distributed limiter/WAF policy and live insert tests remain mandatory before production collection. No raw IP is retained to compensate.
- **Date:** 2026-07-23

## Decision 022 — Keep dashboard aggregation exact, range-bounded, and RLS-invoked

- **Context:** Dashboard cards need exact distinct visitors/sessions and an exact CTR across a selected period. Summing daily distinct counts would double-count repeat visitors, while sending raw event sets into a chart Client Component would be inefficient and expose unnecessary identifiers.
- **Options considered:** sum daily views in the application; fetch raw events and aggregate in Node/browser code; use a service-role dashboard query; add authenticated `SECURITY INVOKER` aggregate functions over RLS-protected tables.
- **Selected approach:** migration `007` adds five authenticated-only functions bounded to a valid maximum 366-day interval. They retain caller RLS, calculate distinct totals and CTR in PostgreSQL, return at most daily/category/top-10 aggregate rows, and expose a Boolean synthetic-data marker. Recent activity remains a separately selected, 15-row server-rendered view with full anonymous IDs shortened before presentation.
- **Reason:** exact cross-day definitions stay in the database, the approved administrator policy remains authoritative, query volume is bounded, and Recharts receives aggregates rather than visitor/inquiry records.
- **Consequences:** migration `007` must be applied before the dashboard can load. An authenticated but unapproved caller can execute no data-bearing read because base-table RLS returns no rows. Live role, populated/empty, tooltip, responsive-chart, and database-failure checks remain mandatory once a non-production Supabase runtime and dedicated identities exist; until then Phase 9 is completed but not QA passed.
- **Date:** 2026-07-23

## Decision 023 — Separate optional inquiry insertion from RLS-authorized administration

- **Context:** Public visitors may optionally send personal inquiry data, while administrators need to read it, change only its workflow status, and download bounded reports. Direct public database grants would bypass application validation, and a service-role administrator query would bypass the approved-admin RLS boundary.
- **Options considered:** allow anonymous table inserts; use the service role for the complete inquiry workflow; send form data to email only; use a default-off validated insert endpoint and keep all administrative operations on the authenticated RLS client.
- **Selected approach:** enable the public form and endpoint only when one exact server flag is true; accept only same-origin bounded JSON; sanitize, validate, and rate-limit before the narrow service-role insert; and use repeated administrator authorization plus the request-scoped RLS client for list, status, and CSV operations. CSV types, dates, columns, filenames, page size, total rows, and formula handling are fixed.
- **Reason:** the public boundary can enforce consent and abuse controls without creating a public table policy, while administrator access remains governed by the same identity/profile/RLS model as the dashboard.
- **Consequences:** the feature remains off until owner approval, retention/deletion procedure, applied migrations, credentials, and live role/workflow tests exist. Process-local limits are not globally atomic. Inquiry CSV files contain personal data despite excluding technical identifiers and therefore require private handling and an approved deletion process.
- **Date:** 2026-07-23

## Decision 024 — Fail closed on indexing and publish only supportable structured data

- **Context:** Canonical URLs, robots, sitemap, social metadata, and lodging structured data need a production origin and verified property facts. The project has no final domain, exact coordinates, stable external listing identifier, or required set of official property photographs.
- **Options considered:** emit production-indexable localhost/fallback URLs; guess a domain/location and publish full `VacationRental`; omit all SEO; validate one origin, block indexing for non-production values, and publish a narrower verified-fact graph.
- **Selected approach:** accept only a public HTTPS origin or documented local HTTP origin without credentials/path/query/fragment. Local, invalid, and reserved values emit noindex plus disallow-all robots. Publish `LodgingBusiness` and breadcrumbs with only confirmed/supplied facts, escape JSON-LD, and visibly label the generated social image as provisional.
- **Reason:** search/share files are complete and testable without creating duplicate canonicals, exposing configuration, inventing facts, or claiming Google rich-result eligibility that the property cannot yet satisfy.
- **Consequences:** Phase 12 must configure the final HTTPS origin and re-run canonical/robots/sitemap/social inspection. Rich `VacationRental` markup remains deferred until official photos, precise location, a stable identifier, eligibility, and external validation exist.
- **Date:** 2026-07-23

## Decision 025 — Harden globally without sacrificing static public delivery

- **Context:** Phase 11 requires security headers, visible focus, reduced motion, optimized fonts/assets, and minimal JavaScript. Request-time CSP nonces would make otherwise static pages dynamic, while unrestricted headers and remote fonts add avoidable risk and transfer.
- **Options considered:** leave framework defaults; force every route dynamic for nonce CSP; allow broad external origins; use a static same-origin policy with environment-specific script rules and local/system assets.
- **Selected approach:** apply one restrictive same-origin header baseline to all routes, keep inline script/style support required by the current Next.js/JSON-LD/image/chart output, allow `unsafe-eval` only in development, and add HSTS/HTTPS upgrade only in production. Use system fonts, local assets, bounded cache headers, route-scoped Client Components, two-color focus, forced-color fallback, focus clearance, and reduced-motion CSS.
- **Reason:** the public information routes remain statically deliverable and accessible while third-party script/resource origins, framing, sensitive browser capabilities, MIME sniffing, and production eval are denied.
- **Consequences:** any future third-party script, font, frame, API, map embed, payment integration, or nonce adoption requires an explicit CSP/privacy/performance review. Static filenames use one-day freshness rather than immutable caching so approved media can be replaced safely.
- **Date:** 2026-07-23

## Decision 026 — Release the public information site with every unapproved data feature off

- **Context:** The public website is ready for deployment, but no approved Supabase project, administrator identities, retention/deletion procedure, official photography, public contact, or booking/map destination has been supplied. Delaying all publication would not improve those missing business decisions, while silently configuring placeholders or credentials would create privacy and accuracy risk.
- **Options considered:** block deployment entirely; invent/configure production values; enable analytics/inquiries without storage; release the verified public information site with fail-safe feature gates and explicit placeholders.
- **Selected approach:** publish owner-attributed source to `nikkineilcarino/VillaVesselaAirbnb`, deploy the Next.js project to the requested Vercel team, pin Node to the audited 22.x line, set the exact HTTPS canonical origin, and configure `ANALYTICS_ENABLED=false` plus `CONTACT_INQUIRY_ENABLED=false`. Omit every Supabase value, test credential, private contact, and unapproved public destination.
- **Reason:** visitors receive the complete privacy/accessibility/security-reviewed information experience while unavailable operational features remain non-collecting and non-revealing. The configuration is reproducible and each future activation has a documented independent gate.
- **Consequences:** the public site is indexable on `https://villa-vessela-airbnb.vercel.app`; analytics POSTs are harmless 204 no-ops, contact submission returns 404, no `vv_*` analytics cookie is created, protected administrator routes redirect to login, and login remains non-revealing/unavailable without Supabase. Database, role, administrator, insertion, retention, and deletion acceptance criteria remain blocked, not passed. A future custom domain or feature activation requires environment changes, a rebuild, and the complete applicable release checks.
- **Date:** 2026-07-23

## Decision 027 — Keep the compatible lint stack while isolating a development-only denial-of-service advisory

- **Context:** A July 27 re-audit reports nine high-severity development-package entries, all propagated from CVE-2026-14257 in `brace-expansion`. The production audit reports zero vulnerabilities. ESLint 9 and the Next.js lint plugins require the affected legacy `minimatch`/`brace-expansion` API lines; npm's proposed fixes either force ESLint 10 beyond several bundled plugin peer ranges or downgrade `eslint-config-next` from 16.x to an incompatible older major.
- **Options considered:** run `npm audit fix --force`; globally override `brace-expansion` to 5.0.8; replace the supported lint stack; retain the compatible exact versions with an explicit temporary disposition.
- **Selected approach:** patch the compatible modern branch with the version-scoped `brace-expansion@^5.0.5` override, keep the exact supported lint versions for the incompatible legacy branch, do not use a forced audit fix, and restrict lint execution to the repository-owned command and fixed configuration until compatible upstream releases are available. Continue treating `npm audit --omit=dev` as the production release gate and review the complete audit separately.
- **Reason:** `brace-expansion` 5.0.8 is API-compatible with the modern `minimatch` 10 branch. It changes the CommonJS export from a callable function to a named `expand` export, however, while installed `minimatch` 3 calls the dependency itself as a function; forcing the patched version onto that legacy branch breaks ESLint. The remaining affected code is installed only for development and receives no visitor-controlled patterns in the repository's fixed `eslint .` workflow.
- **Consequences:** the full development audit intentionally remains nonzero and must not be described as passing. Reassess when ESLint/Next lint plugins publish a peer-compatible dependency path to patched `brace-expansion`, and rerun tree validation, lint, types, tests, build, and both audit scopes before accepting it.
- **Date:** 2026-07-27

## Decision 028 — Run a secretless, read-only continuous-integration gate

- **Context:** Local and release checks are comprehensive, but the repository had no automated verification on future pushes or pull requests. Database-backed acceptance tests still require approved non-production infrastructure and dedicated identities that have not been supplied.
- **Options considered:** keep verification manual; give CI production/test credentials; run only fast static checks; automate every credential-independent gate with no secrets.
- **Selected approach:** run one GitHub-hosted Node 22 job for locked installation, production dependency audit, lint, strict types, unit tests, production build, and Chromium checks on pushes and pull requests to `main`. Pin GitHub-owned actions to immutable release commits, disable persisted checkout credentials, and grant only `contents: read`.
- **Reason:** future changes receive the same reproducible application gate without exposing Supabase keys, administrator accounts, private contacts, or deployment authority to pull-request code.
- **Consequences:** two live administrator tests and all live database/RLS/insertion/retention checks remain skipped or blocked, not passed. CI failure prevents no merge by itself until the repository owner enables branch protection and marks the workflow as a required check.
- **Date:** 2026-07-27

## Decision 029 — Group compatible dependency maintenance and review majors deliberately

- **Context:** Exact versions and immutable action SHAs make releases reproducible, but they also require an explicit process to discover upstream maintenance. Ungrouped update automation can create excessive pull-request noise, while blindly accepting major releases can cross framework and plugin compatibility boundaries.
- **Options considered:** keep update discovery manual; automate every available update; automate security updates only; schedule grouped patch/minor maintenance with manual majors.
- **Selected approach:** run weekly Dependabot checks for npm and GitHub Actions in the Asia/Manila timezone. Group routine npm production and development patch/minor updates separately, group action patch/minor updates, cap open version-update pull requests, and leave major version updates for deliberate review.
- **Reason:** compatible updates become visible and exercise the complete CI gate without allowing automation to silently cross major API or peer-dependency boundaries. Dependabot's SemVer update-type filter applies only to version updates, so security updates remain eligible even when a patched resolution requires a new major.
- **Consequences:** no Dependabot pull request is trusted or merged automatically. Each must preserve exact lockfile integrity and pass audit, lint, types, unit tests, build, and credential-independent browser tests; incompatible groups must be split, closed, or deferred with the reason recorded.
- **Date:** 2026-07-27
