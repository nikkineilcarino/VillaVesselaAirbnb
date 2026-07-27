# Gallery Components

## Purpose

This directory owns the interactive, public gallery grid and accessible lightbox. Gallery content and alternative text remain centralized in `src/data/gallery.ts`.

## Components

- `GalleryExperience.tsx` owns the active index and trigger restoration.
- `GalleryGrid.tsx` renders semantic image cards as labelled buttons.
- `GalleryLightbox.tsx` provides the modal dialog, focus trap, body-scroll lock, Escape, arrow-key, previous/next, and close behavior.
- `GalleryImage.tsx` wraps `next/image` with visible loading and safe failure states.

## Accessibility contract

Opening the lightbox moves focus to Close. Tab and Shift+Tab stay within the dialog; Escape closes it; Left/Right arrows move through images; closing restores focus to the exact card that opened it. The page beneath is not scrollable while the dialog is open.

## Interactions and configuration

The route passes typed `src/data/gallery.ts` records into `GalleryExperience`; no component reads environment variables or fetches remote data. `GalleryImage` receives only public local paths and marks the first grid candidate as priority while later grid images remain lazy. Grid thumbnails use a lower approved quality and precise responsive sizes; the contained lightbox retains the default higher quality.

## Safe extension

Add or replace items only through the typed gallery data. Approved photographs require permission, accurate alternative text, stable dimensions, responsive crop review, and removal of only the corresponding placeholder wording.

## Restrictions

- Do not imply that placeholders depict the property.
- Do not introduce remote images, scripts, or unverified media.
- Do not remove keyboard/focus behavior or make navigation depend only on swipe gestures.
- Do not place private guest/profile information in gallery assets or captions.

## Testing

Run the gallery Playwright flow, mobile overflow checks, Axe, image availability/fallback checks, lint, types, and production build. Manually inspect the grid and open dialog at desktop and mobile sizes.

## Files requiring careful review

`GalleryLightbox.tsx` and `GalleryExperience.tsx` require focused keyboard and cleanup review because a defect can strand focus or leave page scrolling locked. `GalleryImage.tsx` requires responsive loading, fallback, and contained-lightbox image checks.
