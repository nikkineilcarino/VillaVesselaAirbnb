# Airbnb and Facebook activation — 2026-07-27

> **Historical snapshot.** Consent-based production analytics was activated on 2026-08-10 and one approved Airbnb Contact action was used for exact live reconciliation; see [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). Destination values remain intentionally absent from Git.

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

## Verification

- ESLint, strict TypeScript, and 67 unit tests passed.
- The configured production build passed with the approved Airbnb/Facebook destinations and synthetic caretaker values.
- Configured Chromium: 47 passed; 2 credential-dependent live administrator checks skipped as designed.
- Focused fail-closed Chromium with all approved public destination variables blank: 31 passed.
- GitHub implementation commit: `dc3641192093dc22c8bd838ea1137d607a050520`.
- GitHub Quality run `30245237716`: completed successfully.
- Vercel production deployment `dpl_DHjL1jUWREcC33Cgb3rmgPwK4y7e`: Ready and promoted to `https://villa-vessela-airbnb.vercel.app`.
- Hosted Chromium: 39/39 production checks passed.
- Route/header check: 12/12 public/system routes returned HTTP 200; CSP, HSTS, and frame denial were present.
- Contact action check: two Airbnb actions, one Facebook action, and two source-matched caretaker telephone actions; zero unapproved actionable external destinations.
- WhatsApp and email remained inactive, and website inquiries remained disabled.
