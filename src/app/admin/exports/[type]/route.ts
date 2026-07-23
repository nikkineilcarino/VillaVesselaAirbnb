import { getAdminAccess } from "@/lib/auth/admin";
import { resolveDashboardDateRange } from "@/lib/dashboard/dateRange";
import { createProtectedCsvExport } from "@/lib/csv/export";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  csvExportTypes,
  type CsvExportType,
} from "@/types/csv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function adminExportError(status: number) {
  return new Response(null, {
    headers: {
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
    status,
  });
}

type ExportRouteContext = {
  params: Promise<{ type: string }>;
};

export async function GET(request: Request, context: ExportRouteContext) {
  const access = await getAdminAccess();
  if (access.status !== "authorized") {
    if (access.status === "unauthenticated") return adminExportError(401);
    if (access.status === "unauthorized") return adminExportError(403);
    return adminExportError(503);
  }

  const { type: rawType } = await context.params;
  if (!csvExportTypes.includes(rawType as CsvExportType)) {
    return adminExportError(404);
  }

  const requestUrl = new URL(request.url);
  const rangeResult = resolveDashboardDateRange({
    end: requestUrl.searchParams.get("end") ?? undefined,
    range: "custom",
    start: requestUrl.searchParams.get("start") ?? undefined,
  });

  if (!rangeResult.success) {
    return adminExportError(400);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return adminExportError(503);
  }

  const result = await createProtectedCsvExport(
    supabase,
    rawType as CsvExportType,
    rangeResult.range,
  );
  if (!result) {
    return adminExportError(503);
  }

  const filename = `villa-vessela-${rawType}-${rangeResult.range.startDate}-to-${rangeResult.range.endDate}.csv`;

  return new Response(result.csv, {
    headers: {
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Security-Policy": "default-src 'none'",
      "Content-Type": "text/csv; charset=utf-8",
      Pragma: "no-cache",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Export-Truncated": result.truncated ? "true" : "false",
    },
    status: 200,
  });
}

