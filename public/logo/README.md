# Villa Vessela Logo Assets

## Purpose

This directory stores the editable, local SVG identity and its mechanically rasterized web-app icons. The concept combines an intertwined VV with three individual sampaguita flowers above the monogram and three below it.

## Assets

- `villa-vessela-logo.svg` — primary horizontal master for light backgrounds.
- `villa-vessela-logo-dark.svg` — explicit dark-text horizontal variant.
- `villa-vessela-logo-light.svg` — horizontal variant for dark backgrounds.
- `villa-vessela-mark.svg` — standalone emblem for light backgrounds.
- `villa-vessela-mark-light.svg` — standalone emblem for dark backgrounds.
- `favicon.svg` — simplified small-size mark.
- `apple-touch-icon.png` — 180 × 180 touch icon rendered from the emblem.
- `web-app-icon-192.png` and `web-app-icon-512.png` — manifest icons rendered from the same emblem.

## Interactions

`src/components/branding/VillaLogo.tsx` selects the correct asset and preserves intrinsic dimensions. `src/components/branding/logoAssets.ts` applies one shared revision query so browsers fetch approved artwork immediately after a logo update. Root metadata exposes `favicon.svg` and the Apple icon; the web manifest references both web-app icon sizes.

## Adding or changing assets safely

Keep the `viewBox`, title, description, palette, and intrinsic aspect ratio intentional. Use local vector shapes only. After changing `villa-vessela-mark.svg`, regenerate all three PNGs as exact mechanical renders. Parse SVGs as XML, inspect raster dimensions, request every asset through Next, run browser/accessibility tests, and review header, footer, menu, favicon, and installed-app sizes.

## Restrictions

- Keep `VV` as the monogram unless the owner approves another mark.
- Do not embed scripts, remote images, fonts, tracking pixels, or private metadata.
- Do not use copyrighted third-party logos or generic property photography.
- Do not remove accessible titles/descriptions from standalone assets.

## Environment variables

None. All files are static and local.

## Testing

Validate XML structure, SVG/PNG media responses, exact raster dimensions, favicon/manifest metadata, transparent backgrounds, light/dark contrast, and visual clarity at small sizes.

## Security and privacy

SVGs are treated as code-like assets: review external references, event attributes, scripts, and metadata before acceptance. These files currently contain none.

## Files requiring careful review

Every SVG is a public brand master; the PNGs are derived release assets. Filename changes require corresponding component and metadata updates; geometry/palette changes require owner review, icon regeneration, and full visual QA.
