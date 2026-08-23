# WhatsApp activation — 2026-07-27

> **Historical snapshot.** Consent-based production analytics was activated on 2026-08-10; see [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). The approved public destination value remains intentionally absent from Git.

## Outcome

The owner-supplied WhatsApp contact is active on the production Contact page through one validated `wa.me` action. The actual number is intentionally omitted from Git, this report, logs, and screenshots; it is stored only in Vercel production configuration and is necessarily visible in the public link after deployment.

This approval applies only to the exact supplied WhatsApp destination. It does not assign the channel to a named caretaker, activate the public owner-telephone or email slots, enable inquiry collection, or infer any additional contact destination.

## Implementation

- `NEXT_PUBLIC_WHATSAPP_NUMBER` accepts only 8–15 international digits after formatting characters are removed.
- Valid configuration becomes a canonical `https://wa.me/<digits>` destination; invalid or blank configuration remains inactive.
- The Contact card now distinguishes the active `Owner-approved WhatsApp contact` state from the fail-closed awaiting-confirmation state.
- The exact destination remains allowlisted under the existing `whatsapp` analytics type. Analytics itself remains disabled in production.
- Configured and fail-closed browser paths account for WhatsApp independently from Messenger and telephone contacts.

## Verification

- Tracked-file scan: the supplied number is absent.
- Lint: passed.
- Strict TypeScript: passed.
- Unit tests: 68 passed.
- Focused configured Chromium checks: 3 passed for exact destinations, Contact state, and Axe.
- Production build: passed.
- Production dependency audit: 0 vulnerabilities.
- GitHub Quality run: passed.
- Production Contact check: HTTP 200; exactly one matching WhatsApp link; approved wording present; no mobile overflow; zero Axe violations after the page heading became visible.

## Release evidence

- Application commit: `a042ce582be844e7bc0242edaa8bcd8b7e620b0c`
- GitHub Quality run: `30248702097` — passed
- Vercel deployment: `dpl_CuFt4ZTkMWBLF5iFWVfFszTUFPAM` — Ready
- Production alias: `https://villa-vessela-airbnb.vercel.app`

Revocation or replacement requires removing or changing the Vercel variable, redeploying, and repeating exact-link, privacy, mobile, accessibility, build, CI, and production checks.
