# Administrator Routes

`/admin/login` is public and exposes email/password sign-in only. The `(protected)` route group keeps URLs stable while applying `requireAdmin()` to the dashboard and inquiry pages. `/admin/dashboard` is a database-backed analytics report with protected CSV links. `/admin/inquiries` is a 20-row paginated private-data view with allowlisted filters and status-only updates.

`src/proxy.ts` matches only `/admin/*`, refreshes/verifies Supabase cookies, applies private/no-store caching, and redirects unauthenticated protected requests. The protected layout repeats the authoritative identity and `admin_profiles` authorization checks on the server. Proxy checks must never replace server/data authorization.

All administrator routes are marked `noindex`. Errors are non-revealing, no public registration exists, and no credential is stored in route code. Dashboard, inquiry, action, and export reads never import the service-role client; authenticated clients, base-table RLS, and `SECURITY INVOKER` functions enforce access together.

Dashboard query parameters are untrusted. Invalid, reversed, future, or longer-than-366-day custom ranges render an inline validation state and do not query the database. All successful cards, charts, and recent tables use the same start-inclusive/end-exclusive interval.

The inquiry status Server Action must be treated as a public endpoint: it repeats `requireAdmin()`, validates its bound UUID and status, updates only `status`, revalidates fixed admin paths, and redirects only to fixed notices. The CSV handler lives under the proxy matcher but repeats authorization, type/date validation, row limits, and private download headers internally.
