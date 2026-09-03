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
- `008` adds a distinct Waze click category and an owner-only daily Supabase Cron job that prunes only anonymous analytics after 365 days.
- `009` adds required unique UUID-v4 `submission_id` values, required `privacy_notice_version` provenance with no future-insert defaults, the service-role-only `store_contact_inquiry` function, the approved-admin-checking one-UUID `delete_contact_inquiry` function, and the owner-only `private.prune_expired_inquiries()` function called by its distinct daily `villa-vessela-inquiry-retention` Cron job. The storage function returns only `created`, `duplicate`, or `conflict`; reusing an ID with changed intake fields cannot overwrite or impersonate the original submission.

## Safe change workflow

1. Do not edit a migration already applied to a shared environment.
2. Add the next numbered migration with a complete documentation header.
3. Keep every new table deny-by-default; explicitly revoke anon/authenticated privileges before adding narrow policies.
4. Avoid public insert policies for analytics or inquiries. Their later server endpoints own validation, destination allowlisting, consent, rate limits, and safe failure handling.
5. Add constraints before trusting TypeScript types or UI validation.
6. Keep each retention function parameter-free, limited to its named dataset, and unavailable to application roles. Inquiry retention must use its own function and Cron job rather than extending the analytics job.
7. Run local reset/lint, generated-type comparison, role probes, unit tests, lint, typecheck, and build.
8. Record destructive/irreversible changes, scheduled jobs, and backup requirements before remote application.

Direct inquiry-table DELETE remains unavailable to `anon` and `authenticated`. Exact deletion is the narrow exception: authenticated callers receive EXECUTE only on a fixed-search-path one-UUID function that independently checks `private.is_approved_admin()` and can delete at most one primary-key row. The protected application action repeats authorization, validates one UUID, requires explicit confirmation, and exposes no bulk operation. Do not add anonymous, unapproved, array, filter, or bulk deletion.

## Required role probes

With a configured disposable database, verify anon and unapproved authenticated roles cannot select, insert, update, or delete any protected record; an approved administrator can read protected data, update only inquiry `status`, and invoke only the one-UUID delete function; direct browser-role table DELETE remains denied; and the service role is usable only from a trusted server context. Also verify every aggregate view/function denies data to non-admin callers, functions reject out-of-bound intervals, and daily rows follow Asia/Manila date boundaries. For migration `009`, prove omitted retry/provenance fields fail closed, a non-v4 UUID and an invalid notice version are rejected, browser roles cannot execute the storage function, the service role receives `created` for a new ID and `duplicate` for an identical retry, the same ID with changed fields returns `conflict` without changing or duplicating the original row, exact confirmed deletion remains limited to an approved administrator, an expired inquiry is removed while a current control remains, application roles cannot execute pruning, and the analytics-retention job is unchanged.

## Dormant application deployment boundary

Migration `009` remains unapplied to the linked project even when its application integration is committed and deployed dormant. Do not apply the migration remotely, publish inquiry surfaces, or enable Production inquiry submission until the later controlled database and release gates pass. The remote production migration history remains `001`–`008`, and Production `CONTACT_INQUIRY_VISIBLE` plus `CONTACT_INQUIRY_ENABLED` remain false/absent at this boundary.

## Environment and sensitive files

Migrations contain no environment values. CLI linking credentials remain outside the repository. Policy migrations, privilege statements, security-definer functions, foreign-key deletion behavior, and any migration touching personal inquiry data must not be edited casually.
