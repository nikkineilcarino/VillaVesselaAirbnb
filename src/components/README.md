# Components

## Purpose

This directory contains reusable presentation and interaction modules. Components are grouped by meaningful feature, while small cross-feature primitives live in `ui/`.

## Current files and responsibilities

- `ui/Button.tsx` provides typed button variants and safe `type="button"` behavior by default.
- `ui/Card.tsx` provides neutral card structure without property content.
- `ui/Container.tsx` provides consistent responsive page gutters and width limits.
- `ui/SkipLink.tsx` provides keyboard access to the main landmark.
- `branding/` owns logo presentation and the restrained sampaguita divider.
- `layout/` owns the public header, desktop/mobile navigation, and footer.
- `home/` owns the eleven homepage sections and their shared section-heading treatment; it contains composition and presentation, not canonical facts.
- `public/` owns shared inner-page hero, section-heading, disclosure, and availability-label presentation for public information routes.
- `gallery/` owns responsive image loading/fallbacks, the category grid, and the focus-managed lightbox.
- `reviews/` owns the supplied rating summary, category breakdown, attributed review cards, and honest Messenger placeholders.
- `location/` owns the browser-only copy-address control.
- `forms/` owns the server-selected disabled inquiry fallback and the enabled, accessible submission workflow.
- `analytics/` owns the feature context, public path tracker, and native-navigation-preserving tracked external anchor.
- `seo/` owns the escaped Server Component JSON-LD renderer; fact construction remains in `src/lib/seo/`.
- `admin/` owns the authorized navigation, date filters, metric cards, aggregate-only charts, accessible chart tables, bounded server-rendered activity, fixed export links, and status-update pending control.

## Interactions

Components use `cn` from `src/lib/utils.ts` to merge conditional Tailwind classes. Route files compose these primitives, and feature components consume typed data contracts rather than owning canonical business facts. Analytics components receive only a boolean flag and public destinations; persistence stays server-side. SEO receives prebuilt verified-fact objects and escapes script-breaking markup. Dashboard charts receive only aggregate arrays from their authorized Server Component. The inquiry Client Component submits voluntary form values only to the same-origin endpoint and never receives database records.

## Adding functionality safely

Keep components semantic, keyboard accessible, and focused on one responsibility. Prefer composition and native HTML before adding JavaScript or a third-party widget. Document new variants, preserve ref/attribute compatibility when needed, and test reusable logic.

## Restrictions

- Do not fetch privileged data from generic presentation components.
- Do not embed unconfirmed property facts, contact details, or destination URLs.
- Do not mark a whole component tree as client-side for one small interaction.
- Do not add decorative motion without reduced-motion behavior.

## Environment variables

Presentational components should not read environment variables directly. Validated configuration is passed from a route or dedicated configuration module. No server-only variable may reach browser code.

## Testing

Use unit tests for behavior and variant logic, Playwright for browser interactions and keyboard flows, and manual review for focus, contrast, responsive layout, and assistive labels.

## Security and privacy

Components must not render secrets, internal database IDs, raw analytics identifiers, or private caretaker details. External-link components introduced later must accept only configured destinations and must not block navigation when tracking fails.

## Files requiring careful review

Shared primitives, modal/dialog code, analytics dispatchers, contact forms, administrator navigation, and dashboard chart/activity components have broad accessibility or security impact and should not be changed casually.
