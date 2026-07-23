# Phase 8 QA — Privacy-safe Analytics

## Status

**Completed with live-storage/configured-link blockers.** Identifier lifecycles, minimization, deduplication, administrator exclusion, destination validation, request bounds, same-origin checks, rate limits, delivery fallbacks, failure isolation, regression, build, secret, and privacy checks pass. No page view/link click could be inserted or read back from a live database because no Supabase runtime/project credentials exist. No configured approved external link exists for a real navigation/delivery check. The phase is therefore not labelled `QA passed`.

## Scope delivered

- Feature-disabled mode creates no analytics identifier or request; activation requires `ANALYTICS_ENABLED=true` at server/build time.
- Random UUID visitor identity in `vv_visitor_id` for at most 365 days, Path `/`, SameSite=Lax, and `Secure` on HTTPS.
- Separate random session UUID in `sessionStorage`, refreshed on activity and replaced after more than 30 minutes of inactivity.
- Public-route-only `PageViewTracker` with last-path rerender deduplication and no query/hash/admin route collection.
- Referrers reduced to HTTP(S) origin before dispatch and normalized again at the server.
- Coarse `mobile/tablet/desktop/unknown` and `chrome/safari/firefox/edge/other/unknown` categories; no raw user agent is sent.
- Reusable `TrackedExternalLink` using `sendBeacon`, keepalive fetch fallback, and unmodified native anchor navigation.
- One normalized destination boundary for Airbnb, Facebook, Messenger, Google Maps, WhatsApp, telephone, and email. Blank/malformed values remain inactive.
- Same-origin, no-store POST handlers for page views and link clicks with 4 KiB JSON caps, strict Zod schemas, public-path allowlist, exact destination/type checks, and service-only inserts.
- Bounded process-local rate limits: 60 page views or 30 link clicks per random visitor per minute, with respective 600/300 global request caps and 10,000-key bounds.
- Payload-free, once-per-event/reason server warnings and safe `202` degradation when storage is missing or fails.

## Files added

| Area | Files |
| --- | --- |
| Browser components | `src/components/analytics/AnalyticsProvider.tsx`, `PageViewTracker.tsx`, `TrackedExternalLink.tsx`, `README.md` |
| Analytics libraries | `src/lib/analytics/identifiers.ts`, `normalization.ts`, `dispatch.ts`, `request.ts`, `rateLimit.ts`, `server.ts`, `README.md` |
| Configuration/types | `src/lib/config/publicDestinations.ts`, `src/lib/config/README.md`, `src/types/analytics.ts` |
| Validation/endpoints | `src/lib/validation/analytics.ts`, `src/app/api/analytics/page-view/route.ts`, `src/app/api/analytics/link-click/route.ts` |
| Tests/evidence | `tests/unit/analytics.test.ts`, `tests/e2e/analytics.spec.ts`, `docs/qa/phase-08-analytics.md` |

## Important modified files

- `(public)/layout.tsx`: feature context and page tracker; administrator route tree remains separate.
- Header, mobile navigation, homepage booking/review/location, Reviews, Location, and Contact: validated configured destinations use `TrackedExternalLink`; blank current configuration preserves disabled controls.
- `site.ts`, `navigation.ts`, `location.ts`, `contact.ts`, and `faqs.ts`: consume conditional normalized destination state without duplicating values.
- `supabase/service.ts`: validates its project URL before constructing the isolated privileged client.
- `playwright.config.ts`: enables analytics only for the local browser-test server.
- `.env.example` and project/directory documents: actual activation, privacy, blocker, and rate-limit contracts.

## Data minimization audit

| Category | Treatment |
| --- | --- |
| Visitor/session identity | Random RFC UUIDs only; no name, email, phone, Auth ID, hardware value, or deterministic derivation |
| Raw IP | Never read, logged, stored, included in schema, or used as a rate-limit key |
| Exact location | Not collected; no GPS/browser-geolocation API |
| Fingerprinting | No canvas, audio, font, plugin, screen-resolution, hardware-concurrency, or composite fingerprint |
| User agent | Used transiently in the browser for one coarse enum; raw value never dispatched |
| Path | Exact implemented public path only; query, hash, backslash, protocol-relative, unknown, API, and admin paths rejected |
| Referrer | HTTP(S) origin only; path/query/hash/credentials discarded before request and again before insert |
| External links | Exact normalized configured destination/type only; arbitrary public request URLs rejected |
| Logs | Event kind and fixed reason only; no payload, identifier, destination, referrer, error object, IP, credential, or stack |

## Endpoint response contract

| Condition | Status | Storage attempted |
| --- | --- | --- |
| Analytics flag not exactly true | `204` | No |
| Cross-origin browser request | `403` | No |
| Invalid JSON/schema/path/destination | `400` | No |
| Body over 4 KiB | `413` | No |
| Non-JSON media type | `415` | No |
| Global/per-visitor window exceeded or bucket capacity full | `429` | No |
| Valid request; storage absent/fails | `202` | Attempted only when client exists; safe drop |
| Valid request inserted | `201` | Yes |

Every response is private/no-cache/no-store. Response bodies are empty and reveal no configuration, schema, payload, or provider error detail.

## Commands and actual results

