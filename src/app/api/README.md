# Application API Routes

These Node.js Route Handlers are server trust boundaries:

- `/api/analytics/page-view` and `/api/analytics/link-click` accept minimized, best-effort events only when analytics is enabled.
- `/api/contact` accepts an explicit inquiry only when the inquiry feature is enabled and confirms success only after storage.
- `/admin/exports/[type]` is an administrator-only CSV download route; it lives under the protected admin matcher and repeats authorization inside the handler.

Public handlers require bounded JSON, same-origin browser context, strict schemas, rate limits, non-revealing responses, private/no-store caching, and fixed payload-free logs. They may use the service role only after their independent validations succeed. Export handlers use the authenticated RLS client, not the service role.

Never add raw request logging, public read endpoints, arbitrary destination/redirect/export targets, payment collection, or secrets. Every new handler requires unit failure coverage, browser checks where applicable, a bundle secret scan, and live database checks before production claims.

