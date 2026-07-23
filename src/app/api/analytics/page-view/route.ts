import {
  allowAnalyticsEvent,
  allowAnalyticsRequest,
} from "@/lib/analytics/rateLimit";
import {
  analyticsResponse,
  isSameOriginAnalyticsRequest,
  readBoundedAnalyticsJson,
} from "@/lib/analytics/request";
import {
  isAnalyticsEnabled,
  reportAnalyticsFailureOnce,
} from "@/lib/analytics/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import { parsePageViewPayload } from "@/lib/validation/analytics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAnalyticsEnabled()) {
    return analyticsResponse(204);
  }

  if (!isSameOriginAnalyticsRequest(request)) {
    return analyticsResponse(403);
  }

  if (!allowAnalyticsRequest("page-view")) {
    return analyticsResponse(429);
  }

  const body = await readBoundedAnalyticsJson(request);

  if (body.status === "too-large") return analyticsResponse(413);
  if (body.status === "unsupported-media") return analyticsResponse(415);
  if (body.status !== "ok") return analyticsResponse(400);

  const payload = parsePageViewPayload(body.data);

  if (!payload) {
    return analyticsResponse(400);
  }

  if (!allowAnalyticsEvent("page-view", payload.anonymousVisitorId)) {
    return analyticsResponse(429);
  }

  let supabase: ReturnType<typeof createServiceRoleSupabaseClient>;

  try {
    supabase = createServiceRoleSupabaseClient();
  } catch {
    reportAnalyticsFailureOnce("page-view", "storage-unavailable");
    return analyticsResponse(202);
  }

  if (!supabase) {
    reportAnalyticsFailureOnce("page-view", "storage-unavailable");
    return analyticsResponse(202);
  }

  try {
    const { error } = await supabase.from("page_views").insert({
      anonymous_visitor_id: payload.anonymousVisitorId,
      browser_type: payload.browserType,
      device_type: payload.deviceType,
      path: payload.path,
      referrer: payload.referrer,
      session_id: payload.sessionId,
    });

    if (error) {
      reportAnalyticsFailureOnce("page-view", "insert-failed");
      return analyticsResponse(202);
    }
  } catch {
    reportAnalyticsFailureOnce("page-view", "insert-failed");
    return analyticsResponse(202);
  }

  return analyticsResponse(201);
}
