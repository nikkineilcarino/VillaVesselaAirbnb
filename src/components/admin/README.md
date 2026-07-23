# Administrator Components

`AdminHeader` is rendered only after the protected layout authorizes the request. Its wrapping navigation provides dashboard/inquiry/public links, a non-sensitive display name, and a POST-backed Server Action logout control. It does not query auth state in the browser or render user IDs/tokens.

The dashboard components render one shared date range, ten metric cards, five responsive Recharts visualizations, accessible data tables, and three recent-activity tables. Only `DashboardCharts` is a Client Component. It receives aggregate rows without visitor IDs, inquiry details, or destination URLs; chart animation is disabled and every visualization has a textual table equivalent.

Recent tables are server-rendered, limited to 15 rows, and show shortened anonymous identifiers. The inquiry overview displays the requested guest name but summarizes the contact channel instead of showing the contact value. Empty, invalid-filter, database-unavailable, loading, and unexpected-error states must remain distinct.

`DashboardExportLinks` creates only three fixed same-origin downloads for the already validated dashboard period. `InquiryStatusSubmitButton` is the only inquiry-management Client Component and receives no guest data or database ID; it reads the enclosing form's pending state only.
