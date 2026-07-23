# Branding Components

## Purpose

This directory presents the original Villa Vessela identity without duplicating the editable source assets in `public/logo/`.

## Files and responsibilities

- `VillaLogo.tsx` maps full/mark and dark/light choices to stable SVG assets through Next Image.
- `SampaguitaDivider.tsx` provides a small decorative floral divider used sparingly in public layouts.

## Interactions

The header uses the prioritized dark horizontal logo, the mobile dialog uses the mark, and the footer uses the light horizontal logo. The components consume no property content or private configuration.

## Adding functionality safely

Add a logo format only after creating and validating its editable SVG source. Keep intrinsic dimensions accurate, preserve a readable accessible name, and test the asset at its actual smallest rendered size.

## Restrictions

- Use the approved `VV` monogram, not `VCV`, unless the owner explicitly changes the decision.
- Do not rasterize the master logo or replace it with generated stock branding.
- Do not overcrowd layouts with repeated flowers or waves.
- Do not put property claims or contact details inside logo artwork.

## Environment variables

None. Branding must render without runtime configuration or external network requests.

## Testing

Parse every SVG as XML, request assets through the application, verify image content types, inspect dark/light contrast, and visually review the mark and horizontal form on desktop and mobile.

## Security and privacy

Logo metadata must not contain author-system paths, personal contacts, or hidden tracking references. Assets are local and must not load scripts or third-party resources.

## Files requiring careful review

`VillaLogo.tsx` affects every public page. Changes to asset mapping, alt text, priority, intrinsic size, or filename require full shell and build retesting.
