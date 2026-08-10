# Administrator Components

`AdminHeader` is rendered only after the protected layout authorizes the request. Its wrapping navigation provides dashboard/inquiry/public links, a non-sensitive display name, and a POST-backed Server Action logout control. It does not query auth state in the browser or render user IDs/tokens.

The dashboard components render one shared date range, six overview metrics, a visible nine-category link-click breakdown, five responsive Recharts visualizations, accessible data tables, and three recent-activity tables. `DashboardCharts` is a Client Component for responsive charts. `DashboardRefreshControl` is a narrow Client Component that calls `router.refresh()` and receives only the last-refreshed timestamp; it does not poll or receive credentials.

`DashboardOperationalStatus` distinguishes collection disabled, write configuration missing, authenticated reporting unavailable, configured with no stored activity, and stored activity present. It shows only booleans and the newest page/link timestamps. Configuration presence is not described as proof of live insertion; that requires separate production QA.

Recent tables are server-rendered, limited to 15 rows, and show shortened anonymous identifiers. The inquiry overview displays the requested guest name but summarizes the contact channel instead of showing the contact value. Empty, invalid-filter, database-unavailable, loading, and unexpected-error states must remain distinct.

`DashboardExportLinks` creates only three fixed same-origin downloads for the already validated dashboard period. `InquiryStatusSubmitButton` is the only inquiry-management Client Component and receives no guest data or database ID; it reads the enclosing form's pending state only.
