# Phase 12 QA — Final release and deployment

> **Historical snapshot.** This report records the original non-collecting public release. Supabase administrator activation and consent-based analytics were completed later on 2026-08-10; see [`admin-activation-2026-08-10.md`](admin-activation-2026-08-10.md) and [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). Inquiry submission remains disabled.

**Date:** 2026-07-23  
**Status:** Public release QA passed; Supabase-dependent acceptance criteria blocked

## Published release

| Item | Verified value |
| --- | --- |
| GitHub repository | `https://github.com/nikkineilcarino/VillaVesselaAirbnb` |
| Branch | `main` |
| Initial source commit | `01ff8a998b6a4d65532870770d368e4dcf5ff29e` |
| Vercel configuration commit | `d6978d2ba9fd485316f1d29513b776495a539ed6` |
| Application release commit | `8275f9840d3bc306bddf2d7bfd697d69da776be7` |
| Commit attribution | GitHub user `nikkineilcarino` as author and committer |
| Vercel team | `nikkineilcarino-2938s-projects` |
| Vercel project | `villa-vessela-airbnb` |
| Production alias | `https://villa-vessela-airbnb.vercel.app` |
| Final deployment ID | `dpl_2GNFhHcpounFYihPng2hDvSYE7Hi` |
| Deployment state | Ready; target `production`; alias confirmed by Vercel inspection |
| Runtime/build line | Node `22.x`, Next.js `16.2.11` |

The documentation evidence commit follows the application release commit and does not change production inputs: `.vercelignore` excludes documentation and tests from the provider upload.

## Production configuration

The project has exactly three reviewed production variables:

1. `NEXT_PUBLIC_SITE_URL=https://villa-vessela-airbnb.vercel.app`
2. `ANALYTICS_ENABLED=false`
3. `CONTACT_INQUIRY_ENABLED=false`

No Supabase URL/key, service-role secret, test account, caretaker contact, booking/contact/map destination, or other unresolved value was configured. Vercel local link state, its generated OIDC environment file, build output, dependencies, browser reports, and test artifacts remain ignored by Git and excluded from deployment upload.

## Final automated results

| Check | Actual result | Status |
| --- | --- | --- |
| Lint | `npm run lint`; zero errors and warnings | Pass |
| Strict types | `npm run typecheck` | Pass |
| Unit tests | 9 files, 67 tests | Pass |
| Local default Chromium suite | 47 passed; 2 credential-dependent live administrator checks explicitly skipped | Pass with documented skips |
| Enabled inquiry Chromium branch | 3 passed against the intentionally enabled local test mode | Pass |
| Production Chromium suite | 39 passed on the stable production alias after the final Node 22 deployment | Pass |
| Local production build | Next.js 16.2.11; 14 static outputs generated and intended dynamic routes retained | Pass |
| Vercel production build | Node 22; 166 reviewed deployment files; compile, types, 14 static outputs, and deployment promotion succeeded | Pass |
| Dependency audit | 0 vulnerabilities | Pass |
| Lockfile install simulation | `npm ci --dry-run --ignore-scripts` | Pass |
| Vercel upload inspection | Next.js framework; required Supabase server modules retained; local env, reports, results, cache, docs, tests, and root Supabase workspace excluded | Pass |
| Public route scan | 9 routes tested; 9 returned 200 | Pass |
| Browser payload/privacy scan | 16 unique public scripts; 0 private-contact matches; 0 service-role/privileged-client markers | Pass |
| Public link scan | 0 active external links because no destination is approved | Pass |
| Production analytics state | 0 `vv_*` cookies; analytics POST routes return no-op 204 | Pass |
| Production inquiry state | Contact form remains disabled and contact POST returns 404 | Pass |
| Protected-route state | Dashboard, inquiries, and export URLs return fixed 307 redirects to `/admin/login` | Pass |
| Administrator response | Login is public but `noindex, nofollow`, private/no-store, has no registration, and exposes no configuration detail | Pass |
| UTF-8 release scan | 245 non-ignored release text files; 0 invalid UTF-8 and 0 mojibake-marker files | Pass |
| Private-contact comparison | 2 private patterns from the supplied PDF; 0 matches across 246 workspace source-text files, 1,372 bounded build files, and deployed HTML/JavaScript | Pass |
| Populated-secret scan | 0 populated service-role or test-password assignments in release text; 0 privileged marker in deployed scripts | Pass |

## Production browser coverage

The 39 production tests cover:

