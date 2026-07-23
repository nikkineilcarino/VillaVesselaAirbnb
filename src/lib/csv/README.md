# Protected CSV Exports

`csv.ts` is a pure encoder. It quotes every cell, doubles embedded quotes, preserves line breaks inside quoted cells, emits CRLF with a UTF-8 BOM, and prefixes cells whose first meaningful character could trigger a spreadsheet formula. CSV defenses reduce risk but do not make exported personal data safe to share.

`export.ts` is server-only. It queries through the approved administrator's authenticated RLS client, applies the same validated Asia/Manila range as the dashboard, requests rows in 1,000-record pages, and stops at 10,000 records. It returns human-readable columns and omits database IDs, session IDs, destination URLs, and other unnecessary technical fields.

The download Route Handler independently repeats administrator authorization, validates the export type/date range, emits fixed filenames plus `attachment`, `nosniff`, no-store, no-referrer, and restrictive content security headers. Never convert it to a service-role query or accept arbitrary table/column/order input.
