# Shared Types

## Purpose and responsibilities

This directory contains cross-module TypeScript contracts. `database.ts` mirrors the public schema and dashboard functions introduced by the ordered Supabase migrations. `analytics.ts` defines Phase 8 minimized analytics shapes. `dashboard.ts` defines Phase 9 reporting contracts. `inquiries.ts` defines Phase 10 status, form-error, untrusted payload, and validated storage shapes. `csv.ts` allowlists the three export types.

## Interactions

Supabase client factories import `Database` as a type. Analytics and inquiry browser/endpoint modules share minimized types, while inserts map camel-case validated fields explicitly to reviewed database columns. Dashboard server/query/component modules share `dashboard.ts`; only aggregate chart contracts cross the Client Component boundary. CSV routes accept only `CsvExportType`.

## Safe extension and restrictions

- Apply and review a migration before changing its corresponding TypeScript shape.
- Regenerate types from the linked Supabase project after migrations are applied, then review the diff instead of blindly replacing safeguards.
- Do not add Auth secrets, credentials, production records, or business configuration here.
- Do not describe the hand-maintained Phase 6 mirror as generated from a live project until that command has actually run.

## Environment, testing, and security

This directory reads no environment variables. Run strict typecheck, database contract tests, and a production build after changes. `database.ts` is security-sensitive because incorrect optionality can hide missing validation, but TypeScript does not replace RLS or server-side checks.
