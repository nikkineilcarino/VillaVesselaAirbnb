# Airbnb and Facebook activation — 2026-07-27

## Authority and scope

The owner supplied and approved these public destinations on 2026-07-27:

- Airbnb room `5499747`
- Facebook page `VESSELACARINO12`

The supplied Airbnb URL included a transient `source_impression_id` query. Production uses the stable canonical room path for the same listing and does not publish that tracking parameter.

This approval does not activate Messenger, WhatsApp, Google Maps, owner telephone/email, inquiry collection, analytics storage, or Supabase-backed administration.

## Implementation boundary

- `NEXT_PUBLIC_AIRBNB_URL` and `NEXT_PUBLIC_FACEBOOK_URL` remain the single production configuration inputs.
- Both inputs require complete credential-free HTTPS URLs and fail closed when blank or malformed.
- Active links use the existing exact-destination allowlist and privacy-safe aggregate link types.
- Airbnb booking buttons become links throughout the header, mobile navigation, homepage, Reviews page, and Contact page.
- Facebook becomes an active, correctly labelled Contact option.
- Contact actions distinguish booking, social, and telephone behavior instead of reusing a telephone-only label.

## Verification required for release

- ESLint, strict TypeScript, 67 unit tests, production build, and the credential-independent Chromium suite.
- Configured-mode checks for exact Airbnb/Facebook destinations, Contact labels, mobile focus order, accessibility, Privacy, and absence of unapproved external links.
- Fail-closed checks with both new variables blank.
- Vercel environment confirmation, Ready deployment, canonical-alias promotion, hosted browser checks, and route/security-header checks.
