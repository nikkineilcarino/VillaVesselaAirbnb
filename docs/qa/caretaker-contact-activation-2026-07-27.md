# Caretaker telephone activation — 2026-07-27

## Authority and scope

The 42-page source package identifies two named caretaker telephone contacts, classifies them as internal by default, and requires explicit approval before public display. On 2026-07-27, the owner explicitly approved their use after that privacy restriction was restated.

This change publishes two telephone links only:

- Nida — Caretaker
- Evelyn — Caretaker

It does not infer WhatsApp availability and does not activate the pending owner phone/email, Airbnb, Facebook, Messenger, Google Maps, inquiry, analytics, or Supabase features.

## Privacy and configuration boundary

- The actual numbers are not committed, printed in QA evidence, or copied into documentation.
- Two separate `NEXT_PUBLIC_` Vercel values provide the approved contacts at build time and are intentionally browser-visible.
- Each input must normalize to 8–15 international digits before a `tel:` link renders.
- Invalid or missing values fail closed. If neither validates, the original inactive telephone card remains.
- Both exact destinations are allowlisted under the existing aggregate `phone` click type; analytics remains disabled in production.
- Removing either environment value and redeploying removes that public contact.

## Verification

- Source review: 42 pages parsed; two labelled caretaker telephone values found on page 29; both remained redacted in command output and evidence.
- Repository-value scan: no approved caretaker phone value is committed in source or documentation.
- ESLint: passed.
- Strict TypeScript check: passed after constraining the filtered contact-channel literal type.
- Vitest: 67 passed across 9 files, including multiple telephone normalization and exact allowlist assertions.
- Configured-contact production build: passed with synthetic international test numbers; all expected routes were generated.
- Configured-contact Playwright Chromium: 47 passed, 2 credential-dependent live administrator checks skipped as designed.
- Contact browser coverage: two exact `tel:` destinations, five disabled unapproved channels, disabled inquiry collection, no other unapproved external destination, mobile fit, and Axe checks passed.
- Default/fail-closed focused Chromium suite: 9 passed with both caretaker variables absent and the original inactive telephone state retained.

Production environment configuration, deployment, redacted live-value checks, and hosted browser results will be appended after the implementation commit is published.
