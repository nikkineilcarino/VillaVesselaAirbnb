# Inquiry dormant-release QA — 2026-09-06

## Scope and outcome

Step 5 of `WEBSITE_INQUIRY_ACTIVATION_PLAN.md` passed. Only inquiry lifecycle migration `009` was applied, and exact clean source `be8fd8535a008afdf13e02977745f7230b1054fa` was deployed with both Production inquiry controls false. The lifecycle database boundary is ready, but the guest form, administrator inquiry surfaces, and collection endpoint remain hidden or disabled. No public/browser inquiry was submitted, no administrator sign-in/account mutation or analytics consent choice occurred, no analytics event or external contact click was created, and no inquiry row remained.

## Database evidence

- Preflight: linked history `001`–`008`, local `009` pending, zero inquiry rows, one retained administrator profile/Auth user, seven page views, one link click, clean linked lint, and no migration `009` objects. Privacy-safe identity digests were captured without personal fields.
- Application: the pinned CLI applied only `009_add_inquiry_lifecycle.sql` through the migration ledger. No seed, role file, or earlier migration was replayed.
- Structure: local/linked history matched through `009`; linked lint remained clean; lifecycle columns/constraints, function owners/security/search paths, ACLs, two inquiry policies, and the active inquiry Cron job matched the reviewed migration. The analytics Cron job remained active and exact.
- Transactional proof: anonymous store denial; service-mediated `created`, identical `duplicate`, and changed-payload `conflict`; service prune denial; unapproved read/status/delete denial; approved read, status-only update, non-status-update denial, and exact one-UUID deletion; one expired-row prune with one current-row preservation; analytics isolation; exact cleanup.
- Postflight: zero inquiry rows and unchanged retained administrator/Auth/page-view/link-click identity sets. No row content, identifier, credential, or private contact value entered this report.

## Deployment evidence

- Production flags: `CONTACT_INQUIRY_VISIBLE=false` and `CONTACT_INQUIRY_ENABLED=false`, both set through a value-suppressed Production-only channel. Analytics and unrelated environment values were not changed.
- First immutable dormant hidden deployment: `dpl_FBaXNPi25tQBrCe3KidFdfjsbZ3q`.
- Immutable URL: `https://villa-vessela-airbnb-4szohn879-nikkineilcarino-2938s-projects.vercel.app`.
- Source: clean Git/GitHub commit `be8fd8535a008afdf13e02977745f7230b1054fa` with release mode `dormant-hidden` in deployment metadata.
- The staged deployment reached Ready, passed Vercel CLI-authenticated immutable-URL smoke, and was promoted to `https://villa-vessela-airbnb.vercel.app` only after the hidden boundary passed.

## QA evidence

- All nine public routes returned `200` on desktop and 390 × 844 mobile viewports. Exact titles and descriptions, canonical and Open Graph URLs, aligned Open Graph/Twitter metadata, JSON-LD, breadcrumbs, images, robots, sitemap, manifest, icons, and the accessible `404` passed.
- Axe reported zero violations on every public route in both viewports; all routes had zero horizontal overflow on mobile.
- Contact and Privacy exposed no inquiry wording or form. Logged-out `/admin/inquiries` redirected to `/admin/login` without inquiry content. `POST /api/contact` returned the private/no-store/nosniff disabled `404`; inquiry export redirected to login without CSV.
- Exactly six approved contact categories were present and Evelyn was absent. Destinations were inspected only; none was clicked.
- Google Maps and Waze remained opt-in. Load and zoom controls changed their expected zoom state while iframe origins were blocked during QA.
- A fresh browser made zero analytics endpoint requests and created no analytics preference, visitor/session storage, or cookie.
- CSP, HSTS, frame, MIME, referrer, cross-origin, permissions, cache, and framework-disclosure checks passed.
- ESLint, strict TypeScript, all 100 unit/component tests, a hidden-mode Next.js production build, and the full dependency audit passed; the audit reported zero vulnerabilities.
- One preliminary generic production Playwright invocation ran without the provider's public destination inputs, so its configuration-aware assertions expected inactive contacts/maps while the canonical deployment correctly exposed approved production values. It produced 24 passes and 11 expectation failures, all traced to that environment mismatch, including the resulting mobile-menu last-control expectation. Those harness-only failures did not identify an application defect; the value-independent production sweep above inspected the actual release and passed. All generated browser artifacts were removed.

## Boundary after Step 5

Keep both Production inquiry controls false. Migration `009` remains applied and immutable; correct any future defect with an additive migration. The next exact `continue` authorizes Step 6 only: publication, one bounded synthetic browser submission, approved/unapproved live workflow reconciliation, exact deletion/cleanup, and collection-only rollback proof.
