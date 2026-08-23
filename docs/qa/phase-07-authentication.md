# Phase 7 QA — Administrator Authentication

> **Historical snapshot.** Production approved-administrator access, authenticated-unapproved denial, logout, and protected-route denial later passed on 2026-08-10; see [`admin-activation-2026-08-10.md`](admin-activation-2026-08-10.md) and [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). Forced token-expiry refresh remains a narrow follow-up rather than a claim in this earlier report.

## Status

**Completed with live-integration blockers.** The credential-independent implementation, access-denial behavior, accessibility, regression, production build, header, secret, privacy, and static security checks pass. Approved-admin sign-in/access/logout, authenticated-unapproved denial, live refresh, and issued-cookie inspection cannot run because no Supabase project or dedicated test credentials were supplied. Phase 7 is not labelled `QA passed` until those checks execute.

## Scope delivered

- Public, dynamic `/admin/login` with email/password only and no public registration, recovery, default password, or guest account flow.
- Bounded Zod validation and a Server Action that returns generic credential/approval failures.
- Next.js 16 `src/proxy.ts` matching `/admin/*`, early `auth.getClaims()` verification/refresh, response-cookie propagation, and fixed unauthenticated redirect.
- Independent protected-layout authorization using request-scoped `auth.getUser()` plus an RLS-visible `admin_profiles` row.
- Protected `/admin/dashboard` shell and responsive admin header; no Phase 9 analytics were implemented early.
- Server Action logout, safe notice allowlist, dynamic rendering, page/header noindex controls, and private/no-store production responses.
- Shared Supabase configuration validation plus SameSite=Lax and production-Secure cookie options.
- Manual Auth/profile provisioning guidance without a seeded identity or credential.

## Files added

| Area | Files |
| --- | --- |
| Request/auth boundaries | `src/proxy.ts`, `src/lib/supabase/config.ts`, `src/lib/supabase/proxy.ts`, `src/lib/auth/admin.ts`, `src/lib/auth/README.md` |
| Validation | `src/lib/validation/auth.ts`, `src/lib/validation/README.md` |
| Routes | `src/app/admin/layout.tsx`, `login/page.tsx`, `login/actions.ts`, `(protected)/layout.tsx`, `(protected)/actions.ts`, `(protected)/dashboard/page.tsx`, `loading.tsx`, `error.tsx`, `README.md` |
| Components | `src/components/auth/AdminLoginForm.tsx`, `src/components/auth/README.md`, `src/components/admin/AdminHeader.tsx`, `src/components/admin/README.md` |
| Tests | `tests/unit/auth.test.ts`, `tests/e2e/admin-auth.spec.ts`, `tests/e2e/admin-auth.live.spec.ts` |
| Evidence | `docs/qa/phase-07-authentication.md` |

## Files modified

- `package.json` / `package-lock.json`: exact Zod 4.4.3 dependency.
- `.env.example`: four blank test-only, non-production credential names; no value is committed.
- `next.config.ts`: `/admin/*` private/no-store/noindex response headers.
- Supabase browser/server clients: shared validated configuration and cookie policy.
- Root, app, library, Supabase, test, architecture, plan, checklist, content, decision, and changelog documentation.

## Access matrix

| Request state | `/admin/login` | `/admin/dashboard` | Evidence |
| --- | --- | --- | --- |
| No Supabase configuration/session | Public; form safely disabled | Fixed redirect to `/admin/login` | Browser and production-response checks pass |
| Invalid credentials | Remains on login with one generic error | Not applicable | Code/unit review; live provider response blocked |
| Valid Auth user without approved profile | Login action clears local session and returns the same generic error | Server profile query returns no authorized row | Code/RLS review pass; live identity blocked |
| Approved Auth user/profile | Redirects away to dashboard | Protected shell renders | Implementation review pass; live identity blocked |
| Signed-out approved user | Public login | Fixed redirect to login | Implementation review pass; live logout/revocation blocked |

## Security review

1. **Two gates:** Proxy refresh/identity is explicitly optimistic. The protected Server Component repeats identity and database authorization; hiding navigation is not a boundary.
2. **Fresh identity:** authoritative access uses `auth.getUser()` rather than trusting raw cookies or `getSession()` data. The proxy uses verified claims early enough to persist refreshed cookies.
3. **Database authorization:** ordinary server clients use the anon key and RLS. Only an approved `admin_profiles` row is visible. Authentication alone is insufficient.
4. **Fail closed:** missing/unsafe public configuration disables login and redirects protected requests. Remote non-HTTPS endpoints are rejected; documented local HTTP endpoints remain allowed for development.
5. **Redirect safety:** there is no accepted `returnTo`/`next` parameter. Redirect destinations are fixed internal paths.
6. **Input/error safety:** email/password are type/length bounded; raw validation/provider/database errors, credentials, tokens, user IDs, and stack details are not logged or rendered.
7. **Session/caching:** browser, server, and proxy clients share SameSite=Lax cookies with `Secure` in production. Administrator responses are private/no-store in production. Actual issued-cookie inspection remains a live blocker.
8. **Discoverability:** admin metadata and route response headers emit `noindex, nofollow`; this is search guidance, not authorization.
9. **Secret isolation:** auth code never imports the service-role client. Privileged/test credential markers are absent from `.next/static`; service-key access remains isolated to its `server-only` module.
10. **Registration:** no signup call, registration route/link, seed identity, fallback credential, or password literal exists.

