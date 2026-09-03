# Deployment and operations runbook

## Release targets

- Source repository: `https://github.com/nikkineilcarino/VillaVesselaAirbnb`
- Release branch: `main`
- Vercel team: `nikkineilcarino-2938s-projects`
- Vercel project: `villa-vessela-airbnb`
- Production alias: `https://villa-vessela-airbnb.vercel.app`
- Application framework: Next.js App Router
- Analytics remediation application commit: `98a5c316ea1451f6dad34c1e376b946107e00145`
- Activation evidence commit: `678e9af591cca78b9d008e660a4fa84c41e20d03`
- Verified analytics activation deployment: `dpl_Hq2gcedwbYnEJCht5fLdqR2HnxWy` (Ready and assigned to the canonical alias on 2026-08-10)
- Database/authentication provider: Supabase (administrator authentication active)

The public information site and outbound navigation remain usable if Supabase or analytics delivery is temporarily unavailable. Production administrator login is connected to an approved Supabase project with all eight migrations applied; one manually authorized owner identity can reach the analytics dashboard. Consent-based page-view and approved external-link analytics is active. The Step 4 dormant target hides unfinished public and administrator inquiry surfaces and keeps submission disabled; the activation plan distinguishes that target from the pre-Step 4 deployment's earlier disabled preview until provider verification is complete.

The dormant target keeps `NEXT_PUBLIC_SITE_URL=https://villa-vessela-airbnb.vercel.app`, `ANALYTICS_ENABLED=true`, `CONTACT_INQUIRY_VISIBLE=false` (missing also fails closed), and `CONTACT_INQUIRY_ENABLED=false`, together with the separately approved public booking, social, map, WhatsApp, and caretaker-contact variables. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured for Auth/RLS. One modern Supabase backend secret is configured as sensitive, Production-only `SUPABASE_SERVICE_ROLE_KEY`; no `SUPABASE_TEST_*` credential is deployed. The backend secret is full privilege and must never be copied to a browser, public variable, log, file, command argument, or documentation.

Production may contain the owner-approved `NEXT_PUBLIC_CARETAKER_NIDA_PHONE` and `NEXT_PUBLIC_CONTACT_EMAIL` values. The caretaker telephone and public email remain intentionally omitted from Git and deployment documentation. Evelyn's former caretaker contact was withdrawn from public use on 2026-08-08 and `NEXT_PUBLIC_CARETAKER_EVELYN_PHONE` must not be configured. Telephone approval does not establish WhatsApp availability.

The same approval cycle added four public Google Maps/Waze navigation and embed variables for one verified property pin. Their values remain environment-configured so a correction can replace all providers together. The hosted embeds require no project-owned API key or billing credential.

The owner also supplied one complete country-code WhatsApp contact on 2026-07-27. `NEXT_PUBLIC_WHATSAPP_NUMBER` is intentionally browser-visible after deployment but its value is omitted from Git and this runbook. Replacement or revocation requires an environment update and redeploy.

## Pre-release gate

Run from a clean checkout:

```powershell
npm ci
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=low
```

Review the complete development tree separately with `npm audit`. The known development-only ESLint globbing advisory and its compatibility analysis are documented in `docs/qa/dependency-audit-2026-07-27.md`; do not apply `--force` or misrepresent that report as a deployed application vulnerability.

The credential-independent browser suite must report two live administrator checks as explicitly skipped unless dedicated non-production credentials are supplied. Run the enabled inquiry branch separately only against an intentionally enabled test server:

```powershell
$env:CONTACT_INQUIRY_VISIBLE = "true"
$env:CONTACT_INQUIRY_ENABLED = "true"
npx playwright test tests/e2e/inquiry-workflow.spec.ts
```

Never call a skipped or configuration-blocked check passed.

## Vercel project setup

Authenticate with the owner-approved Vercel account, select the exact team above, and link the local checkout:

```powershell
npx vercel@latest whoami
npx vercel@latest teams ls
npx vercel@latest project add villa-vessela-airbnb --scope nikkineilcarino-2938s-projects
npx vercel@latest link --yes --team nikkineilcarino-2938s-projects --project villa-vessela-airbnb
```

`.vercel/` is local provider state and must remain ignored.

## Production environment

Configure only reviewed values. Missing optional values intentionally keep their feature or destination unavailable.

