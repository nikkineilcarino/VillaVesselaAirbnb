import "server-only";

import {
  createDailyAnalyticsSeries,
  describeContactMethod,
  formatInquiryDates,
  formatManilaTimestamp,
  formatReferrer,
  normalizeBrowser,
  normalizeDashboardSummary,
  normalizeDevice,
  normalizeDeviceTotals,
  normalizeLinkTotals,
  normalizeLinkType,
  shortenAnonymousId,
  toDashboardCount,
} from "@/lib/dashboard/aggregation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardData, DashboardDateRange } from "@/types/dashboard";

export type DashboardQueryResult =
  | { data: DashboardData; status: "ready" }
  | { status: "unavailable" };

export async function getDashboardData(
  range: DashboardDateRange,
  options: { includeInquiries?: boolean } = {},
): Promise<DashboardQueryResult> {
  const supabase = await createServerSupabaseClient();
  const includeInquiries = options.includeInquiries ?? true;

  if (!supabase) {
    return { status: "unavailable" };
  }

  const parameters = {
    p_end_exclusive: range.endExclusiveUtc,
    p_start: range.startUtc,
  };

  try {
    const recentInquiryQuery = includeInquiries
      ? supabase
          .from("contact_inquiries")
          .select(
            "created_at, email, name, number_of_guests, phone, preferred_check_in, preferred_check_out, status",
          )
          .gte("created_at", range.startUtc)
          .lt("created_at", range.endExclusiveUtc)
          .order("created_at", { ascending: false })
          .limit(15)
      : Promise.resolve({ data: [], error: null });

    const [
      summaryResult,
      dailyResult,
      deviceResult,
      linkResult,
      pageResult,
      recentPageResult,
      recentLinkResult,
      recentInquiryResult,
    ] = await Promise.all([
      supabase.rpc("analytics_dashboard_summary", parameters),
      supabase.rpc("analytics_dashboard_daily", parameters),
      supabase.rpc("analytics_dashboard_device_totals", parameters),
      supabase.rpc("analytics_dashboard_link_totals", parameters),
      supabase.rpc("analytics_dashboard_top_pages", parameters),
      supabase
        .from("page_views")
        .select(
          "anonymous_visitor_id, browser_type, created_at, device_type, path, referrer",
        )
        .gte("created_at", range.startUtc)
        .lt("created_at", range.endExclusiveUtc)
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("link_clicks")
        .select("anonymous_visitor_id, created_at, link_type, source_page")
        .gte("created_at", range.startUtc)
        .lt("created_at", range.endExclusiveUtc)
        .order("created_at", { ascending: false })
        .limit(15),
      recentInquiryQuery,
    ]);

    const results = [
      summaryResult,
      dailyResult,
      deviceResult,
      linkResult,
      pageResult,
      recentPageResult,
      recentLinkResult,
      recentInquiryResult,
    ];

    if (results.some((result) => result.error)) {
      return { status: "unavailable" };
    }

    const summary = {
      ...normalizeDashboardSummary(summaryResult.data?.[0] ?? null),
      ...(!includeInquiries
        ? { hasDemonstrationData: false, newInquiries: 0 }
        : {}),
    };
    const data: DashboardData = {
      daily: createDailyAnalyticsSeries(range, dailyResult.data ?? []),
      devices: normalizeDeviceTotals(deviceResult.data ?? []),
      links: normalizeLinkTotals(linkResult.data ?? []),
      pages: (pageResult.data ?? []).map((row) => ({
        path: row.path,
        total: toDashboardCount(row.total_page_views),
      })),
      recentInquiries: includeInquiries
        ? (recentInquiryResult.data ?? []).map((row) => ({
            contactMethod: describeContactMethod(row.email, row.phone),
            guestCount: row.number_of_guests,
            name: row.name.slice(0, 100),
            occurredAt: formatManilaTimestamp(row.created_at),
            preferredDates: formatInquiryDates(
              row.preferred_check_in,
              row.preferred_check_out,
            ),
            status: row.status,
          }))
        : [],
      recentLinks: (recentLinkResult.data ?? []).map((row) => ({
        linkType: normalizeLinkType(row.link_type),
        occurredAt: formatManilaTimestamp(row.created_at),
        sourcePage: row.source_page ?? "Unavailable",
        visitorLabel: shortenAnonymousId(row.anonymous_visitor_id),
      })),
      recentPages: (recentPageResult.data ?? []).map((row) => ({
        browser: normalizeBrowser(row.browser_type),
        device: normalizeDevice(row.device_type),
        occurredAt: formatManilaTimestamp(row.created_at),
        path: row.path,
        referrer: formatReferrer(row.referrer),
        visitorLabel: shortenAnonymousId(row.anonymous_visitor_id),
      })),
      summary,
    };

    return { data, status: "ready" };
  } catch {
    return { status: "unavailable" };
  }
}
