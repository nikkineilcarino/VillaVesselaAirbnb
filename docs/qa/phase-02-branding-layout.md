# Phase 02 QA — Branding and Public Layout

## Scope tested

- XML validity and browser delivery of the editable SVG logo family
- Dark/light horizontal logos, dark/light marks, and favicon metadata
- Shared public route-group layout, sticky header, and footer
- Truthful active/upcoming navigation states and disabled Airbnb state
- Desktop and mobile responsive rendering
- Mobile dialog open/close, initial focus, focus trap, Escape, focus restoration, scroll lock, and close-after-navigation
- Existing root access, skip link, mobile overflow, and 404 behavior
- Automated accessibility scan
- Lint, strict TypeScript, unit tests, production build, dependency audit, and privacy/configuration scans

## Environment

- Test date: 2026-07-23
- Node.js: `v22.18.0`
- npm: `10.9.3`
- Next.js: `16.2.11`
- React: `19.2.8`
- Playwright Chromium: `1.61.1`
- Axe Playwright: `4.12.1`
- Tested viewports: 1440×1000 desktop and 390×844 mobile

## Commands and results

### SVG structure

```powershell
$files = Get-ChildItem -LiteralPath 'C:\VillaVesselaAirbnb\public\logo' -Filter '*.svg'
foreach ($file in $files) {
  $xml = New-Object System.Xml.XmlDocument
  $xml.Load($file.FullName)
  if ($xml.DocumentElement.LocalName -ne 'svg') { throw "Invalid SVG" }
}
```

- **Expected:** all six assets parse as XML with an SVG root.
- **Actual:** `favicon.svg`, three horizontal logo files, and two mark files returned `VALID`.
- **Result:** Passed.

### Lint and strict types

```powershell
npm run lint
npm run typecheck
```

- **Expected:** no source/configuration diagnostic and no stale route import.
- **Actual:** both commands exited successfully after the documented fixes.
- **Result:** Passed.

### Unit tests

```powershell
npm run test
```

- **Expected:** existing shared utility behavior remains stable.
- **Actual:** 1 file and 2 tests passed.
- **Result:** Passed.

### Browser and accessibility tests

```powershell
npm run test:e2e
```

- **Expected:** all foundation checks pass; public header/footer expose only implemented destinations; the mobile menu controls focus and scroll correctly; every SVG asset and favicon loads; Axe reports no automatically detectable violation.
- **Actual:** 9 Chromium tests passed. Axe returned an empty violations array. The final run contained no application/router error.
- **Result:** Passed.

### Production build

```powershell
npm run build
```

- **Expected:** the public route group compiles and `/` plus `/_not-found` remain statically generated.
- **Actual:** Next.js compiled successfully, strict TypeScript passed, and both routes were emitted as static content.
- **Result:** Passed.

### Dependency audit

```powershell
npm audit
```

- **Expected:** no known dependency finding.
- **Actual:** `found 0 vulnerabilities`.
- **Result:** Passed.

### Visual inspection

```powershell
npx playwright screenshot --viewport-size="1440,1000" --full-page http://localhost:3000 test-results/phase-02-desktop.png
# A local Playwright Chromium script opened the mobile menu before capturing:
# test-results/phase-02-mobile-menu.png
```

- **Expected:** horizontal logos remain clear, the desktop navigation fits without overlap, footer columns remain readable, and the mobile drawer fits without horizontal clipping.
- **Actual:** desktop and open-menu mobile screenshots were inspected. Logo variants rendered, header content fit at 1440px, the footer remained structured, and the 390px drawer showed all entries, status badges, close control, and disabled booking state without clipping. The Next development indicator visible during inspection is not production UI.
- **Result:** Passed for the tested viewports.

### Privacy and destination integrity

The repository and built output were scanned using the two private caretaker patterns supplied in the source package; those patterns are intentionally redacted from this report. Source was also checked for populated service-role assignments, script/remote references inside SVG, and active unverified external booking links.

- **Expected:** no private number, populated privileged key, executable/remote SVG content, or active unverified external booking destination.
- **Actual:** no prohibited match. Browser tests also confirmed that Airbnb is a disabled button and the only enabled primary navigation destination is Home.
- **Result:** Passed.

## Issues found and fixes

### State update inside a React effect

- **Issue:** the first lint run rejected a synchronous route-change `setState` in the mobile menu effect.
- **Fix:** removed the redundant effect; the link click handler already closes the menu.
- **Retest:** lint and all mobile-menu browser tests passed.

### Stale development route types

- **Issue:** after moving `src/app/page.tsx` into the `(public)` route group, the old `.next/dev` validator still imported the removed path.
- **Fix:** regenerated production route types and refreshed the development validator through a normal Next development request.
- **Retest:** strict typecheck and production build passed.

### Concurrent development prefetch warning

- **Issue:** the first passing nine-test run logged a Next internal router-initialization error while multiple workers automatically prefetched the only current route.
- **Fix:** disabled prefetch on Home links because prefetching the already-current sole route provides no benefit.
- **Retest:** all nine Chromium tests passed without the router error.

### Invalid first SVG safety probe

- **Issue:** the first final-gate SVG scan had a malformed quoted regular expression, and its wrapper did not distinguish the scanner error from a no-match result.
- **Fix:** split the patterns into separate `rg -e` expressions and explicitly treated exit code 1 as “no matches,” exit code 0 as unsafe content found, and any other code as a scanner failure.
- **Retest:** the corrected scanner completed successfully and found no script, event-handler, or remote-reference pattern.

## Remaining limitations

- The `/` content is a Phase 2 status placeholder, not the complete homepage.
- All public navigation destinations except Home remain disabled until their implementation phases.
- The Airbnb action remains disabled because the complete listing URL is not confirmed.
- Current brand colors follow the supplied palette but still await owner approval.
- There is no official property photography yet.
- Playwright emits an environment-owned `NO_COLOR`/`FORCE_COLOR` terminal notice; it does not affect browser or application behavior.
- Supabase, administrator access, analytics, inquiries, and deployment are outside this phase.
- The workspace is not connected to Git.

## Overall status

**QA passed for Phase 2.** The editable identity and shared public shell are responsive at the tested viewports, keyboard-operable, automatically accessibility-checked, truthful about unavailable destinations, privacy-safe, audit-clean, and production-buildable. No Phase 3 homepage sections were implemented.