| Variable | Current production state | Activation/maintenance requirement |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required: exact final Vercel/custom HTTPS origin | Rebuild, then inspect canonical, Open Graph, sitemap, and robots output |
| `ANALYTICS_ENABLED` | `true` | Rebuild after any change; explicit browser choice, minimized collection, retention, write/readback, dashboard/CSV, failure-isolation, and rollback QA must remain valid |
| `CONTACT_INQUIRY_VISIBLE` | `false`/absent | Keep unfinished guest/admin surfaces hidden; publish only after migration/admin prerequisites pass; retain true during a post-activation collection rollback |
| `CONTACT_INQUIRY_ENABLED` | `false` | Approved storage, consent wording, retention/deletion process, operator, rate-limit review, and live inquiry/admin/export QA |
| `NEXT_PUBLIC_SUPABASE_URL` | Configured for production administrator authentication | Approved Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Configured for production administrator authentication | Public key; safe only with verified RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Configured as sensitive and Production-only | Full-privilege backend secret; server-only validated analytics insert routes currently require it |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` / `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Verified property pin | Coordinate-based Google Maps navigation and click-to-load embed; no project API key required |
| `NEXT_PUBLIC_WAZE_URL` / `NEXT_PUBLIC_WAZE_EMBED_URL` | Verified property pin | Matching Waze deep link and click-to-load Live Map embed |
| Other approved booking/contact destinations | Omit until supplied | Exact owner-approved public values and browser verification |
| `SUPABASE_TEST_*` values | Never configure in production | Dedicated non-production test process or protected CI only |

Example non-interactive configuration for non-secret flags after the project is linked:

```powershell
'https://final-origin.example' | npx vercel@latest env add NEXT_PUBLIC_SITE_URL production --force --yes
'true' | npx vercel@latest env add ANALYTICS_ENABLED production --sensitive --force --yes
'false' | npx vercel@latest env add CONTACT_INQUIRY_VISIBLE production --sensitive --force --yes
'false' | npx vercel@latest env add CONTACT_INQUIRY_ENABLED production --sensitive --force --yes
```

Do not place credentials on command lines. Add or rotate backend secrets through an approved protected provider interface or a reviewed value-suppressed API/standard-input bridge, then prove write health with one isolated event and exact cleanup. Verify that a secret never enters shell history, source, logs, client bundles, or deployment metadata. Environment-name presence is not proof that a copied secret value is complete.

## Supabase activation order

The production Supabase project and analytics were activated on 2026-08-10 using this sequence. Database, authentication, and analytics steps are complete; inquiry activation remains outstanding:

1. Apply the eight migrations in filename order:
   `001_create_admin_profiles.sql`,
   `002_create_analytics_tables.sql`,
   `003_create_inquiries_table.sql`,
   `004_enable_rls.sql`,
   `005_create_admin_policies.sql`,
   `006_create_analytics_views.sql`,
   `007_create_dashboard_functions.sql`,
   `008_add_waze_and_analytics_retention.sql`.
2. Regenerate and review `src/types/database.ts`.
3. Prove anonymous and arbitrary authenticated users cannot read analytics, inquiries, or administrator data.
4. Create dedicated Supabase Auth identities through an approved administrative path; general signup stays disabled.
5. Add only the approved administrator user ID to `admin_profiles`.
6. Prove approved login/logout and dashboard/inquiry/export access, and prove an authenticated user without a profile is denied.
7. Verify analytics insertion, exact approved-link delivery, outage/navigation behavior, consent storage, retention, exact synthetic deletion, dashboard aggregates, and page/link CSV reconciliation. This passed on 2026-08-10.
8. Add production variables and enable analytics only after its gate passes. Keep inquiries false until their separate retention, live insertion/status/export, operator, and deletion gates pass.

Detailed role probes and provisioning boundaries remain in `supabase/README.md` and `src/lib/auth/README.md`.

## Production deployment

Deploy the reviewed `main` commit:

```powershell
git status --short
git rev-parse HEAD
npx vercel@latest deploy --prod --yes --scope nikkineilcarino-2938s-projects
```

Record the commit SHA, deployment ID/URL, production alias, environment state, and all post-deployment results in a dated QA report. The original public release remains in `docs/qa/phase-12-release.md`; analytics activation is in `docs/qa/analytics-activation-2026-08-10.md`.

## Optional `villavessela.com` custom domain

A read-only registry, DNS, Vercel ownership, and Vercel domain-search check on 2026-07-29 found no existing registration or nameserver record and reported `villavessela.com` as available. Vercel displayed a purchase price of `$11.25` for one year and a `$11.25` annual renewal price. Availability and pricing can change at any time and must be checked again immediately before checkout.

