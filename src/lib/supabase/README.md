# Supabase Client Boundaries

## Purpose and responsibilities

This directory owns typed Supabase client construction. `client.ts` creates a public browser client, `server.ts` creates a request-scoped cookie-aware server client, `proxy.ts` refreshes/verifies administrator sessions, `config.ts` validates project configuration/cookie options, and `service.ts` creates the privileged server-only client used only after validated public insert boundaries.

## Interactions

All clients consume `Database` from `src/types/database.ts`. Public/browser and ordinary server clients use the anon key and remain subject to RLS. Dashboard, inquiry administration, status changes, and CSV exports use only the request-scoped server client plus approved-admin RLS. The service-role client bypasses RLS and is imported only by the two analytics Route Handlers and the contact Route Handler after their independent strict validation/rate-limiting boundaries.

## Safe extension

1. Keep client factories small and return `null` when their complete configuration is absent so public rendering remains available.
2. Add feature-specific queries in their owning server-only module rather than turning these factories into repositories.
3. Regenerate/review database types after applied migrations.
4. Keep request-proxy identity checks separate from authoritative server/data authorization.

## Restrictions

- Never import `service.ts` from a Client Component or pass its key/client through props.
- Never treat the anon key as administrator authorization.
- Never make the public website depend on Supabase availability.
- Never log environment values, cookies, Auth tokens, inquiry payloads, or database errors containing sensitive data.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`: public project URL; required only when Supabase features are enabled.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key; safe only with verified RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only privileged credential used for validated analytics and inquiry inserts; never prefix with `NEXT_PUBLIC_` or expose to the browser.

## Testing, privacy, and careful files

Run typecheck, database/auth/dashboard/inquiry/export contract tests, public/admin regression tests, bundle secret scans, and a production build. With a configured local/remote project, also execute migrations and test anon, unapproved-authenticated, approved-admin, dashboard aggregates/states, inquiry insert/read/status/export, session-refresh/logout, issued-cookie, and service-role behavior. `service.ts`, `server.ts`, `proxy.ts`, cookie options, and schema/function types require careful review because errors can cross the authorization or data-privacy boundary.
