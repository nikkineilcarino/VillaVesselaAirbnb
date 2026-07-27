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

## Verification

- ESLint, strict TypeScript, and 67 unit tests passed.
- The configured production build passed with all five approved public destinations active; caretaker values were synthetic during local build/browser evidence.
- Configured Chromium: 47 passed; 2 credential-dependent live administrator checks skipped as designed.
- Focused Messenger fail-closed Chromium: 9 passed while Airbnb, Facebook, and synthetic caretaker contacts remained active.
- GitHub implementation commit: `98d8d40b90e42d26dd9b3feb84d7abcda5211c07`.
- GitHub Quality run `30246291072`: completed successfully.
- Vercel production deployment `dpl_Gcuv6nUBh2DwHhzq4miaZiUY7FHM`: Ready and promoted to `https://villa-vessela-airbnb.vercel.app`.
- Hosted Chromium: 39/39 production checks passed.
- Route/header check: 12/12 public/system routes returned HTTP 200; CSP, HSTS, and frame denial were present.
- Contact action check: two Airbnb actions, one Facebook action, one Messenger action, and two source-matched caretaker telephone actions; zero unapproved actionable external destinations.
- WhatsApp and email remained inactive, and website inquiries remained disabled.
