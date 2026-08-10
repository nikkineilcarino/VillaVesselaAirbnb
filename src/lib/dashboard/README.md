# Administrator Dashboard Library

This directory owns Phase 9 date-range resolution, aggregate normalization, display-safe formatting, and authenticated dashboard queries.

`dateRange.ts` interprets presets and custom dates as `Asia/Manila` calendar days. It converts inclusive local dates into a start-inclusive/end-exclusive UTC interval and rejects malformed, future, reversed, or longer-than-366-day ranges. Cards, charts, and activity queries receive that same interval.

`query.ts` uses the request-scoped Supabase server client, never the service-role client. The approved administrator's session and database RLS remain authoritative. Aggregate RPCs are `SECURITY INVOKER`; recent tables select only fields needed for the dashboard and cap results at 15 rows. Full event IDs, destination URLs, inquiry messages, consent values, and exact contact details are not returned to browser chart components. Anonymous IDs are shortened before rendering.

`status.ts` uses the same request-scoped, RLS-bound client to read only the newest page-view and link-click timestamps. It reports server feature-switch and write-configuration presence as booleans without returning or using the service-role value. `operational.ts` resolves the display state as a pure function. Configuration and read reachability never substitute for a live stored-event proof.

`aggregation.ts` converts database counts defensively, applies the documented click-through-rate definition, fills missing daily dates with zeros, normalizes all supported link categories including Waze, and provides Asia/Manila display formatting. Unit-test these pure functions when changing date rules or metrics.

Local seed records are synthetic and detected by their explicit demo markers. The dashboard displays a warning whenever the selected period includes them. Never add a production sample-data fallback or disguise database outages as an empty dataset.
