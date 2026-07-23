# Location Components

## Purpose

This directory owns small browser interactions for the public location route. Confirmed address and direction data remain in `src/data/location.ts`.

## Current component

`CopyAddressButton.tsx` writes only the displayed textual address to the clipboard and announces success or a safe fallback. It does not access GPS, geolocation, or an unverified map destination.

## Interactions and configuration

The public route passes the canonical address from `src/data/location.ts`. The component reads no environment variable, uses only the browser Clipboard API after a visitor click, and has no server/database interaction.

## Restrictions and testing

Do not add coordinates, map URLs, or tracking here until their owning data and analytics phases approve them. Test clipboard success/failure messaging, keyboard access, Axe, and the no-unverified-link safeguard.

## Security, privacy, and careful review

Clipboard error messages must remain non-revealing, and no location permission should be requested. Review `CopyAddressButton.tsx` carefully when changing its browser API behavior or live-region messaging.
