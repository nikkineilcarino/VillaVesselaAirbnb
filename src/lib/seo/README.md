# SEO and public URL boundaries

`siteUrl.ts` accepts only an HTTPS origin or documented local HTTP origin with no credentials, path, query, or fragment. Missing or invalid configuration falls back to `http://localhost:3000` for local builds, but that fallback is deliberately non-indexable. Production must set `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin.

`metadata.ts` centralizes canonical, Open Graph, Twitter-card, and placeholder-share-image fields. `structuredData.ts` serializes JSON-LD with `<` escaped and exposes only source-grounded lodging and breadcrumb facts.

The lodging graph intentionally omits placeholder images, exact coordinates, map URLs, public contacts, rates, expanded capacity, kubo/cottage inclusion, and unconfirmed amenities. Do not change the type to Google `VacationRental` rich-result markup until its photo, location, identifier, and eligibility requirements are actually satisfied.

Run metadata, sitemap, robots, manifest, JSON-LD, security-header, accessibility, and production-build checks after changes. Never place secrets, private contacts, raw analytics identifiers, inquiry data, or guessed business facts in metadata or structured data.
