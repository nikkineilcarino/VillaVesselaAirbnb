# Caretaker telephone activation — 2026-07-27

> **Superseded contact scope (2026-08-08):** The owner retained Nida and removed Evelyn from the public contact list. Current releases must expose only Nida's approved caretaker telephone and must not configure `NEXT_PUBLIC_CARETAKER_EVELYN_PHONE`. The details below remain as historical evidence for the 2026-07-27 release.

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

## Production release

- Implementation commit: `a65e85c14803c7fdc57f81aeaff09802087137e3`.
- GitHub Quality run `30244162664`: completed successfully with the secretless/fail-closed configuration.
- Vercel Production configuration: exactly two encrypted caretaker telephone variables added; Vercel confirmed that both `NEXT_PUBLIC_` values are intentionally visitor-visible.
- Vercel deployment `dpl_GwrZWVLt73pUQScxPGQu849dVc4N`: Ready and promoted to the canonical alias.
- Redacted live contact check: HTTP 200; 2/2 exact source values matched; 2 telephone links; 2 named caretaker labels; 0 active WhatsApp links; inquiry mode remained disabled.
- Hosted Playwright Chromium: 39/39 production checks passed, including contact destination, mobile, keyboard, metadata, security-header, and Axe coverage.
- Route/header check: 12/12 public/system routes returned HTTP 200; CSP, HSTS, and frame denial remained present.
- Repository scan after deployment: actual contact values remain absent from Git history and workspace files.
