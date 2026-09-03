# Shared Libraries

## Purpose

This directory owns framework-independent helpers, carefully separated Supabase boundaries, server-only administrator authorization, bounded request validation, normalized public/canonical configuration, privacy-safe analytics, administrator dashboard data preparation, feature-flagged inquiries, protected CSV encoding/query logic, and verified-fact SEO construction.

## Current files and responsibilities

- `utils.ts` exports `cn`, the shared conditional-class and Tailwind-conflict resolver.
- `supabase/client.ts` creates an optional browser client using only public configuration.
- `supabase/server.ts` creates an optional cookie-aware server client that remains subject to RLS.
- `supabase/service.ts` creates the full-privilege server-only client used by the two validated analytics insert handlers and available to the default-disabled validated inquiry handler.
- `supabase/README.md` documents configuration, trust boundaries, and required live role tests.
- `supabase/proxy.ts` verifies/refreshes request sessions and preserves response cookies/private cache headers for `/admin/*`.
- `supabase/config.ts` validates the public endpoint/key pair and applies SameSite plus production-Secure cookie options consistently.
- `auth/admin.ts` verifies current Auth identity and an RLS-visible `admin_profiles` row on the server.
- `validation/auth.ts` bounds the untrusted login payload with Zod.
- `validation/analytics.ts` strictly validates minimized page-view/link-click payloads and exact destinations.
- `validation/inquiry.ts` sanitizes and validates voluntary contact/date/guest/message/consent inputs and rejects payment-card patterns.
- `analytics/` owns identifier/session lifetimes, coarse classification, normalization, request bounds, in-process rate limits, best-effort dispatch, server flags, and safe failure logging.
- `dashboard/` owns Asia/Manila ranges, aggregate normalization, display-safe formatting, and authenticated RLS-constrained queries.
- `inquiries/` owns public request/rate/handler boundaries, random form-session IDs, admin filters, and RLS-bound inquiry queries.
- `csv/` owns formula-safe encoding and bounded authenticated export queries.
- `rateLimit.ts` supplies the bounded generic in-process fixed-window primitive shared by analytics and inquiries.
- `config/publicDestinations.ts` turns approved public values into normalized HTTPS, email, phone, and WhatsApp destinations or `null`.
- `seo/` owns canonical-origin validation, page/social metadata helpers, public sitemap alignment, escaped breadcrumb JSON-LD, and conservative lodging structured data.

## Interactions

Routes and components may import safe shared utilities through the `@/` alias. Browser and ordinary server Supabase clients use the anon key and RLS; only the independently validated analytics/contact insertion handlers may import the service-role factory.

## Adding functionality safely

Create a feature subdirectory only when responsibilities are substantial. Keep pure functions pure, use explicit input/output types, validate untrusted input at server boundaries, and add focused tests alongside the central test structure.

## Restrictions

- Do not create a generic dumping-ground utility module.
- Do not import server-only dependencies into browser-safe files.
- Do not access the service-role key outside the narrowly documented privileged server module.
- Do not log secrets, full inquiry payloads, or visitor identifiers.

## Environment variables

Supabase factories read the documented public project values or the server-only `SUPABASE_SERVICE_ROLE_KEY`. The modern backend secret bypasses RLS, so its effective scope comes from Production-only isolation and narrow reviewed call sites rather than an insert-only database privilege. Analytics activation uses `ANALYTICS_ENABLED`; inquiry publication uses server-only `CONTACT_INQUIRY_VISIBLE`, while endpoint collection separately requires `CONTACT_INQUIRY_ENABLED`. Enabled collection always implies visibility. Missing/unsafe configuration returns `null`; the backend secret and test credentials are never browser-readable.

## Testing

Pure utilities require Vitest coverage for normal and boundary cases. Server integrations require mocked failure tests plus real configured integration checks where credentials are available. Security-policy behavior is tested independently at the database boundary.

## Security and privacy

Treat analytics, authorization, destination/canonical validation, structured data, contact validation, and CSV export as security-sensitive. Apply least privilege, length limits, safe errors, fact minimization, and data minimization.

## Files requiring careful review

Files under `auth/`, `supabase/`, `analytics/`, `dashboard/`, `inquiries/`, `csv/`, `seo/`, and `validation/` affect authorization, privacy, public discoverability, or data integrity and must not be edited casually.
