# Public contact selection release — 2026-08-08

## Scope

The owner instructed that all approved contacts remain public except Evelyn. This release:

- retains the approved Airbnb, Facebook, Messenger, WhatsApp, Google Maps/Waze, and Nida destinations;
- activates the separately approved public email;
- removes Evelyn from the rendered contact list, runtime configuration, telephone analytics allowlist, example environment contract, and Vercel Production environment;
- leaves the unspecified owner-telephone slot and website inquiry submission inactive.

Contact values are intentionally redacted from this report and remain outside tracked source.

## Release evidence

- Application commit: `537d5df390a974b7001241c9b3930af2452cc298`
- GitHub Quality run: `31247231534` — passed
- Vercel deployment: `dpl_GYTtfAvoopAZk3aTP2mMM2Zp49hK` — Ready
- Canonical production alias: `https://villa-vessela-airbnb.vercel.app`

## Local verification

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm test` — 9 files and 68 tests passed
- `npm run test:e2e` — 47 tests passed; 2 credential-dependent administrator tests skipped
- `npm run build` — passed; all 14 static outputs generated
- `npm audit --omit=dev` — 0 vulnerabilities
- `npm audit` — 0 vulnerabilities
- Configured contact test with an intentionally stale Evelyn variable — 9 tests passed; the stale value was ignored

## Production verification

The canonical Contact page returned HTTP 200 and exposed six approved channel cards: Airbnb, Facebook, Messenger, WhatsApp, Nida, and Email.

- Telephone links: exactly 1
- Email links: exactly 1
- Evelyn headings or contact cards: 0
- Approved Airbnb, Facebook, Messenger, and WhatsApp destinations: present
- Contact section heading: approved-only wording with no pending-channel claim
- Mobile horizontal overflow at 390 × 844: none
- Phase 5 production Axe scan: 0 violations
- Content Security Policy, Referrer Policy, and `X-Content-Type-Options`: present
- Inquiry submission: remains disabled

The Vercel Production environment lists `NEXT_PUBLIC_CARETAKER_NIDA_PHONE` and `NEXT_PUBLIC_CONTACT_EMAIL`; the former Evelyn variable is absent. No contact value is recorded in this report.
