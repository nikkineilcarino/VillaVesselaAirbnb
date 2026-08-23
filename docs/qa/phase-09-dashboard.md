# Phase 9 QA — Administrator Dashboard

> **Historical snapshot.** Populated production reporting, RLS/RPC reconciliation, all nine link categories, accessible chart tables, recent activity, refresh, and page/link CSV checks later passed on 2026-08-10; see [`analytics-activation-2026-08-10.md`](analytics-activation-2026-08-10.md). Production-authenticated mobile tooltip/legend interaction remains a narrow follow-up.

## Status

**Completed, not QA passed.**

The implementation, static contracts, unit/component rendering, credential-independent browser regression, dependency audit, and production build pass. Live migration/RLS/function execution and an approved administrator's populated, empty, tooltip, keyboard, and responsive chart states are blocked because the Docker engine is unavailable and no approved non-production Supabase project or dedicated test identities were supplied.

No Git repository, GitHub remote, Vercel project, production Supabase project, or production data was changed.

## Source requirements reviewed

The 42-page project package was re-read before implementation. Phase 9 implements the dashboard and metric-definition requirements on PDF pages 34–35:

- nine requested cards plus the separately defined Sessions metric;
- daily visitors, page views, external-link comparison, device distribution, and most-viewed-page charts;
- Today, Last 7 days, Last 30 days, Current month, and custom date ranges;
- recent page, link, and inquiry tables;
- responsive navigation and loading/empty/error states;
- accessible chart summaries and visibly labelled demonstration data;
- exact Asia/Manila date and aggregate definitions.

The optional referrer chart is not included. CSV export, inquiry status management, and contact submission remain in the explicitly planned Phase 10.

## Implemented architecture

### One reporting range

`src/lib/dashboard/dateRange.ts` treats every input as an Asia/Manila calendar date and produces one start-inclusive/end-exclusive UTC interval. It rejects:

- unknown presets;
- missing/malformed/impossible custom dates;
- a start later than the end;
- a future end date in Asia/Manila;
- custom periods longer than 366 inclusive days.

The same interval is passed to cards, all charts, and all recent-activity queries.

### Exact database aggregation

Migration `007_create_dashboard_functions.sql` adds five `SECURITY INVOKER` functions:

1. exact summary cards and demonstration-data marker;
2. daily page views/distinct visitors grouped at Asia/Manila;
3. coarse device totals;
4. approved link-type totals;
5. top ten normalized paths.

Execution is revoked from default/anonymous callers and granted to `authenticated`; base-table RLS remains authoritative. Every function rejects non-positive or longer-than-366-day intervals. CTR uses the distinct link-clicking visitor IDs that also appear among period page viewers, divided by distinct period page visitors, and returns zero when the denominator is zero.

### Data minimization

- The dashboard uses `createServerSupabaseClient()`, not the service-role client.
- Recharts receives only daily/category/path aggregate arrays.
- Full event/database IDs never render.
- Anonymous visitor IDs are shortened to eight characters before display.
- Destination URLs, session IDs, inquiry messages, consent values, and exact email/phone values are absent from the dashboard component contract.
- Inquiry contact is displayed only as Email, Phone or messaging, Email and phone, or Unavailable.
- Recent page, link, and inquiry tables are separately capped at 15 rows.
- A database/query failure is shown as unavailable, never disguised as a successful empty result.

## UI delivered

- Responsive wrapping administrator navigation with Dashboard, Public site, and Sign out.
- Ten summary cards: estimated visitors, views, sessions, Airbnb/Facebook/Google Maps/WhatsApp clicks, total external clicks, CTR, and new inquiries.
- Five route-scoped Recharts views with animation disabled.
- An expandable semantic HTML data table beside every chart.
- Three responsive, horizontally scrollable recent-activity tables.
- Explicit invalid-filter, loading, successful-empty, data-unavailable, unexpected-error, and demonstration-data states.
- A disclosure containing the metric and timezone definitions.

## Files added or materially changed

