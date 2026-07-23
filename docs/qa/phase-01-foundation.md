# Phase 01 QA — Project Foundation

## Scope tested

- Exact dependency installation and peer compatibility
- Tailwind/PostCSS and semantic design-token compilation
- Strict TypeScript and import alias behavior
- ESLint configuration and current source quality
- Shared class utility behavior
- Public root route access without authentication
- Keyboard skip-link behavior
- Mobile overflow at 390×844
- Accessible 404 status and recovery link
- Production compilation and static route generation
- Dependency audit and source/build privacy scans
- Desktop and mobile visual inspection

## Environment

- Test date: 2026-07-23
- Operating system: Windows
- Node.js: `v22.18.0`
- npm: `10.9.3`
- Next.js: `16.2.11`
- React: `19.2.8`
- TypeScript: `6.0.3`
- ESLint: `9.39.5`
- Tailwind CSS: `4.3.3`
- Browser: Playwright Chromium `1.61.1`
- Timezone used by the workstation: Asia/Shanghai; planned business analytics timezone remains Asia/Manila

## Commands and results

### Dependency installation

```powershell
npm install
npm ci --dry-run
npm ls postcss sharp
npm audit
```

- **Expected:** locked packages resolve inside peer ranges; security overrides select PostCSS 8.5.22 and Sharp 0.35.3; audit reports no known findings.
- **Actual:** install and lockfile dry run completed; the dependency tree shows Next.js using the overridden patched packages; final audit reported `found 0 vulnerabilities`.
- **Result:** Passed.

### Lint

```powershell
npm run lint
```

- **Expected:** ESLint exits successfully with no current-source errors.
- **Actual:** exit code 0 with no diagnostics.
- **Result:** Passed.

### Strict TypeScript

```powershell
npm run typecheck
```

- **Expected:** strict type-checking and generated Next route types pass without emitting application files.
- **Actual:** exit code 0 after removing the deprecated `baseUrl` setting. A source scan also found no explicit `any` usage under `src` or `tests`.
- **Result:** Passed.

### Unit tests

```powershell
npm run test
```

- **Expected:** the shared class helper composes conditional values and resolves conflicting Tailwind utilities.
- **Actual:** 1 file passed; 2 tests passed.
- **Result:** Passed.

### Production build

```powershell
npm run build
```

- **Expected:** Next.js creates an optimized build and statically renders the foundation routes.
- **Actual:** compilation and TypeScript passed; `/` and `/_not-found` were generated as static content. Next.js made its mandatory JSX-mode adjustment from `preserve` to `react-jsx`; lint and typecheck passed again afterward.
- **Result:** Passed.

### Browser tests

```powershell
npm run test:e2e:install
npm run test:e2e
```

- **Expected:** Chromium is available and verifies public root access, no tested mobile overflow, keyboard skip-link navigation, and a real 404 response.
- **Actual:** 4 tests passed across 4 workers. The second run had no cross-origin warning after the test base URL was aligned to `localhost`.
- **Result:** Passed.

### Visual inspection

```powershell
npx playwright screenshot --viewport-size="1440,900" --wait-for-timeout=500 http://localhost:3000 test-results/foundation-desktop.png
npx playwright screenshot --viewport-size="390,844" --wait-for-timeout=500 http://localhost:3000 test-results/foundation-mobile.png
```

- **Expected:** the temporary foundation card remains legible, centered, and free of clipping/overlap at desktop and mobile sizes.
- **Actual:** both screenshots were inspected. Text remained readable; the card stayed inside the viewport; no overlap or horizontal clipping was observed. The small lower-left Next development indicator is tooling-only and is not part of production output.
- **Result:** Passed for the tested Phase 1 viewports.

### Privacy and secret scans

```powershell
# Exact private patterns were supplied to rg at execution time and are redacted here.
rg -n '<private-caretaker-patterns>|SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+' -g '!node_modules/**' -g '!.next/**' -g '!package-lock.json' .
rg -n '<private-caretaker-patterns>' .next
```

- **Expected:** no private caretaker number and no populated service-role assignment exists in source or built output.
- **Actual:** no private caretaker numbers were found. `.env.example` contains only the intentionally blank service-role variable declaration.
- **Result:** Passed.

## Issues found and fixes

### Unsupported registry-latest TypeScript

- **Issue:** TypeScript 7.0.2 exceeded `typescript-eslint`'s `<6.1.0` peer range, causing install warnings and preventing a valid first lockfile.
- **Fix:** pinned TypeScript 6.0.3, which is inside all declared ranges.
- **Retest:** dependency resolution and typecheck passed.

### Unsupported registry-latest ESLint

- **Issue:** ESLint 10.7.0 exceeded peer ranges declared by Next's bundled import, React, and accessibility plugins.
- **Fix:** pinned ESLint 9.39.5.
- **Retest:** install completed without peer overrides and lint passed.

### Dependency audit findings

- **Issue:** stable Next.js pinned vulnerable PostCSS 8.4.31 and allowed vulnerable Sharp 0.34.x; npm's automated fix suggested an unsuitable framework downgrade.
- **Fix:** retained stable Next.js and narrowly overrode PostCSS to 8.5.22 and Sharp to 0.35.3, matching patched dependency lines already used by the official next preview.
- **Retest:** `npm ls postcss sharp`, `npm audit`, lint, unit tests, browser tests, and production build passed; audit reported zero findings.

### Deprecated TypeScript option

- **Issue:** the first strict typecheck rejected deprecated `baseUrl` under TypeScript 6.
- **Fix:** removed `baseUrl`; the `@/*` path mapping remains relative to the root `tsconfig.json`.
- **Retest:** typecheck passed.

### Playwright development origin

- **Issue:** the first passing browser run used `127.0.0.1`, producing a Next development-resource origin warning.
- **Fix:** changed the default Playwright URL to `http://localhost:3000`.
- **Retest:** all browser tests passed without the cross-origin warning.

### Private values copied into QA command evidence

- **Issue:** a final repository-wide privacy scan found that the QA report itself contained the two private caretaker numbers inside an example `rg` command, even though application and build output were clean.
- **Fix:** redacted the literal patterns from the report while retaining the scan method and result.
- **Retest:** the full repository source/documentation scan found no private caretaker number, and no populated service-role assignment was found.

## Remaining limitations

- Playwright emits a harmless environment-owned `NO_COLOR`/`FORCE_COLOR` terminal warning; it does not affect application behavior or results.
- The root page is intentionally a foundation placeholder. Branding, navigation, the final homepage, and public content are not part of Phase 1.
- Error and loading states compile and were manually reviewed in source; only the 404 state has direct browser coverage in this phase.
- There is no Supabase project, authentication, database, analytics, inquiry processing, or production deployment yet.
- The workspace remains outside Git, so commit-history and CI checks are unavailable.
- Official media and approved production destinations remain outstanding in `CONTENT_TODO.md`.

## Overall status

**QA passed for Phase 1.** The Next.js foundation is runnable, strictly typed, lint-clean, unit-tested, browser-tested at the stated scope, audit-clean, and production-buildable. No Phase 2 branding or layout work has begun.