| Check | Command / method | Actual result | Status |
| --- | --- | --- | --- |
| Lint | `npm run lint` | Exit 0 | Pass |
| Strict types | `npm run typecheck` | Exit 0 | Pass |
| Unit/contract tests | `npm run test` | 4 files, 30 tests passed | Pass |
| Full browser regression | `npm run test:e2e` | 40 passed; 2 Phase 7 live-auth checks skipped | Pass for runnable checks |
| Focused analytics browser QA | `npx playwright test tests/e2e/analytics.spec.ts` | 5 passed | Pass |
| Production build | `npm run build` | Public pages static; two analytics handlers/admin routes dynamic; Proxy present | Pass |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities | Pass |
| Lockfile/install shape | `npm ci --dry-run` | Exit 0; optional platform packages resolved | Pass |
| Browser identifiers | Intercepted page-view request plus cookie/storage inspection | Random valid IDs, visitor/session stable on reload, SameSite=Lax, >300-day expiry | Pass |
| Referrer privacy | Cross-origin referrer containing path/query/hash | Browser payload contained origin only | Pass |
| Rerender/navigation | Intercepted tracker during root render and route transition | Exactly one event per completed pathname; no rerender duplicate | Pass |
| Administrator exclusion | Intercepted `/admin/login` load | 0 analytics requests and no analytics session storage | Pass |
| Failure isolation | Aborted page-view requests during browsing/navigation | Public content and internal navigation remained usable | Pass |
| Endpoint rejection | Live local POST probes | Valid/no-storage `202`; admin path `400`; arbitrary link `400`; wrong media `415`; oversized `413`; cross-origin `403` | Pass |
| Bundle/secret scan | Static client/server import and marker scan | Privileged/test keys absent from browser bundles; service client remains server-only | Pass |
| Encoding | Numeric-code-point UTF-8 scan | 185 UTF-8 text files inspected; 0 replacement/mojibake files | Pass |
| Privacy | In-memory PDF private-contact comparison | 2 private source patterns extracted; 0 source/build files contain either | Pass |
| Live Supabase page-view insert/read | Configured test project required | No project/service key supplied | Blocked |
| Live Supabase link-click insert/read | Configured approved destination and test project required | Neither supplied | Blocked |
| Production HTTPS cookie | Deployed HTTPS origin required | No deployment yet | Blocked |
| Distributed rate enforcement | Approved provider/WAF configuration required | No provider/policy supplied | Blocked |

## Issues found and fixed

1. The initial browser referrer check expected a value after reload, but browsers can preserve a null referrer. The test now supplies a controlled cross-origin referrer and proves only its origin leaves the browser.
2. The controlled Referer header temporarily blocked a reload in Chromium. The header is removed before the reload identity-persistence check; privacy and persistence assertions remain independent.
3. Cookie/storage access needed to be failure-isolated as rigorously as network delivery. UUID creation, cookie reads/writes, and session storage now all have safe no-throw fallback behavior.
4. A prefix media-type comparison could have accepted strings beginning with `application/json`. Parsing now compares the exact lowercased media type before parameters.
5. Same-site browser requests were not initially distinguished from cross-site inflation attempts. Both handlers now reject mismatched `Origin` and `Sec-Fetch-Site: cross-site` before body parsing/rate/storage work.
6. Service-client creation sat just outside the failure boundary. It is now caught and degraded to the same safe storage-unavailable response.

## Live verification required before production collection

1. Start the local Supabase stack or link an approved non-production project; apply/lint all Phase 6 migrations and verify service-role insert grants.
2. Set `ANALYTICS_ENABLED=true`, the exact project URL, and the server-only secret/service key only in ignored local/CI environment storage; rebuild the static public pages.
3. POST one synthetic page view through the endpoint, expect `201`, query it through an approved administrator, and verify every stored value matches the minimized payload.
4. Configure one owner-approved non-production `.invalid`/test external destination through the matching public variable, rebuild, click it, confirm navigation is immediate, and verify one exact type/destination/source event.
5. Prove anon/browser Supabase inserts and all reads still fail; only the validated endpoint's privileged client may insert.
6. Exercise per-visitor/global rate thresholds and verify `429` produces no insert. Repeat through multiple deployed instances after selecting a distributed/WAF control.
7. Verify the production HTTPS visitor cookie is first-party, Path `/`, SameSite=Lax, `Secure`, and expires within the documented 365-day maximum.
8. Verify `ANALYTICS_ENABLED=false` after a rebuild produces no cookie, session storage, request, or insertion.
9. Approve/document analytics retention and publish the truthful Privacy page before launch.

## Primary references reviewed

- Next.js App Router Route Handlers: <https://nextjs.org/docs/app/getting-started/route-handlers>
- MDN `navigator.sendBeacon()`: <https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon>
- Supabase secure data/key guidance: <https://supabase.com/docs/guides/database/secure-data>
- Supabase isolated privileged server client guidance: <https://supabase.com/docs/guides/troubleshooting/performing-administration-tasks-on-the-server-side-with-the-servicerole-secret-BYM4Fa>

No known credential-independent code defect blocks Phase 8 completion. Live inserts, real configured-link delivery, HTTPS cookie issuance, and distributed rate enforcement remain mandatory and must not be inferred from static/local failure-mode tests.