- `src/app/admin/(protected)/dashboard/`
- `src/components/admin/Dashboard*.tsx`
- `src/lib/dashboard/`
- `src/types/dashboard.ts`
- `src/types/database.ts`
- `supabase/migrations/007_create_dashboard_functions.sql`
- `tests/unit/dashboard.test.ts`
- `tests/unit/dashboard-components.test.tsx`
- `tests/e2e/admin-auth.live.spec.ts`
- `package.json`, `package-lock.json`, and `vitest.config.ts`

## Verification evidence

| Check | Result | Status |
| --- | --- | --- |
| ESLint | `npm run lint` | Pass |
| Strict TypeScript | `npm run typecheck` | Pass |
| Vitest | 44 tests across 6 files | Pass |
| Dashboard date tests | Manila rollover, all presets, custom UTC conversion, impossible/reversed/future/overlong rejection | Pass |
| Aggregate tests | zero-denominator CTR, bounded CTR, count normalization, missing-day filling, category zero filling | Pass |
| Presentation tests | all five charts statically render with HTML data-table equivalents; zero/empty cards and tables render | Pass |
| Query privacy contract | authenticated RLS client only; three 15-row limits; no destination/message/consent selection | Pass |
| Migration static contract | ordered migration, five invoker functions, 366-day guards, authenticated-only grants, top-10 limit | Pass |
| Credential-independent Playwright | 40 passed | Pass |
| Live administrator Playwright | 2 skipped because dedicated credentials are absent | Blocked |
| Production build | Dynamic `/admin/dashboard`; public routes remain static | Pass |
| Dependency audit | 0 vulnerabilities | Pass |
| UTF-8 scan | 200 text files; 0 replacement/mojibake markers | Pass |
| Private-contact scan | 2 private source patterns detected in the PDF; 0 repository and 0 build matches | Pass |
| Browser bundle scan | 0 privileged-key/client marker files; 0 raw dashboard-field marker files | Pass |
| Dashboard privilege scan | 0 dashboard files consume the service-role client | Pass |
| Local Supabase status | Docker engine pipe unavailable | Blocked |
| Live migration/function/type/role checks | No running local or approved remote project | Blocked |
| Authenticated chart viewport/tooltips | No approved live administrator runtime | Blocked |

## Issues found and resolved

1. Recharts requires `react-is` to match the installed React version. Exact `recharts@3.10.0` and `react-is@19.2.8` were locked.
2. Summing daily distinct visitor counts would double-count repeat visitors across dates. Exact period totals and CTR now run inside bounded PostgreSQL functions.
3. Raw activity rows would send unnecessary identifiers into the chart client bundle. Only aggregates cross that boundary; tables remain server-rendered and IDs are shortened.
4. A database outage could otherwise look like a zero-activity day. Unavailable and successful-empty states are now separate.
5. The original Vitest include pattern ignored `.test.tsx`; it now includes both TypeScript and TSX unit tests.

## Live completion checklist

Before marking Phase 9 QA passed:

1. Start disposable local Supabase or supply an approved non-production project.
2. Apply migrations `001` through `007`; run database lint and compare generated types.
3. Provision one dedicated approved administrator and one dedicated unapproved account.
4. Verify anon/unapproved callers cannot obtain dashboard aggregates or base rows.
5. Verify exact card/chart values against known records spanning Asia/Manila midnight and repeated visitors.
6. Verify custom range boundaries, zero-denominator CTR, top-page ordering, and 15-row limits.
7. Verify the explicit demo banner with local seed and its absence with non-demo data.
8. Exercise populated, empty, and forced query-failure states.
9. Inspect desktop/mobile chart sizing, tooltips, legends, keyboard accessibility, focus, zoom, and the five textual tables.
10. Inspect sign out, session refresh, noindex/private caching, and absence of sensitive values in HTML/RSC/browser bundles.

## Primary references

- Recharts ResponsiveContainer: <https://recharts.github.io/en-US/api/ResponsiveContainer/>
- Recharts chart accessibility layer: <https://recharts.github.io/en-US/api/PieChart/>
- Recharts package/release metadata: <https://www.npmjs.com/package/recharts>
- Supabase Row Level Security: <https://supabase.com/docs/guides/database/postgres/row-level-security>