- all nine public routes plus the accessible 404;
- desktop and 390 px mobile rendering without horizontal overflow;
- keyboard skip link, mobile-menu focus trap/restoration, and gallery lightbox keyboard lifecycle;
- exact supplied facts, uncertainty wording, placeholders, inactive booking/contact/map destinations, and review provenance;
- address clipboard behavior under an explicit production-origin browser permission;
- Axe scans on the public shell, information/discovery routes, Privacy, and administrator login;
- unique titles/descriptions, production canonical/Open Graph URLs, Twitter metadata, parseable verified-fact JSON-LD, breadcrumbs, sitemap, robots, manifest, social image, and exact web-app icon dimensions;
- reduced motion, focus visibility, static caching, CSP, HSTS, frame/MIME/referrer/permissions/cross-origin headers, and administrator private/noindex headers.

Desktop and full mobile production screenshots were inspected. The layout, placeholder labelling, navigation, visual hierarchy, and responsive stacking remain intact.

## Corrective findings during release QA

No failed result was silently reclassified:

1. An early browser invocation lost its locally managed Next.js process and produced connection-refused artifacts. It was discarded as infrastructure output; a supervised server and the final direct runner produced the exact 47-pass/2-skip result.
2. A supervised diagnostic run initially omitted the analytics test flag and therefore returned disabled 204 responses where analytics tests expected 202. The correct Playwright environment was restored before the definitive local suite.
3. The first production suite reported 36 passes and 3 failures. Two checks constructed canonical/sitemap expectations from hard-coded localhost, and the clipboard permission grant also named localhost. The deployed values were already the correct HTTPS origin. Tests were made origin-aware; local regression returned 47 passes/2 live skips, and both subsequent production runs returned 39/39 passes.
4. The first Vercel build succeeded on the team’s Node 24 default but warned that the broad engine range could auto-upgrade major versions. The project engine was pinned to audited Node `22.x`; the final deployment rebuilt without that warning and Vercel confirmed the version change.
5. The first deployment dry run exposed that provider upload rules would include local browser reports/cache and that an unanchored `supabase` ignore could exclude required server client modules. The final anchored allowlist retains all required application modules and excludes only non-runtime artifacts.

## Production headers and indexing

The final root response returns 200 with:

- a same-origin CSP with no production `unsafe-eval` or third-party resource origin;
- HSTS `max-age=63072000; includeSubDomains`;
- frame denial, MIME protection, strict-origin referrer policy, restricted browser permissions, same-origin opener/resource policies, and origin-agent isolation;
- no `X-Powered-By` response header.

`robots.txt` allows public crawling, disallows `/admin/` and `/api/`, and names the exact production host/sitemap. The sitemap contains the nine production HTTPS URLs and no private/API route. Administrator login responses remain private/no-store and `noindex, nofollow`.

## Blocked acceptance criteria

The public-information release is live and verified, but these package criteria remain blocked rather than passed:

1. Apply/lint the seven Supabase migrations and regenerate/review database types.
2. Execute anonymous, arbitrary authenticated, approved administrator, and service-role RLS/privilege probes.
3. Provision dedicated approved/unapproved test identities and verify login, logout, session refresh, cookies, dashboard, inquiries, status updates, and exports.
4. Insert/read back live page views, link clicks, and inquiries; verify distributed rate limiting, outage behavior, reconciliation, and deletion.
5. Approve retention/deletion schedules, a privacy-request channel, provider review, operational ownership, and any required consent control.
6. Supply and approve official photography, public booking/contact/map destinations, rates, conditional inclusions, and richer structured-data eligibility.

Analytics and inquiries must remain false until their independent activation gates in `docs/DEPLOYMENT.md` pass.

## Reproducibility and rollback

`docs/DEPLOYMENT.md` records the clean-checkout gate, exact target project/team, environment contract, ordered database activation, production checks, immutable-deployment rollback, forward-fix policy for database changes, and current support limits. Vercel’s previous immutable deployment remains available for rollback; Git history must be reverted with a new commit rather than force-pushed.

## Primary references reviewed

- Vercel CLI deployment: <https://vercel.com/docs/cli/deploy>
- Vercel project linking: <https://vercel.com/docs/cli/project-linking>
- Vercel environment variables: <https://vercel.com/docs/cli/env>
- Vercel static project configuration: <https://vercel.com/docs/project-configuration/vercel-json>
- Next.js metadata and social images: <https://nextjs.org/docs/app/getting-started/metadata-and-og-images>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- OWASP Secure Headers Project: <https://owasp.org/www-project-secure-headers/>
