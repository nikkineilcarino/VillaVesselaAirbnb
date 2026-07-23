import {
  analyticsBrowserTypes,
  analyticsDeviceTypes,
  externalLinkTypes,
  type AnalyticsBrowserType,
  type AnalyticsDeviceType,
  type ExternalLinkType,
} from "@/types/analytics";
import type {
  DashboardDateRange,
  DashboardDeviceTotal,
  DashboardLinkTotal,
  DashboardSummary,
  DailyAnalyticsPoint,
} from "@/types/dashboard";
import { listCalendarDates } from "@/lib/dashboard/dateRange";

type CountValue = number | string | null | undefined;

type DashboardSummaryRow = {
  airbnb_clicks?: CountValue;
  estimated_unique_visitors?: CountValue;
  facebook_clicks?: CountValue;
  google_maps_clicks?: CountValue;
  has_demonstration_data?: boolean | null;
  new_inquiries?: CountValue;
  sessions?: CountValue;
  total_external_link_clicks?: CountValue;
  total_page_views?: CountValue;
  unique_clicking_visitors?: CountValue;
  whatsapp_clicks?: CountValue;
} | null;

type DailyOverviewRow = {
  activity_date: string | null;
  estimated_unique_visitors: CountValue;
  total_page_views: CountValue;
};

type DeviceTotalRow = {
  device_type: string | null;
  total_page_views: CountValue;
};

type LinkTotalRow = {
  link_type: string | null;
  total_clicks: CountValue;
};

const deviceLabels: Record<AnalyticsDeviceType, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
  unknown: "Unknown",
};

const linkLabels: Record<ExternalLinkType, string> = {
  airbnb: "Airbnb",
  email: "Email",
  facebook: "Facebook",
  google_maps: "Google Maps",
  messenger: "Messenger",
  other: "Other",
  phone: "Phone",
  whatsapp: "WhatsApp",
};

export function toDashboardCount(value: CountValue) {
  const number = typeof value === "string" ? Number(value) : value;

  if (typeof number !== "number" || !Number.isFinite(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

export function calculateClickThroughRate(
  uniqueClickingVisitors: number,
  estimatedUniqueVisitors: number,
) {
  if (estimatedUniqueVisitors <= 0) {
    return 0;
  }

  const percentage = (Math.max(0, uniqueClickingVisitors) / estimatedUniqueVisitors) * 100;
  return Math.min(100, Math.round(percentage * 10) / 10);
}

export function normalizeDashboardSummary(row: DashboardSummaryRow): DashboardSummary {
  const estimatedUniqueVisitors = toDashboardCount(row?.estimated_unique_visitors);
  const uniqueClickingVisitors = toDashboardCount(row?.unique_clicking_visitors);

  return {
    airbnbClicks: toDashboardCount(row?.airbnb_clicks),
    clickThroughRate: calculateClickThroughRate(
      uniqueClickingVisitors,
      estimatedUniqueVisitors,
    ),
    estimatedUniqueVisitors,
    facebookClicks: toDashboardCount(row?.facebook_clicks),
    googleMapsClicks: toDashboardCount(row?.google_maps_clicks),
    hasDemonstrationData: row?.has_demonstration_data === true,
    newInquiries: toDashboardCount(row?.new_inquiries),
    sessions: toDashboardCount(row?.sessions),
    totalExternalLinkClicks: toDashboardCount(row?.total_external_link_clicks),
    totalPageViews: toDashboardCount(row?.total_page_views),
    uniqueClickingVisitors,
    whatsappClicks: toDashboardCount(row?.whatsapp_clicks),
  };
}

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function createDailyAnalyticsSeries(
  range: DashboardDateRange,
  rows: DailyOverviewRow[],
): DailyAnalyticsPoint[] {
  const byDate = new Map(
    rows
      .filter((row) => row.activity_date)
      .map((row) => [
        row.activity_date as string,
        {
          pageViews: toDashboardCount(row.total_page_views),
          uniqueVisitors: toDashboardCount(row.estimated_unique_visitors),
        },
      ]),
  );

  return listCalendarDates(range.startDate, range.endDate).map((date) => ({
    date,
    label: formatChartDate(date),
    pageViews: byDate.get(date)?.pageViews ?? 0,
    uniqueVisitors: byDate.get(date)?.uniqueVisitors ?? 0,
  }));
}

export function normalizeDeviceTotals(rows: DeviceTotalRow[]): DashboardDeviceTotal[] {
  const totals = new Map(
    rows
      .filter((row) => analyticsDeviceTypes.includes(row.device_type as AnalyticsDeviceType))
      .map((row) => [row.device_type as AnalyticsDeviceType, toDashboardCount(row.total_page_views)]),
  );

  return analyticsDeviceTypes.map((deviceType) => ({
    deviceType,
    label: deviceLabels[deviceType],
    total: totals.get(deviceType) ?? 0,
  }));
}

export function normalizeLinkTotals(rows: LinkTotalRow[]): DashboardLinkTotal[] {
  const totals = new Map(
    rows
      .filter((row) => externalLinkTypes.includes(row.link_type as ExternalLinkType))
      .map((row) => [row.link_type as ExternalLinkType, toDashboardCount(row.total_clicks)]),
  );

  return externalLinkTypes.map((linkType) => ({
    label: linkLabels[linkType],
    linkType,
    total: totals.get(linkType) ?? 0,
  }));
}

export function normalizeBrowser(value: string | null): AnalyticsBrowserType {
  return analyticsBrowserTypes.includes(value as AnalyticsBrowserType)
    ? (value as AnalyticsBrowserType)
    : "unknown";
}

export function normalizeDevice(value: string | null): AnalyticsDeviceType {
  return analyticsDeviceTypes.includes(value as AnalyticsDeviceType)
    ? (value as AnalyticsDeviceType)
    : "unknown";
}

export function normalizeLinkType(value: string): ExternalLinkType {
  return externalLinkTypes.includes(value as ExternalLinkType)
    ? (value as ExternalLinkType)
    : "other";
}

export function shortenAnonymousId(value: string) {
  const clean = value.trim();
  return clean.length <= 8 ? clean : `${clean.slice(0, 8)}…`;
}

export function formatReferrer(value: string | null) {
  if (!value) {
    return "Direct / unavailable";
  }

  try {
    return new URL(value).hostname || "Unavailable";
  } catch {
    return "Unavailable";
  }
}

export function formatManilaTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(date);
}

export function formatInquiryDates(start: string | null, end: string | null) {
  if (!start || !end) {
    return "Not provided";
  }

  const formatter = new Intl.DateTimeFormat("en-PH", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });

  return `${formatter.format(new Date(`${start}T00:00:00Z`))} – ${formatter.format(
    new Date(`${end}T00:00:00Z`),
  )}`;
}

export function describeContactMethod(email: string | null, phone: string | null) {
  if (email && phone) {
    return "Email and phone";
  }

  if (email) {
    return "Email";
  }

  if (phone) {
    return "Phone or messaging";
  }

  return "Unavailable";
}

