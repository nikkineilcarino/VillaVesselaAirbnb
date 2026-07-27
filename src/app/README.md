# Application Routes

## Purpose

This directory owns the Next.js App Router tree, document shell, public/administrator route metadata and states, privacy/system metadata routes, administrator authentication/dashboard/inquiry routes, privacy-safe analytics and inquiry POST handlers, and protected CSV exports. Public pages remain available without authentication; only `/admin/login` is public within the administrator tree.

## Current files and responsibilities

- `layout.tsx` defines the HTML document, base metadata, global stylesheet, and skip link.
- `(public)/layout.tsx` applies the shared public header and footer without affecting future administrator routes.
- `(public)/page.tsx` composes the complete Phase 3 homepage from focused Server Components in `src/components/home/`.
- `(public)/accommodation/page.tsx` presents capacity, spaces, facilities, and explicitly unconfirmed inclusions.
- `(public)/amenities/page.tsx` groups supplied amenities, confirmation states, connectivity, and optional-service caveats.
- `(public)/guest-guide/page.tsx` presents arrival, packing, self-catering, rules, fees, attractions, and FAQ content through anchored sections.
- `(public)/gallery/page.tsx` presents 37 supplied photographs and three explicit open photo slots through an accessible lightbox experience.
- `(public)/reviews/page.tsx` presents supplied Airbnb ratings/excerpts and unfilled Messenger review positions.
- `(public)/location/page.tsx` presents the confirmed address, approach directions, address-copy action, and disabled map state.
- `(public)/contact/page.tsx` is dynamic so one server-only runtime flag can select the safe disabled inquiry preview or the operational form.
- `(public)/privacy/page.tsx` documents actual conditional collection, browser storage, administrator access, provider/external-site boundaries, and unresolved retention/deletion/request controls.
- `admin/login/` provides dynamic, noindex email/password sign-in through a bounded Server Action without registration.
- `admin/(protected)/layout.tsx` repeats server-side identity/profile authorization before rendering the dashboard shell.
- `admin/(protected)/dashboard/page.tsx` resolves the reporting period, runs the authenticated Phase 9 query, and composes cards, charts, activity, definitions, and truthful data states.
- `admin/(protected)/inquiries/page.tsx` lists twenty RLS-authorized inquiries per page and binds only allowlisted status updates to its Server Action.
- `admin/exports/[type]/route.ts` independently authorizes and returns bounded page-view, link-click, or inquiry CSV attachments.
- `admin/(protected)/dashboard/loading.tsx` and `error.tsx` provide dashboard-specific non-revealing states inside the protected shell.
- `admin/loading.tsx` and `admin/error.tsx` provide non-revealing private-route states.
- `api/analytics/page-view/route.ts` validates, limits, and best-effort inserts minimized public route events.
- `api/analytics/link-click/route.ts` additionally requires an exact configured type/destination pair before insertion.
- `api/contact/route.ts` exposes a default-disabled, size/origin/schema/rate-bounded inquiry insert boundary.
- `robots.ts`, `sitemap.ts`, and `manifest.ts` expose validated, bounded static discovery/install metadata.
- `opengraph-image.tsx` renders a 1200 × 630 social card from the approved high-resolution Villa Vessela photo-wall image with a legible branded overlay.
- `globals.css` imports Tailwind CSS, defines semantic design tokens, provides minimal base rules, and respects reduced-motion preferences.
- `loading.tsx`, `error.tsx`, and `not-found.tsx` provide accessible route-level states without exposing technical error details.

## Interactions

Routes import reusable components from `src/components`, utilities from `src/lib`, and—once introduced—typed facts from `src/data`. Database access, authorization, and secret-dependent work must stay in server-only modules or server route handlers.

## Adding functionality safely

1. Put public page UI in the existing `(public)` route group so it inherits the verified shared shell.
2. Default to Server Components; add `"use client"` only at the smallest browser-interaction boundary.
3. Read property facts from centralized typed data rather than copying them into page files.
4. Give each public route accurate metadata and a unique primary heading.
5. Add or update Playwright route coverage before declaring the route complete.

## Restrictions

- Do not add guest login or registration routes.
- Do not make `/admin/*` public except `/admin/login`.
- Do not read server secrets in Client Components.
- Do not make public rendering depend on analytics or database availability.
- Do not duplicate homepage facts in route files; extend the appropriate typed module in `src/data/`.

## Environment variables

`NEXT_PUBLIC_SITE_URL` supplies the canonical base URL. Public indexing requires a valid public HTTPS origin; missing/local/unsafe/reserved values fail closed to noindex and disallow-all robots. Administrator routes require Supabase and an approved Auth/profile identity. Analytics mounts only when its server/build flag is exactly true. Inquiry submission is enabled only when `CONTACT_INQUIRY_ENABLED` is exactly true. Both public insert features need the Supabase URL plus server-only service key to persist; public rendering remains independent of storage. Server-only/test-only values must never be interpolated into metadata or client props.

## Testing

Run lint, strict typecheck, focused tests, Playwright route/accessibility/metadata/header checks, and a production build. Inspect production canonical/robots/social/header outputs whenever the origin changes. Route-state components also require keyboard and screen-reader-oriented manual review.

## Security and privacy

Errors shown to visitors must be non-revealing. Public pages may expose only explicitly approved, validated contacts; they must not expose incomplete destinations, database identifiers, visitor IDs, or configuration secrets. Admin authorization is enforced by the proxy/session boundary, protected server layout, repeated export authorization, and database RLS-aware reads/updates. Inquiry exports contain voluntary personal data and must remain private.

## Files requiring careful review

Edit `layout.tsx`, `globals.css`, future `proxy.ts`, route handlers, authentication routes, and metadata/system routes carefully because they affect the entire site, security boundary, or public discoverability.
