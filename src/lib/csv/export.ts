import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createCsv, type CsvCell } from "@/lib/csv/csv";
import { shortenAnonymousId } from "@/lib/dashboard/aggregation";
import type { Database } from "@/types/database";
import type { CsvExportType } from "@/types/csv";
import type { DashboardDateRange } from "@/types/dashboard";

const EXPORT_PAGE_SIZE = 1_000;
const MAXIMUM_EXPORT_ROWS = 10_000;

type CsvExportResult = {
  csv: string;
  rowCount: number;
  truncated: boolean;
};

function formatManilaCsvTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Manila",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second} Asia/Manila`;
}

async function exportPageViews(
  supabase: SupabaseClient<Database>,
  range: DashboardDateRange,
): Promise<CsvExportResult | null> {
  const rows: CsvCell[][] = [];
  let lastBatchSize = 0;

  for (let offset = 0; offset < MAXIMUM_EXPORT_ROWS; offset += EXPORT_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("page_views")
      .select("anonymous_visitor_id, browser_type, created_at, device_type, path, referrer")
      .gte("created_at", range.startUtc)
      .lt("created_at", range.endExclusiveUtc)
      .order("created_at", { ascending: true })
      .range(offset, offset + EXPORT_PAGE_SIZE - 1);

    if (error) return null;
    lastBatchSize = data.length;
    rows.push(
      ...data.map((row) => [
        formatManilaCsvTimestamp(row.created_at),
        shortenAnonymousId(row.anonymous_visitor_id),
        row.path,
        row.device_type ?? "unknown",
        row.browser_type ?? "unknown",
        row.referrer ?? "",
      ]),
    );
    if (data.length < EXPORT_PAGE_SIZE) break;
  }

  return {
    csv: createCsv(
      ["Date and time", "Anonymous visitor", "Page", "Device", "Browser", "Referrer"],
      rows,
    ),
    rowCount: rows.length,
    truncated:
      rows.length === MAXIMUM_EXPORT_ROWS && lastBatchSize === EXPORT_PAGE_SIZE,
  };
}

async function exportLinkClicks(
  supabase: SupabaseClient<Database>,
  range: DashboardDateRange,
): Promise<CsvExportResult | null> {
  const rows: CsvCell[][] = [];
  let lastBatchSize = 0;

  for (let offset = 0; offset < MAXIMUM_EXPORT_ROWS; offset += EXPORT_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("link_clicks")
      .select("anonymous_visitor_id, created_at, link_type, source_page")
      .gte("created_at", range.startUtc)
      .lt("created_at", range.endExclusiveUtc)
      .order("created_at", { ascending: true })
      .range(offset, offset + EXPORT_PAGE_SIZE - 1);

    if (error) return null;
    lastBatchSize = data.length;
    rows.push(
      ...data.map((row) => [
        formatManilaCsvTimestamp(row.created_at),
        shortenAnonymousId(row.anonymous_visitor_id),
        row.link_type,
        row.source_page ?? "",
      ]),
    );
    if (data.length < EXPORT_PAGE_SIZE) break;
  }

  return {
    csv: createCsv(
      ["Date and time", "Anonymous visitor", "Link type", "Source page"],
      rows,
    ),
    rowCount: rows.length,
    truncated:
      rows.length === MAXIMUM_EXPORT_ROWS && lastBatchSize === EXPORT_PAGE_SIZE,
  };
}

async function exportInquiries(
  supabase: SupabaseClient<Database>,
  range: DashboardDateRange,
): Promise<CsvExportResult | null> {
  const rows: CsvCell[][] = [];
  let lastBatchSize = 0;

  for (let offset = 0; offset < MAXIMUM_EXPORT_ROWS; offset += EXPORT_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select(
        "consent, created_at, email, message, name, number_of_guests, phone, preferred_check_in, preferred_check_out, status",
      )
      .gte("created_at", range.startUtc)
      .lt("created_at", range.endExclusiveUtc)
      .order("created_at", { ascending: true })
      .range(offset, offset + EXPORT_PAGE_SIZE - 1);

    if (error) return null;
    lastBatchSize = data.length;
    rows.push(
      ...data.map((row) => [
        formatManilaCsvTimestamp(row.created_at),
        row.name,
        row.email ?? "",
        row.phone ?? "",
        row.preferred_check_in ?? "",
        row.preferred_check_out ?? "",
        row.number_of_guests ?? "",
        row.status,
        row.message,
        row.consent ? "Yes" : "No",
      ]),
    );
    if (data.length < EXPORT_PAGE_SIZE) break;
  }

  return {
    csv: createCsv(
      [
        "Date and time",
        "Guest name",
        "Email",
        "Phone or messaging",
        "Preferred check-in",
        "Preferred checkout",
        "Guests",
        "Status",
        "Message",
        "Consent recorded",
      ],
      rows,
    ),
    rowCount: rows.length,
    truncated:
      rows.length === MAXIMUM_EXPORT_ROWS && lastBatchSize === EXPORT_PAGE_SIZE,
  };
}

export async function createProtectedCsvExport(
  supabase: SupabaseClient<Database>,
  type: CsvExportType,
  range: DashboardDateRange,
) {
  if (type === "page-views") {
    return exportPageViews(supabase, range);
  }

  if (type === "link-clicks") {
    return exportLinkClicks(supabase, range);
  }

  return exportInquiries(supabase, range);
}

export const csvExportConstants = {
  maximumRows: MAXIMUM_EXPORT_ROWS,
  pageSize: EXPORT_PAGE_SIZE,
} as const;

