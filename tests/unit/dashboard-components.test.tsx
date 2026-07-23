import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DashboardActivityTables } from "@/components/admin/DashboardActivityTables";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { DashboardMetricCards } from "@/components/admin/DashboardMetricCards";

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
      <DashboardActivityTables inquiries={[]} links={[]} pages={[]} />,
    );

    expect(metrics).toContain("0.0%");
    expect(metrics).toContain("Estimated unique visitors");
    expect(tables).toContain("No page activity was recorded");
    expect(tables).toContain("No external-link clicks were recorded");
    expect(tables).toContain("No inquiries were received");
    expect(tables).not.toMatch(/destination_url|session_id|message|consent/i);
  });
});

