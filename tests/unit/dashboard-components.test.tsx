import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { DashboardActivityTables } from "@/components/admin/DashboardActivityTables";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { DashboardMetricCards } from "@/components/admin/DashboardMetricCards";
import { DashboardOperationalStatus } from "@/components/admin/DashboardOperationalStatus";
import type { DashboardLinkTotal } from "@/types/dashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const completeLinkTotals: DashboardLinkTotal[] = [
  { label: "Airbnb", linkType: "airbnb", total: 2 },
  { label: "Facebook", linkType: "facebook", total: 1 },
  { label: "Messenger", linkType: "messenger", total: 0 },
  { label: "Google Maps", linkType: "google_maps", total: 0 },
  { label: "Waze", linkType: "waze", total: 0 },
  { label: "WhatsApp", linkType: "whatsapp", total: 0 },
  { label: "Phone", linkType: "phone", total: 0 },
  { label: "Email", linkType: "email", total: 0 },
  { label: "Other", linkType: "other", total: 0 },
];

describe("dashboard presentation states", () => {
  it("renders every chart with a non-visual data-table equivalent", () => {
    const html = renderToStaticMarkup(
      <DashboardCharts
        daily={[
          {
            date: "2026-07-23",
            label: "Jul 23",
            pageViews: 5,
            uniqueVisitors: 3,
          },
        ]}
        devices={[
          { deviceType: "mobile", label: "Mobile", total: 3 },
          { deviceType: "tablet", label: "Tablet", total: 0 },
          { deviceType: "desktop", label: "Desktop", total: 2 },
          { deviceType: "unknown", label: "Unknown", total: 0 },
        ]}
        links={[
          { label: "Airbnb", linkType: "airbnb", total: 2 },
          { label: "Facebook", linkType: "facebook", total: 1 },
        ]}
        pages={[
          { path: "/", total: 3 },
          { path: "/gallery", total: 2 },
        ]}
      />,
    );

    for (const title of [
      "Daily unique visitors",
      "Page-view trend",
      "External-link clicks",
      "Device distribution",
      "Most-viewed pages",
    ]) {
      expect(html).toContain(title);
    }

    expect(html.match(/View accessible data table/g)).toHaveLength(5);
    expect(html).toContain("Estimated visitors");
    expect(html).toContain("/gallery");
  });

  it("renders honest zero metrics and empty table states without sensitive values", () => {
    const metrics = renderToStaticMarkup(
      <DashboardMetricCards
        links={completeLinkTotals}
        showInquiries
        summary={{
          airbnbClicks: 0,
          clickThroughRate: 0,
          estimatedUniqueVisitors: 0,
          facebookClicks: 0,
          googleMapsClicks: 0,
          hasDemonstrationData: false,
          newInquiries: 0,
          sessions: 0,
          totalExternalLinkClicks: 0,
          totalPageViews: 0,
          uniqueClickingVisitors: 0,
          whatsappClicks: 0,
        }}
      />,
    );
    const tables = renderToStaticMarkup(
      <DashboardActivityTables
        inquiries={[]}
        links={[]}
        pages={[]}
        showInquiries
      />,
    );

    expect(metrics).toContain("0.0%");
    expect(metrics).toContain("Estimated unique visitors");
    expect(metrics).toContain("Every supported reporting category is shown");
    expect(metrics).toContain("among people who allowed analytics");
    for (const link of completeLinkTotals) {
      expect(metrics).toContain(`${link.label} clicks`);
    }
    expect(tables).toContain("No page activity was recorded");
    expect(tables).toContain("No external-link clicks were recorded");
    expect(tables).toContain("No inquiries were received");
    expect(tables).not.toMatch(/destination_url|session_id|message|consent/i);
  });

  it("omits unfinished inquiry metrics and activity from the administrator dashboard", () => {
    const metrics = renderToStaticMarkup(
      <DashboardMetricCards
        links={completeLinkTotals}
        showInquiries={false}
        summary={{
          airbnbClicks: 0,
          clickThroughRate: 0,
          estimatedUniqueVisitors: 0,
          facebookClicks: 0,
          googleMapsClicks: 0,
          hasDemonstrationData: false,
          newInquiries: 7,
          sessions: 0,
          totalExternalLinkClicks: 0,
          totalPageViews: 0,
          uniqueClickingVisitors: 0,
          whatsappClicks: 0,
        }}
      />,
    );
    const tables = renderToStaticMarkup(
      <DashboardActivityTables
        inquiries={[
          {
            contactMethod: "Email",
            guestCount: 2,
            name: "Hidden Guest",
            occurredAt: "31 Aug 2026, 10:00",
            preferredDates: "Not provided",
            status: "new",
          },
        ]}
        links={[]}
        pages={[]}
        showInquiries={false}
      />,
    );

    expect(metrics).not.toContain("New inquiries");
    expect(tables).not.toMatch(/inquir|Hidden Guest/i);
  });

  it("renders truthful disabled, unavailable, configured-no-data, activity, and refresh states", () => {
    const common = {
      lastLinkClickAt: null,
      lastPageViewAt: null,
      refreshedAt: "2026-08-10T14:00:00.000Z",
    } as const;
    const disabled = renderToStaticMarkup(
      <DashboardOperationalStatus
        status={{
          ...common,
          collectionEnabled: false,
          reportingAvailable: false,
          storageConfigured: false,
        }}
      />,
    );
    const unavailable = renderToStaticMarkup(
      <DashboardOperationalStatus
        status={{
          ...common,
          collectionEnabled: true,
          reportingAvailable: true,
          storageConfigured: false,
        }}
      />,
    );
    const noData = renderToStaticMarkup(
      <DashboardOperationalStatus
        status={{
          ...common,
          collectionEnabled: true,
          reportingAvailable: true,
          storageConfigured: true,
        }}
      />,
    );
    const activity = renderToStaticMarkup(
      <DashboardOperationalStatus
        status={{
          ...common,
          collectionEnabled: true,
          lastLinkClickAt: "2026-08-10T13:00:00.000Z",
          lastPageViewAt: "2026-08-10T12:00:00.000Z",
          reportingAvailable: true,
          storageConfigured: true,
        }}
      />,
    );

    expect(disabled).toContain("Analytics collection is disabled");
    expect(disabled).toContain("Unconfigured");
    expect(unavailable).toContain("Analytics storage is unavailable");
    expect(unavailable).toContain("Authenticated reporting");
    expect(noData).toContain("Analytics is configured; no stored activity yet");
    expect(noData).toContain("No record found");
    expect(activity).toContain("Stored analytics activity is available");
    expect(activity).toContain('dateTime="2026-08-10T12:00:00.000Z"');
    expect(activity).toContain('dateTime="2026-08-10T13:00:00.000Z"');
    expect(activity).toContain("Last refreshed:");
    expect(activity).toContain("Refresh dashboard");
    expect(activity).not.toMatch(/service.role|anon.key|supabase\.co/i);
  });
});
