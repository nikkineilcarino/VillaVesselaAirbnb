# Privacy-safe Analytics

## Data model

The browser creates a random UUID visitor cookie (`vv_visitor_id`) for at most 365 days and a separate session UUID in `sessionStorage`. The session rotates after 30 minutes of inactivity. IDs are never derived from names, hardware, IP addresses, exact location, or a browser fingerprint.

Only the nine implemented public paths, including Privacy, origin-only HTTP(S) referrers, and coarse device/browser categories are accepted. Administrator routes are outside the public route group and cannot mount the page tracker. External-link events must exactly match a normalized owner-configured destination and supported type.

## Server boundary

Both POST Route Handlers reject cross-origin browser requests, require JSON no larger than 4 KiB, validate with Zod, apply bounded rate limits, and insert through the isolated server-only privileged client. Responses are private/no-store. Invalid, oversized, arbitrary-destination, and over-limit requests fail without database access. Storage failures produce one payload-free warning per event/reason and never break the public UI or navigation.

Per-visitor and global fixed-window limits are in-process and retain only random visitor IDs temporarily. They deliberately do not retain raw IP addresses. Because serverless requests can reach multiple instances, final deployment hardening must add an approved distributed limiter/WAF rule without storing raw IPs; the current limiter is a bounded application baseline, not a claim of globally atomic enforcement.

## Browser delivery

`PageViewTracker` uses a keepalive fetch after completed public route navigation and suppresses effect re-renders. `TrackedExternalLink` calls `sendBeacon` where available, falls back to keepalive fetch, and never prevents the anchor's native navigation. Failed storage, blocked cookies, disabled storage, network errors, and analytics-disabled mode all fail silently for visitors.
