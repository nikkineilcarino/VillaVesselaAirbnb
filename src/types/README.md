# Shared Types

## Purpose and responsibilities

This directory contains cross-module TypeScript contracts. `database.ts` mirrors the public schema and functions introduced by the ordered Supabase migrations, including migration `009` inquiry lifecycle columns plus the narrow store/delete functions. `analytics.ts` defines Phase 8 minimized analytics shapes. `dashboard.ts` defines Phase 9 reporting contracts. `inquiries.ts` defines the current Phase 10 status, form-error, untrusted payload, and validated storage shapes. `csv.ts` allowlists the three export types.

## Interactions

Supabase client factories import `Database` as a type. Analytics and inquiry browser/endpoint modules share minimized types. The inquiry request requires one client-stable UUID v4 per logical submission and the privacy-notice version rendered with that form. The notice value is an untrusted freshness assertion: strict validation requires the current version, then drops it from `ValidatedInquiry`; the route supplies its own trusted constant to `store_contact_inquiry`. That service-only function reports only `created`, `duplicate`, or `conflict`, and `delete_contact_inquiry` accepts only one inquiry UUID. The separate session rate-limit UUID remains unstored. Dashboard server/query/component modules share `dashboard.ts`; only aggregate chart contracts cross the Client Component boundary. CSV routes accept only `CsvExportType`.

## Safe extension and restrictions

- Apply and review a migration before changing its corresponding TypeScript shape.
- Regenerate types from the linked Supabase project after migrations are applied, then review the diff instead of blindly replacing safeguards.
- Keep the submission ID required and UUID-v4-constrained at both the strict request boundary and database boundary; identical retries may reuse it, while a changed payload with the same ID must conflict rather than overwrite the stored row.
- Keep the rendered privacy-notice version in the request only as a current-version assertion. Never use the visitor-supplied value as storage authority; the route must select the trusted constant.
- Treat the generated database return type for `store_contact_inquiry` as untrusted text and narrow it to the three reviewed result values before choosing an HTTP response.
- Do not add Auth secrets, credentials, production records, or business configuration here.
- Do not describe the hand-maintained Phase 6 mirror as generated from a live project until that command has actually run.

## Environment, testing, and security

This directory reads no environment variables. Run strict typecheck, database contract tests, and a production build after changes. `database.ts` is security-sensitive because incorrect optionality can hide missing validation, but TypeScript does not replace RLS or server-side checks.
