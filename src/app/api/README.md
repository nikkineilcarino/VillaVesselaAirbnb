# Application API Routes

These Node.js Route Handlers are server trust boundaries:

- `/api/analytics/page-view` and `/api/analytics/link-click` accept minimized, best-effort events only when analytics is enabled.
- `/api/contact` accepts an explicit inquiry only when the inquiry feature is enabled. It returns `201` after a new row, `200` for an identical retry, `409` when the same submission ID arrives with changed intake fields, and `503` when storage is unavailable. The conflict path preserves the original row and never presents the edited request as received. A `202` with the fixed received body is reserved for the intentional honeypot decoy.
- `/admin/exports/[type]` is an administrator-only CSV download route; it lives under the protected admin matcher and repeats authorization inside the handler.

Public handlers require bounded JSON, exact trusted browser origins, strict schemas, rate limits, non-revealing responses, private/no-store caching, and fixed payload-free logs. Inquiry intake stops streaming once its actual body exceeds 8 KiB, requires an exact `Origin` match to the trusted canonical site origin, and supplies an accurate `Retry-After` on `429`. Its strict request requires a client-stable UUID v4 and the rendered privacy-notice version. The latter is only a freshness assertion: the server requires the current value, then supplies its own trusted notice constant to the service-role-only `store_contact_inquiry` function. That narrow function hard-codes consent, initial status, and server time and returns only `created`, `duplicate`, or `conflict`, never a row. Public handlers may use the service role only after their independent validations succeed. Export handlers use the authenticated RLS-bound client; exact administrator deletion uses the authenticated request-scoped client plus an independently authorizing one-UUID function. Neither uses the service role.

Never add raw request logging, public read endpoints, arbitrary destination/redirect/export targets, payment collection, or secrets. Every new handler requires unit failure coverage, browser checks where applicable, a bundle secret scan, and live database checks before production claims.
