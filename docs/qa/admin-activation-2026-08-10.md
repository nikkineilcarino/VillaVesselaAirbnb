# Production administrator activation — 2026-08-10

## Outcome

Villa Vessela production administrator authentication is active at `https://villa-vessela-airbnb.vercel.app/admin/login`. One owner-approved, email-confirmed Supabase Auth identity has one matching `public.admin_profiles` row with role `admin`. The approved identity can open the empty Analytics dashboard and Inquiries page; public visitors and authenticated identities without a profile remain denied.

No administrator email, password, user UUID, database password, access token, anon-key value, service-role value, or disposable test credential is stored in Git. The owner credential record is handed off separately.

## Supabase activation

- Created the `Villa Vessela` Supabase organization and a `villa-vessela-airbnb` project in `ap-southeast-1` (Singapore).
- Deleted one initial empty project immediately after its generated database credential was not retained. It contained no migration, Auth identity, or application data; the organization was preserved.
- Linked the replacement healthy project through ignored local CLI state.
- Dry-run review found exactly migrations `001` through `007`, with no seed or custom-role application.
- Applied migrations `001` through `007` in order; remote migration history matches every local version.
- Ran linked schema lint across `extensions`, `private`, and `public`; no schema errors were reported.
- Created and email-confirmed the approved Auth identity through the administrative API.
- Inserted only its exact UUID into `admin_profiles` and verified password authentication plus RLS-authorized profile selection.

## Vercel boundary

- Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Production as intentionally public configuration.
- Did not deploy `SUPABASE_SERVICE_ROLE_KEY` or any `SUPABASE_TEST_*` value.
- Kept `ANALYTICS_ENABLED=false` and `CONTACT_INQUIRY_ENABLED=false`.
- Deployment `dpl_9ANCAoMFRoznxvhk3FbQjpZ95U2G` completed `Ready` and was assigned to the canonical alias.

## Runtime defect and fix

The first real form submission exposed a Next.js runtime rule that credential-independent checks could not exercise: a `"use server"` module exported the non-function `initialAdminLoginState` object. Vercel logged `A "use server" file can only export async functions` for `POST /admin/login`.

Commit `3099463d6720746af8f394858022eb0cfafb372f` moves the initial state into the client form and leaves only the async action plus an erased TypeScript type in the server-action module. A unit regression assertion prevents that object export from returning.

## Verification evidence

- ESLint: passed.
- Strict TypeScript: passed.
- Vitest: 69 tests passed across 9 files.
- Optimized Next.js production build: passed; all 14 static outputs generated.
- Direct approved password authentication: passed.
- Direct approved RLS profile read: passed.
- Production browser approved flow: sign-in, dashboard headings, date presets, Inquiries page, logout, and post-logout dashboard redirect passed.
- Production browser unapproved flow: a disposable authenticated identity without an `admin_profiles` row received the exact generic denial and no technical detail. Both disposable test identities were deleted after their runs.

## Remaining boundaries

- No public registration or website password-reset route exists. Credential rotation/recovery remains an owner-controlled Supabase administration operation.
- Dedicated retained non-production approved/unapproved identities are still absent; CI therefore continues to skip the two secret-dependent live-auth tests.
- Analytics insertion, public inquiries, inquiry status mutation, populated metrics/charts, CSV reconciliation, retention, deletion, and privacy-request operations remain disabled or unverified until separately approved.
- The service-role key remains outside Vercel because no enabled production feature currently requires it.
