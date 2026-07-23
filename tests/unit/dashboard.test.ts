import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  calculateClickThroughRate,
  createDailyAnalyticsSeries,
  describeContactMethod,
  formatInquiryDates,
  formatReferrer,
  normalizeDashboardSummary,
  normalizeDeviceTotals,
  normalizeLinkTotals,
  shortenAnonymousId,
  toDashboardCount,
} from "@/lib/dashboard/aggregation";
import {
  addCalendarDays,
  countInclusiveCalendarDays,
  getManilaCalendarDate,
  listCalendarDates,
  resolveDashboardDateRange,
} from "@/lib/dashboard/dateRange";

describe("dashboard date ranges", () => {
  const now = new Date("2026-07-22T16:30:00.000Z");

  it("uses the Asia/Manila calendar day instead of the server date", () => {
    expect(getManilaCalendarDate(now)).toBe("2026-07-23");
    expect(resolveDashboardDateRange({ range: "today" }, now)).toMatchObject({
      range: {
        endDate: "2026-07-23",
        endExclusiveUtc: "2026-07-23T16:00:00.000Z",
        startDate: "2026-07-23",
        startUtc: "2026-07-22T16:00:00.000Z",
      },
      success: true,
    });
  });

  it("builds the documented inclusive presets", () => {
    expect(resolveDashboardDateRange({ range: "7d" }, now)).toMatchObject({
      range: { endDate: "2026-07-23", startDate: "2026-07-17" },
      success: true,
    });
    expect(resolveDashboardDateRange({ range: "30d" }, now)).toMatchObject({
      range: { endDate: "2026-07-23", startDate: "2026-06-24" },
      success: true,
    });
    expect(resolveDashboardDateRange({ range: "month" }, now)).toMatchObject({
      range: { endDate: "2026-07-23", startDate: "2026-07-01" },
      success: true,
    });
  });

  it("accepts a bounded custom range and rejects unsafe variants", () => {
    expect(
      resolveDashboardDateRange(
        { end: "2026-07-10", range: "custom", start: "2026-07-01" },
        now,
      ),
    ).toMatchObject({
      range: { endDate: "2026-07-10", preset: "custom", startDate: "2026-07-01" },
      success: true,
    });

    for (const parameters of [
      { end: "2026-07-01", range: "custom", start: "2026-07-10" },
      { end: "2026-07-24", range: "custom", start: "2026-07-10" },
      { end: "2026-02-30", range: "custom", start: "2026-02-01" },
      { end: "2026-07-10", range: "custom" },
      { range: "unexpected" },
      { end: "2026-07-23", range: "custom", start: "2025-07-22" },
    ]) {
      expect(resolveDashboardDateRange(parameters, now).success).toBe(false);
    }
  });

  it("handles calendar arithmetic without local-machine timezone drift", () => {
    expect(addCalendarDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(countInclusiveCalendarDays("2026-07-01", "2026-07-23")).toBe(23);
    expect(listCalendarDates("2026-07-30", "2026-08-02")).toEqual([
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
      "2026-08-02",
    ]);
  });
});

describe("dashboard aggregate definitions", () => {
  it("returns zero CTR for a zero denominator and a bounded percentage otherwise", () => {
    expect(calculateClickThroughRate(4, 0)).toBe(0);
    expect(calculateClickThroughRate(2, 4)).toBe(50);
    expect(calculateClickThroughRate(10, 4)).toBe(100);
  });

  it("normalizes database counts and calculates CTR from intersected visitors", () => {
    expect(
      normalizeDashboardSummary({
        airbnb_clicks: "3",
        estimated_unique_visitors: 8,
        facebook_clicks: 2,
        google_maps_clicks: 1,
        has_demonstration_data: true,
        new_inquiries: 4,
        sessions: 10,
        total_external_link_clicks: 7,
        total_page_views: 21,
        unique_clicking_visitors: 2,
        whatsapp_clicks: null,
      }),
    ).toEqual({
      airbnbClicks: 3,
      clickThroughRate: 25,
      estimatedUniqueVisitors: 8,
      facebookClicks: 2,
      googleMapsClicks: 1,
      hasDemonstrationData: true,
      newInquiries: 4,
      sessions: 10,
      totalExternalLinkClicks: 7,
      totalPageViews: 21,
      uniqueClickingVisitors: 2,
      whatsappClicks: 0,
    });

    expect(toDashboardCount(-1)).toBe(0);
    expect(toDashboardCount("not-a-number")).toBe(0);
  });

  it("fills missing daily values so every selected calendar day is represented", () => {
    const result = resolveDashboardDateRange(
      { end: "2026-07-03", range: "custom", start: "2026-07-01" },
      new Date("2026-07-22T16:30:00.000Z"),
    );
    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(
      createDailyAnalyticsSeries(result.range, [
        {
          activity_date: "2026-07-02",
          estimated_unique_visitors: 2,
          total_page_views: 5,
        },
      ]),
    ).toEqual([
      { date: "2026-07-01", label: "Jul 1", pageViews: 0, uniqueVisitors: 0 },
      { date: "2026-07-02", label: "Jul 2", pageViews: 5, uniqueVisitors: 2 },
      { date: "2026-07-03", label: "Jul 3", pageViews: 0, uniqueVisitors: 0 },
    ]);
  });

  it("fills all supported device and link categories with zeroes", () => {
    expect(
      normalizeDeviceTotals([{ device_type: "mobile", total_page_views: 4 }]),
    ).toEqual([
      { deviceType: "mobile", label: "Mobile", total: 4 },
      { deviceType: "tablet", label: "Tablet", total: 0 },
      { deviceType: "desktop", label: "Desktop", total: 0 },
      { deviceType: "unknown", label: "Unknown", total: 0 },
    ]);

    const links = normalizeLinkTotals([{ link_type: "airbnb", total_clicks: 3 }]);
    expect(links).toHaveLength(8);
    expect(links[0]).toEqual({ label: "Airbnb", linkType: "airbnb", total: 3 });
    expect(links.find((item) => item.linkType === "whatsapp")?.total).toBe(0);
  });
});

describe("dashboard privacy-safe presentation", () => {
  it("shortens anonymous identifiers and reduces referrers to hostnames", () => {
    expect(shortenAnonymousId("12345678-1234-4000-8000-123456789012")).toBe(
      "12345678…",
    );
    expect(formatReferrer("https://example.com:8443")).toBe("example.com");
    expect(formatReferrer(null)).toBe("Direct / unavailable");
    expect(formatReferrer("not a URL")).toBe("Unavailable");
  });

  it("describes inquiry contact channels without exposing values", () => {
    expect(describeContactMethod("guest@example.invalid", null)).toBe("Email");
    expect(describeContactMethod(null, "redacted")).toBe("Phone or messaging");
    expect(describeContactMethod("guest@example.invalid", "redacted")).toBe(
      "Email and phone",
    );
    expect(formatInquiryDates(null, null)).toBe("Not provided");
  });

  it("keeps dashboard reads on the authenticated RLS client and bounds activity tables", () => {
    const querySource = readFileSync(
      join(process.cwd(), "src", "lib", "dashboard", "query.ts"),
      "utf8",
    );

    expect(querySource).toContain("createServerSupabaseClient");
    expect(querySource).not.toContain("createServiceRoleSupabaseClient");
    expect(querySource.match(/\.limit\(15\)/g)).toHaveLength(3);
    expect(querySource).not.toMatch(/\.select\([^)]*(?:destination_url|message|consent)/s);
  });
});