## Commands and actual results

| Check | Command / method | Actual result | Status |
| --- | --- | --- | --- |
| Dependency | Exact Zod install | Zod 4.4.3 locked; audit zero findings | Pass |
| Lint | `npm run lint` | Exit 0 | Pass |
| Strict types | `npm run typecheck` | Exit 0 | Pass |
| Unit/contract tests | `npm run test` | 3 files, 18 tests passed | Pass |
| Browser regression | `npm run test:e2e` | 35 passed; 2 live-auth tests explicitly skipped | Pass for runnable checks; live blocked |
| Admin accessibility | Axe on completed mobile login UI | Zero violations | Pass |
| Responsive/visual | 390×844 and 1440×900 production screenshots | No observed overflow, clipping, overlap, or misleading active state | Pass |
| Production build | `npm run build` | Compiled; public routes static, login/dashboard dynamic, Proxy present | Pass |
| Production cache/search headers | `next start` plus response inspection | Login returns `private, no-cache, no-store, must-revalidate, max-age=0` and `X-Robots-Tag: noindex, nofollow` | Pass |
| Fixed redirect | Production request with malicious-looking `returnTo` | Final URL is exactly `/admin/login`; supplied destination absent | Pass |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities | Pass |
| Lockfile/install shape | `npm ci --dry-run` | Exit 0; optional platform packages resolved | Pass |
| Secret/import scan | Static and built-browser scans | 0 bundle secret-marker files, 0 privileged-client auth consumers, 0 auth console files, 0 `getSession()` files | Pass |
| Encoding | Numeric-code-point UTF-8 scan | 165 files inspected; 0 replacement/mojibake-marker files | Pass |
| Privacy | In-memory PDF contact comparison | 2 private source patterns extracted; 0 source files and 0 built files contain either pattern | Pass |
| Approved admin | Optional Playwright live test | No project/account values supplied | Blocked |
| Unapproved authenticated user | Optional Playwright live test | No project/account values supplied | Blocked |
| Refresh/logout/issued cookie | Live browser/session inspection | No project/account values supplied | Blocked |

Development-mode Next.js intentionally replaces configured cache output with its own `no-cache, must-revalidate`; the required private/no-store policy was therefore verified against the optimized production server separately.

## Issues found and fixed

1. The first Axe run found insufficient contrast on the 12px no-registration notice. Its text color was strengthened and the focused/full Axe checks passed.
2. The first browser cache assertion expected production headers from `next dev`. Route-wide headers were added to configuration, the development assertion was corrected to its real framework policy, and an independent production-server assertion confirmed private/no-store/noindex behavior.
3. An early accessibility check sometimes inspected the route loading state before the dynamic login heading appeared. The test now waits for the completed page heading before running Axe; it does not suppress any rule.
4. Supabase SSR defaults do not add `Secure` automatically. One shared cookie option now applies it in production while retaining local HTTP development support.

## Live verification required before deployment

1. Create/link an approved non-production Supabase project and apply/lint all Phase 6 migrations.
2. Create one dedicated Auth user, provision its exact UUID in `admin_profiles`, and create a second Auth user with no profile row. Do not use production identities.
3. Put the four `SUPABASE_TEST_*` values only in ignored local/CI secret storage and run the full Playwright suite against that environment.
4. Confirm the approved account leaves login, renders the dashboard, and is redirected away from login while authenticated.
5. Confirm the unapproved account receives the same generic login error, has its local session cleared, and cannot query profiles/data.
6. Shorten/expire the access token and verify request-proxy refresh persists replacement cookies without redirect loops.
7. Inspect issued cookies over HTTPS for `Secure`, SameSite=Lax, correct path/lifetime, and absence from cacheable shared responses.
8. Sign out, confirm Auth session revocation/current-browser cookie removal, and confirm a direct protected request redirects to login.
9. Repeat authorization alongside the Phase 6 anon/unapproved/admin/service RLS matrix before production deployment.

## Primary references reviewed

- Next.js Proxy convention and purpose: <https://nextjs.org/docs/app/getting-started/proxy>
- Next.js authentication/authorization guide: <https://nextjs.org/docs/app/guides/authentication>
- Supabase Next.js SSR tutorial: <https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs>
- Supabase server-side advanced guide: <https://supabase.com/docs/guides/auth/server-side/advanced-guide>
- Supabase `auth.getClaims()` reference: <https://supabase.com/docs/reference/javascript/auth-getclaims>

No known credential-independent code defect blocks Phase 7 completion. The live checks above remain mandatory and must not be inferred from static tests.
