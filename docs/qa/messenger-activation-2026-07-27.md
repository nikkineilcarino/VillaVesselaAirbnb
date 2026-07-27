# Messenger activation — 2026-07-27

## Authority and scope

The owner supplied and approved a complete Messenger conversation URL on 2026-07-27. A direct HTTP check returned Messenger's normal login redirect while preserving the supplied conversation destination.

This activation adds one Contact action only. It does not supply Messenger review excerpts or screenshots, does not infer WhatsApp availability, and does not activate maps, email, owner telephone, analytics, inquiries, or Supabase-backed administration.

## Implementation boundary

- `NEXT_PUBLIC_MESSENGER_URL` remains the single configuration input.
- The value must be a credential-free HTTPS URL and fails closed when blank or malformed.
- The exact configured destination is allowlisted under the existing `messenger` link type.
- The active Contact card is labelled as an owner-approved Messenger conversation and uses the action text `Open Messenger`.
- Existing empty Messenger review reservations remain unchanged.

## Verification required for release

- ESLint, strict TypeScript, 67 unit tests, and production build.
- Configured and fail-closed Chromium coverage for exact destinations, pending-channel counts, Contact labels, mobile layout, accessibility, and absence of unapproved links.
- Vercel environment confirmation, Ready deployment, hosted browser checks, route/security-header checks, and successful GitHub Quality workflow.
