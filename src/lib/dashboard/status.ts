import "server-only";

import { isAnalyticsEnabled } from "@/lib/analytics/server";
import { getSupabaseProjectUrl } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardOperationalStatus } from "@/types/dashboard";

function isAnalyticsStorageConfigured() {
  return Boolean(
    getSupabaseProjectUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function createStatus(
  status: Omit<DashboardOperationalStatus, "refreshedAt">,
): DashboardOperationalStatus {
  return {
    ...status,
    refreshedAt: new Date().toISOString(),
  };
}

/**
 * Reads only the newest analytics timestamps through the signed-in admin's
 * request-scoped client. The service-role credential is checked for presence
 * so server write configuration can be reported, but it is never returned or
 * used here. Live event delivery is verified separately during production QA.
 */
export async function getDashboardOperationalStatus(): Promise<DashboardOperationalStatus> {
  const collectionEnabled = isAnalyticsEnabled();
  const storageConfigured = isAnalyticsStorageConfigured();
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return createStatus({
      collectionEnabled,
      lastLinkClickAt: null,
      lastPageViewAt: null,
      reportingAvailable: false,
      storageConfigured,
    });
  }

  try {
    const [pageResult, linkResult] = await Promise.all([
      supabase
        .from("page_views")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("link_clicks")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1),
    ]);
    const reportingAvailable = !pageResult.error && !linkResult.error;

    return createStatus({
      collectionEnabled,
      lastLinkClickAt: linkResult.error ? null : (linkResult.data?.[0]?.created_at ?? null),
      lastPageViewAt: pageResult.error ? null : (pageResult.data?.[0]?.created_at ?? null),
      reportingAvailable,
      storageConfigured,
    });
  } catch {
    return createStatus({
      collectionEnabled,
      lastLinkClickAt: null,
      lastPageViewAt: null,
      reportingAvailable: false,
      storageConfigured,
    });
  }
}
