# Villa Vessela Website — Final Handoff

**Handoff date:** 2026-07-29

**Repository:** [nikkineilcarino/VillaVesselaAirbnb](https://github.com/nikkineilcarino/VillaVesselaAirbnb)

**Production:** [villa-vessela-airbnb.vercel.app](https://villa-vessela-airbnb.vercel.app)

## Current release

The verified public-information website is complete, published from `main`, and safe to leave online without further configuration.

- Release commit: [`658c33ea2e4c4d5d895bc390f0147ef5c0dfe5e7`](https://github.com/nikkineilcarino/VillaVesselaAirbnb/commit/658c33ea2e4c4d5d895bc390f0147ef5c0dfe5e7)
- GitHub Quality run: [`30249757977`](https://github.com/nikkineilcarino/VillaVesselaAirbnb/actions/runs/30249757977), passed
- Vercel production deployment: `dpl_8dA1khBguf9jsGVpPHZzmj2xaCwG`, Ready and assigned to the canonical alias
- Local verification: production audit clean; lint, strict types, 68 unit tests, production build, and 47 configured Chromium tests passed with 2 credential-dependent administrator checks intentionally skipped
- Hosted verification: Google and Waze frames visually render the matching Tondol beachfront pin; the page initially creates no provider iframe; zoom and exact CSP frame sources passed. Contact returned HTTP 200 with exactly one matching WhatsApp action, approved wording, no mobile overflow, and zero Axe violations.
- Production performance revalidation: two mobile Lighthouse runs scored 99 and two desktop runs scored 100; accessibility, best practices, and SEO scored 100 in all four runs
- GitHub maintenance snapshot: 0 open pull requests and 0 open non-PR issues

Thirty-seven approved photographs are published. The passenger-boat photograph remains excluded because it contains recognizable people and a vessel identifier. Approved caretaker telephone values are published only through environment configuration and are not repeated in the repository.

## Intentional safe defaults

These are deliberate release boundaries, not broken features:

- The Airbnb listing, Facebook page, Messenger conversation, WhatsApp contact, verified Google Maps/Waze property pin, and two named caretaker telephone contacts are explicitly approved and active through validated Vercel environment values. Public email and owner-telephone destinations remain inactive until exact owner-approved values are supplied.
- Blue Kubo, Green Kubo, and parking retain visible photo slots. The owner-confirmed carport and three-to-four-car arrangement is published without implying that a dedicated parking photograph has been supplied. A higher-resolution front-of-villa hero remains recommended.
- The spacious front yard, tropical garden, complete household utilities, and the kitchen kubo shared by Blue and Green Kubo guests are published as owner-confirmed facts. Fixed Wi-Fi is still not advertised, and main-villa-only access to the kitchen kubo remains confirmation-required.
- Analytics storage and contact inquiries are disabled in production.
- No Supabase or test credential is configured. Administrator routes deny unauthenticated access and the public login reveals no configuration details.
- Rates, fees, expanded capacity, kubo/cottage inclusion, and other conflicting facts remain qualified or omitted.
- The current site needs none of those optional items to remain live, indexable, and usable.

## What the owner can provide later

| Owner input | Minimum information needed | Existing extension point |
| --- | --- | --- |
| Blue Kubo photo | Original image, publication permission, truthful description, booking inclusion | Reserved gallery record in `src/data/gallery.ts` |
| Green Kubo photo | Original image, publication permission, truthful description, booking inclusion | Reserved gallery record in `src/data/gallery.ts` |
| Parking photo | Original image and confirmation that it depicts the published carport/three-to-four-car arrangement | Reserved gallery record in `src/data/gallery.ts` |
| Improved hero | Preferably an original image at least 1600 px wide | Existing hero image configuration |
| Booking/social links or replacement map pin | Complete approved destination/pin and explicit permission to publish | Validated `NEXT_PUBLIC_*` Vercel variables |
| Owner phone/email | Complete value and explicit approval to publish | Validated public-contact variables |
| Rates, fees, and property facts | A decision for the matching unchecked item | `CONTENT_TODO.md` and typed `src/data/` modules |
| Messenger reviews | Approved excerpt or redacted screenshot plus attribution permission | Three empty review reservations |
| Custom domain | Final HTTPS origin and DNS access | Canonical environment setting and deployment runbook |

For the shortest safe update, send the new material and state what it depicts, whether it may be public, and any related booking condition. Follow `OWNER_UPDATE_GUIDE.md`; do not edit around its safeguards.

## Optional backend activation

The database schema, authentication shell, aggregate dashboard, inquiry workflow, and CSV exports are implemented but intentionally inactive. Activation is a separate operational project and requires all of the following before any production flag changes:

1. An approved Supabase project and secure server-side credentials.
2. Applied migrations plus live RLS, grant, insertion, dashboard, inquiry, and export verification.
3. Approved administrator identities provisioned out of band.
4. An inquiry and analytics retention/deletion process, privacy-request channel, responsible operator, and consent decision.
5. An approved distributed rate-limit or WAF approach for launch-scale collection.
6. A complete rebuild and the applicable local, CI, and production release checks.

Until those inputs exist, keep `ANALYTICS_ENABLED=false` and `CONTACT_INQUIRY_ENABLED=false`. Never place test credentials or the Supabase service-role key in a public variable.

## Ongoing maintenance

- GitHub Actions validates every push and pull request without deployment or application secrets.
- Dependabot checks npm and pinned GitHub Actions weekly. Updates are reviewed and tested; they are never auto-merged.
- Use `docs/DEPLOYMENT.md` for deployment, environment, rollback, and post-deployment procedures.
- Use `CONTENT_TODO.md` as the authoritative unresolved-fact register and `OWNER_UPDATE_GUIDE.md` for future content changes.

No further autonomous feature activation is appropriate without new owner-approved content, public destinations, business decisions, or backend operations authority.
