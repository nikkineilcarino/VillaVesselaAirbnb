# Public Layout Components

## Purpose

This directory owns the shared public header, navigation, mobile menu, and footer. It does not own administrator navigation or page-specific content.

## Files and responsibilities

- `Header.tsx` composes the home logo link, desktop navigation, disabled booking state, and mobile trigger.
- `DesktopNavigation.tsx` shows the typed navigation model at large viewports and marks the current route.
- `MobileNavigation.tsx` owns dialog visibility, focus trapping/restoration, Escape handling, scroll locking, and close-after-navigation behavior.
- `Footer.tsx` provides the verified address, public navigation state, booking-link status, Privacy link, and independent-site disclaimer.

## Interactions

The public route-group layout composes `Header` and `Footer`. Both read `src/data/navigation.ts`; logo presentation comes from `src/components/branding`. Only the mobile menu and desktop current-route detection are client boundaries.

## Adding functionality safely

Activate a navigation entry only after its route exists and passes public-access checks. Preserve visible and programmatic disabled states for missing destinations. When adding controls to the mobile dialog, keep them inside the focus-trap query and rerun keyboard tests.

## Restrictions

- Do not activate incomplete or unverified destinations.
- Do not add admin links to the public layout.
- Do not remove the visible mobile close control, Escape handling, focus restoration, or body-scroll cleanup.
- Do not treat hidden navigation as authorization.

## Environment variables

No layout component reads environment variables directly. The verified Airbnb destination enters through validated public configuration, and blank or malformed configuration retains the disabled state.

## Testing

Run Playwright at desktop and mobile sizes, including dialog focus order, Escape, scroll lock, close-after-navigation, disabled states, and footer rendering. Run Axe and manually inspect focus, responsive wrapping, and both logo tones.

## Security and privacy

The footer and menu must never expose unapproved caretaker details or unverified owner contacts. Disabled URLs remain non-links so analytics and navigation cannot receive arbitrary destinations.

## Files requiring careful review

`MobileNavigation.tsx` has global body and focus effects. `Header.tsx` and `Footer.tsx` appear on every public route. Changes require full public-shell regression tests.
