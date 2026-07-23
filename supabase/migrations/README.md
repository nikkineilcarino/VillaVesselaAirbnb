# Database Migrations

## Purpose and ordering

Files run lexicographically and each depends on the preceding migration. Every migration header documents purpose, affected objects, security implications, dependencies, and reversibility. The order separates table creation, deny-by-default RLS, grants/policies, and aggregate views so a partial review cannot mistake an unprotected table for the final state.

## Responsibilities

- `001` creates only the Auth-linked administrator profile table.
- `002` creates minimized analytics tables, bounded values, allowed categories, and reporting indexes.
- `003` creates bounded voluntary inquiry storage without activating submission.
- `004` enables RLS on every application table and revokes direct client privileges.
- `005` grants approved administrators limited operations through an injection-resistant `SECURITY DEFINER` membership function.
- `006` creates `security_invoker` views so base-table RLS remains effective.
- `007` creates five range-bounded authenticated dashboard functions using `SECURITY INVOKER`.

## Safe change workflow

1. Do not edit a migration already applied to a shared environment.
2. Add the next numbered migration with a complete documentation header.
3. Keep every new table deny-by-default; explicitly revoke anon/authenticated privileges before adding narrow policies.
4. Avoid public insert policies for analytics or inquiries. Their later server endpoints own validation, destination allowlisting, consent, rate limits, and safe failure handling.
5. Add constraints before trusting TypeScript types or UI validation.
6. Run local reset/lint, generated-type comparison, role probes, unit tests, lint, typecheck, and build.
7. Record destructive/irreversible changes and backup requirements before remote application.

## Required role probes

With a configured disposable database, verify anon and unapproved authenticated roles cannot select, insert, update, or delete any protected record; an approved administrator can read protected data but only update inquiry `status`; and the service role is usable only from a trusted server context. Also verify every aggregate view/function denies data to non-admin callers, functions reject out-of-bound intervals, and daily rows follow Asia/Manila date boundaries.

## Environment and sensitive files

Migrations contain no environment values. CLI linking credentials remain outside the repository. Policy migrations, privilege statements, security-definer functions, foreign-key deletion behavior, and any migration touching personal inquiry data must not be edited casually.
