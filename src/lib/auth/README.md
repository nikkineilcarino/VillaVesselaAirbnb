# Administrator Authentication

## Boundary

Supabase Auth establishes identity; an RLS-visible row in `admin_profiles` establishes administrator authorization. `getAdminAccess()` performs both checks with a request-scoped anon-key server client. `requireAdmin()` is the authoritative guard used by protected Server Components.

The request proxy verifies/refreshes session cookies before protected rendering, but it is deliberately not the only authorization check. No public registration, password-reset, or guest account flow exists.

## Safe behavior

- Login failures use one non-revealing message for bad credentials and unapproved accounts.
- Missing or unreachable configuration returns a service-unavailable state without technical details.
- Protected pages are dynamic, private, and server-authorized.
- Logout runs as a Server Action, revokes the Supabase session when available, and redirects to the login page.
- Credentials, tokens, full Auth errors, and user IDs must never be logged or rendered.

## Provisioning

Create an Auth user only through an approved Supabase administrative path. Copy its UUID from the protected Auth administration screen, then provision the authorization row through trusted SQL or the isolated service role:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('<approved-auth-user-uuid>', '<approved-display-name>', 'admin');
```

Verify the UUID before execution; do not guess it and do not provision every Auth user. Never seed/commit credentials or put a password in SQL. Live access checks require an approved non-production project plus one approved test account and one unapproved account with no profile row.