Domain registration is an annual expense rather than a monthly website charge. The existing `villa-vessela-airbnb.vercel.app` address can remain online without purchasing the custom domain.

Do not purchase or attach the domain without explicit owner approval, an approved payment method, and accurate registrant details. Once those are supplied:

1. Recheck availability and purchase/renewal pricing in Vercel Domains.
2. Purchase `villavessela.com` through the approved account; keep renewal enabled only if the owner approves the recurring annual charge.
3. Add both `villavessela.com` and `www.villavessela.com` to the `villa-vessela-airbnb` project.
4. Make `https://www.villavessela.com` canonical and configure the apex domain to redirect to `www` so search engines see only one site origin.
5. Update the production `NEXT_PUBLIC_SITE_URL` to `https://www.villavessela.com` and redeploy the reviewed commit.
6. Verify DNS, the automatically provisioned SSL certificate, apex-to-`www` redirection, canonical/Open Graph metadata, sitemap, robots, security headers, all public routes, and mobile accessibility.
7. Keep the Vercel alias available as an operational fallback; do not publish two competing canonical origins.

## Post-deployment verification

Verify on the production alias:

1. All nine public routes and the accessible 404 work without authentication and without horizontal overflow.
2. `/admin/dashboard`, `/admin/inquiries`, and every export type deny unauthenticated access through the fixed login redirect.
3. There is no public registration route; missing Supabase configuration produces a non-revealing unavailable login state.
4. Canonical, Open Graph, Twitter, sitemap, and robots URLs use the exact HTTPS production origin.
5. Robots allows public pages and disallows `/admin/` and `/api/`; administrator pages remain `noindex` and private/no-store.
6. CSP, HSTS, clickjacking, MIME, referrer, permissions, cross-origin, and static-asset cache headers are present; CSP permits frames only from the exact Google Maps and Waze embed origins.
7. Privacy, keyboard focus, mobile navigation, gallery lightbox, reduced motion, and Axe smoke checks pass.
8. External destinations remain inactive unless exact approved values were configured; Google Maps and Waze remain unloaded until selected and resolve to the same property pin with working zoom controls.
9. Before analytics choice, no analytics identifier or request exists. With analytics enabled, malformed endpoint probes return `415`; one authorized live-storage test must return `201` and be deleted exactly. With inquiry submission disabled, `/api/contact` returns the documented `404` disabled response.
10. Browser bundles and rendered output contain no server secret, private caretaker contact, test credential, internal identifier, or raw inquiry record.

## Rollback

Vercel deployments are immutable. If a release fails:

1. Keep the failing deployment available only for diagnosis; do not overwrite source history or force-push.
2. Promote the last known-good Vercel production deployment from the project dashboard or CLI.
3. Revert the faulty Git commit with a new commit on `main`, run the full release gate, push normally, and deploy again.
4. If a database migration is involved, stop feature traffic first and follow a reviewed forward-fix/data-recovery plan. Do not destructively reverse a production migration without a backup and explicit owner approval.

For an analytics-specific rollback, set the Production `ANALYTICS_ENABLED` value to false and create a fresh production deployment because the public layout consumes the flag during build. Confirm both analytics endpoints return `204`, the consent control is absent, and a fresh browser creates no analytics identifier/request. Keep migration `008` applied; it is safe while collection is disabled and should be corrected only by an additive migration. Remove the backend secret and redeploy only if the server insertion boundary itself is suspect.

## Support and current limitations

- Forty-one approved photographs and the approved booking/social/messaging/map/WhatsApp/caretaker/email destinations are active. Blue Kubo, Green Kubo, parking, public owner telephone, rates, and several inclusion details remain unresolved and use reserved slots, qualification, or disabled controls.
- Administrator access, consent-based analytics storage, dashboard reporting, and page/link CSV export are operational. Inquiry collection remains unpublished and disabled; the dormant application release keeps its direct administration/export surfaces hidden pending the separate migration, publication, storage, status, deletion, operator, and live-proof gates.
- Analytics-only retention runs daily after events become older than 365 days. Scheduled execution can be delayed by the daily interval or a paused provider project; do not promise exact-to-the-second deletion.
- The in-process anonymous rate limiter is not globally atomic across serverless instances. Add an approved privacy-compatible distributed/WAF control before sustained or adversarial launch-scale traffic.
- The public Contact route is the configured privacy-request channel. Responsible handling, provider review, jurisdiction-specific obligations, and the separate inquiry process remain owner/legal/operational responsibilities.
- Private caretaker numbers from the planning package must never be published or used as default contact configuration.
