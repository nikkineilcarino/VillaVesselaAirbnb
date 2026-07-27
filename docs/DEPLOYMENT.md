# Deployment and operations runbook

## Release targets

- Source repository: `https://github.com/nikkineilcarino/VillaVesselaAirbnb`
- Release branch: `main`
- Vercel team: `nikkineilcarino-2938s-projects`
- Vercel project: `villa-vessela-airbnb`
- Production alias: `https://villa-vessela-airbnb.vercel.app`
- Application framework: Next.js App Router
- Application release commit: `8275f9840d3bc306bddf2d7bfd697d69da776be7`
- Production deployment: `dpl_2GNFhHcpounFYihPng2hDvSYE7Hi` (Ready)
- Database/authentication provider when activated: Supabase

The public information site is intentionally usable without Supabase. Administrator login, stored analytics, inquiries, dashboard data, and exports remain unavailable until an approved Supabase project is configured and the live authorization checks below pass.

The initial production environment contains exactly `NEXT_PUBLIC_SITE_URL=https://villa-vessela-airbnb.vercel.app`, `ANALYTICS_ENABLED=false`, and `CONTACT_INQUIRY_ENABLED=false`. No Supabase or test credential is configured.

After explicit owner approval on 2026-07-27, production may also contain `NEXT_PUBLIC_CARETAKER_NIDA_PHONE` and `NEXT_PUBLIC_CARETAKER_EVELYN_PHONE`. Their values are intentionally omitted from Git and deployment documentation. This approval covers public telephone links only and does not establish WhatsApp availability.

## Pre-release gate

Run from a clean checkout:

```powershell
npm ci
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm audit --audit-level=low
```

The credential-independent browser suite must report two live administrator checks as explicitly skipped unless dedicated non-production credentials are supplied. Run the enabled inquiry branch separately only against an intentionally enabled test server:

```powershell
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

| Variable | Initial production state | Activation requirement |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required: exact final Vercel/custom HTTPS origin | Rebuild, then inspect canonical, Open Graph, sitemap, and robots output |
| `ANALYTICS_ENABLED` | `false` | Approved Supabase project, migrations/RLS probes, privacy/provider/retention approval, and live insertion QA |
| `CONTACT_INQUIRY_ENABLED` | `false` | Approved storage, consent wording, retention/deletion process, operator, rate-limit review, and live inquiry/admin/export QA |
| `NEXT_PUBLIC_SUPABASE_URL` | Omit initially | Approved Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Omit initially | Approved project with RLS verified for anonymous and authenticated roles |
| `SUPABASE_SERVICE_ROLE_KEY` | Omit initially | Server-only secret; add only when validated analytics/inquiry inserts are approved |
| Approved booking/contact/map destinations | Omit until supplied | Exact owner-approved public values and browser verification |
| `SUPABASE_TEST_*` values | Never configure in production | Dedicated non-production test process or protected CI only |

Example non-interactive configuration after the project is linked:

```powershell
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production --value "https://final-origin.example" --yes
npx vercel@latest env add ANALYTICS_ENABLED production --value "false" --yes
npx vercel@latest env add CONTACT_INQUIRY_ENABLED production --value "false" --yes
```

Do not place credentials on command lines. Add future secrets through an approved protected provider interface or secret input channel, and verify that they never enter shell history, source, logs, client bundles, or deployment metadata.

## Supabase activation order

No production Supabase project is linked at the initial static-site release. When the owner approves one:

1. Apply the seven migrations in filename order:
   `001_create_admin_profiles.sql`,
   `002_create_analytics_tables.sql`,
   `003_create_inquiries_table.sql`,
   `004_enable_rls.sql`,
   `005_create_admin_policies.sql`,
   `006_create_analytics_views.sql`,
   `007_create_dashboard_functions.sql`.
2. Regenerate and review `src/types/database.ts`.
3. Prove anonymous and arbitrary authenticated users cannot read analytics, inquiries, or administrator data.
4. Create dedicated Supabase Auth identities through an approved administrative path; general signup stays disabled.
5. Add only the approved administrator user ID to `admin_profiles`.
6. Prove approved login/logout and dashboard/inquiry/export access, and prove an authenticated user without a profile is denied.
7. Verify analytics/inquiry insertion, rate bounds, outage behavior, retention, deletion, and CSV reconciliation.
8. Add production variables and enable each feature separately only after its gate passes.

Detailed role probes and provisioning boundaries remain in `supabase/README.md` and `src/lib/auth/README.md`.

## Production deployment

Deploy the reviewed `main` commit:

```powershell
git status --short
git rev-parse HEAD
npx vercel@latest deploy --prod --yes --scope nikkineilcarino-2938s-projects
```

Record the commit SHA, deployment ID/URL, production alias, environment state, and all post-deployment results in `docs/qa/phase-12-release.md`.

## Post-deployment verification

Verify on the production alias:

1. All nine public routes and the accessible 404 work without authentication and without horizontal overflow.
2. `/admin/dashboard`, `/admin/inquiries`, and every export type deny unauthenticated access through the fixed login redirect.
3. There is no public registration route; missing Supabase configuration produces a non-revealing unavailable login state.
4. Canonical, Open Graph, Twitter, sitemap, and robots URLs use the exact HTTPS production origin.
5. Robots allows public pages and disallows `/admin/` and `/api/`; administrator pages remain `noindex` and private/no-store.
6. CSP, HSTS, clickjacking, MIME, referrer, permissions, cross-origin, and static-asset cache headers are present.
7. Privacy, keyboard focus, mobile navigation, gallery lightbox, reduced motion, and Axe smoke checks pass.
8. External destinations remain inactive unless exact approved values were configured.
9. Analytics and inquiry endpoints remain unavailable while their production flags are false.
10. Browser bundles and rendered output contain no server secret, private caretaker contact, test credential, internal identifier, or raw inquiry record.

## Rollback

Vercel deployments are immutable. If a release fails:

1. Keep the failing deployment available only for diagnosis; do not overwrite source history or force-push.
2. Promote the last known-good Vercel production deployment from the project dashboard or CLI.
3. Revert the faulty Git commit with a new commit on `main`, run the full release gate, push normally, and deploy again.
4. If a database migration is involved, stop feature traffic first and follow a reviewed forward-fix/data-recovery plan. Do not destructively reverse a production migration without a backup and explicit owner approval.

## Support and current limitations

- Official property photographs, approved external destinations, public owner contacts, rates, and several inclusion details remain unresolved and are represented by explicit placeholders or disabled controls.
- Analytics, inquiry storage, administrator access, dashboard data, and CSV exports are not operational without approved Supabase configuration.
- The in-process anonymous rate limiter is not globally atomic across serverless instances. Select an approved privacy-compatible distributed/WAF control before enabling collection at launch scale.
- Retention, deletion, privacy-request handling, provider review, and any jurisdiction-specific consent control remain owner/legal/operational decisions.
- Private caretaker numbers from the planning package must never be published or used as default contact configuration.
