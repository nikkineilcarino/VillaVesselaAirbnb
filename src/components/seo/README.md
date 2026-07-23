# SEO Components

`StructuredData` is a Server Component that writes already constructed JSON-LD and escapes `<` before insertion. Property and breadcrumb graphs are built in `src/lib/seo/structuredData.ts`; keep data decisions there rather than embedding arbitrary objects in route components.

Never render untrusted input, inquiry records, analytics identifiers, secrets, placeholder images, unapproved contacts, or unverified property facts as structured data. Validate emitted JSON in browser tests and external validators after deployment.
