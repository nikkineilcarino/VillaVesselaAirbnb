# Homepage Components

## Purpose

This directory owns the composed sections of the public Villa Vessela homepage. The route stays a small Server Component that orders these sections; canonical property facts remain in `src/data/`.

## Current responsibilities

- `HeroSection.tsx`, `TrustIndicators.tsx`, and `PropertyHighlights.tsx` establish the property promise, supplied listing signals, and standard capacity facts.
- `AboutPreview.tsx`, `AccommodationPreview.tsx`, and `AmenitiesPreview.tsx` summarize the setting, layout, and practical features while retaining source qualifications.
- `GalleryPreview.tsx` presents a responsive placeholder collage; it must never imply that its illustrations are official property photographs.
- `ReviewsPreview.tsx` presents the supplied Airbnb summary/excerpts with attribution and a non-endorsement note.
- `LocationPreview.tsx` presents confirmed address/direction text beside a non-navigational illustration and disabled map action.
- `AttractionsPreview.tsx` uses condition-aware language for nearby activities.
- `BookingCTA.tsx` closes the page without activating the unverified Airbnb destination.
- `SectionHeading.tsx` centralizes accessible heading styling for light and dark sections.

## Safe extension

Read facts from a focused typed data module, preserve every uncertainty qualifier, and default to Server Components. Add client-side code only for a real browser interaction. Future standalone routes may reuse content, but should not make homepage components responsible for full-page detail views.

## Restrictions

- Do not hardcode contact details, prices, destination URLs, expanded capacity, service guarantees, or unconfirmed inclusions.
- Do not turn disabled booking, review, or map controls into links until the full owner-approved destination is configured and tested.
- Do not remove placeholder labels, captions, or accurate alternative text until an approved image replaces the illustration.
- Do not imply Airbnb endorsement or present supplied rating/review information as live data.

## Testing and review

Run lint, strict types, `tests/e2e/homepage.spec.ts`, the full Axe scan, the production build, and desktop/mobile visual checks after layout or copy changes. Re-audit changed facts against the project package and `CONTENT_TODO.md`.

## Privacy and security

Everything rendered here is public. Never import private operational contacts, secrets, visitor identifiers, or arbitrary external URLs. Public rendering must remain independent of future database and analytics availability.
