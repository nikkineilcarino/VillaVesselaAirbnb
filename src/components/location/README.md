# Location Components

## Purpose

This directory owns browser interactions for the public location route and homepage preview. Confirmed address, directions, and normalized provider URLs remain in `src/data/location.ts`.

## Current component

- `CopyAddressButton.tsx` writes only the displayed textual address to the clipboard and announces success or a safe fallback.
- `InteractiveMaps.tsx` keeps third-party frames unloaded until a visitor chooses Google Maps or Waze, switches providers without loading both, and exposes bounded accessible zoom controls plus verified external navigation links.

## Interactions and configuration

The public route passes the canonical address and already-normalized map URLs from `src/data/location.ts`. Components read no environment variable directly. Clipboard and iframe loading occur only after visitor actions and have no server/database interaction.

## Restrictions and testing

Do not hardcode or accept arbitrary provider URLs here. Map configuration must pass the exact Google/Waze host-and-path validation boundary. Test clipboard success/failure messaging, provider switching, bounded zoom, keyboard access, mobile reflow, Axe, CSP frame sources, and the no-unverified-link safeguard.

## Security, privacy, and careful review

Clipboard error messages must remain non-revealing, and no location permission should be requested. Google/Waze frames must stay click-to-load so visitors can read the page without contacting either provider. Review both components carefully when changing browser APIs, live-region messaging, iframe permissions, CSP, or privacy wording.
