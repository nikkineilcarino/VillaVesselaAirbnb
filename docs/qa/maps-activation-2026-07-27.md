# Google Maps and Waze activation — 2026-07-27

> **Historical snapshot.** Waze later received its own tracked reporting category and consent-based production analytics was activated on 2026-08-10; see [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md).

## Outcome

The production homepage and `/location` route now provide Google Maps and Waze views of one verified Villa Vessela property pin. Both maps remain unloaded until the visitor selects a provider, both have site-level keyboard-accessible zoom controls, and both provide a separate navigation action.

## Location evidence

- The public Waze place resolves the listing name `Beachfront Tondol Beach Villa Vessela` at `Tondol, Purok 2, Anda, Pangasinan, Philippines`.
- The Waze place data supplies the precise pin used by both provider configurations. The Google view uses the coordinates directly because the candidate Google Place ID rendered a world view during visual QA rather than resolving the property.
- Production screenshots confirmed that Google shows the Tondol beachfront road and Waze shows the matching coastal segment. The exact coordinates remain in environment configuration so all four URLs can be replaced together if the owner corrects the pin.
- The official business name/spelling on a standalone Google Maps business listing remains unconfirmed and is still tracked separately in `CONTENT_TODO.md`.

## Implementation and safeguards

- Added validated `NEXT_PUBLIC_GOOGLE_MAPS_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`, `NEXT_PUBLIC_WAZE_URL`, and `NEXT_PUBLIC_WAZE_EMBED_URL` slots.
- Google anchors/frames require `www.google.com/maps`; Waze navigation requires `waze.com` or `www.waze.com`, and Waze frames require `embed.waze.com/iframe`. Mismatched or arbitrary origins fail closed.
- No project-owned API key, billing credential, geolocation permission, or new backend is required.
- The Content Security Policy allows frames only from the exact Google Maps and Waze embed origins. Third-party scripts remain disallowed in the parent page.
- No iframe exists before a visitor click. The Privacy page explains the normal connection data shared after a provider is selected and confirms that the site does not request device location.
- Zoom is bounded to provider-supported ranges, works from labelled buttons, persists independently while switching providers, and remains usable with a keyboard.

## Verification

- Lint: passed.
- Strict TypeScript: passed.
- Unit tests: 68 passed, including provider-host rejection.
- Configured Chromium suite: 47 passed; 2 credential-dependent administrator checks explicitly skipped.
- Production build: passed.
- Production dependency audit: 0 vulnerabilities.
- Manual local visual inspection: Google and Waze both centered on the matching beachfront pin; a Google world-view fallback was caught and corrected before release.
- Focused production Chromium checks: 6 passed, covering provider opt-in/switching, zoom URL changes, exact external destinations, mobile overflow, Axe, and CSP.
- Production frame screenshots: both hosted provider frames rendered the matching Tondol beachfront location.

## Release evidence

- Application commit: `0be4519722583aa136112af18cbdd171c4f3e261`
- GitHub Quality run: `30247969809` — passed
- Vercel deployment: `dpl_EZua3dGkMF73dmdTKWfbsFeZJSCL` — Ready
- Production alias: `https://villa-vessela-airbnb.vercel.app`

Analytics and inquiry collection remain disabled. No Supabase or administrator credential was added.
