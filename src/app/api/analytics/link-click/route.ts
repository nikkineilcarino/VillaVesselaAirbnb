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
import { parseLinkClickPayload } from "@/lib/validation/analytics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAnalyticsEnabled()) {
    return analyticsResponse(204);
  }

  if (!isSameOriginAnalyticsRequest(request)) {
    return analyticsResponse(403);
  }

  if (!allowAnalyticsRequest("link-click")) {
    return analyticsResponse(429);
  }

  const body = await readBoundedAnalyticsJson(request);

  if (body.status === "too-large") return analyticsResponse(413);
  if (body.status === "unsupported-media") return analyticsResponse(415);
  if (body.status !== "ok") return analyticsResponse(400);

  const payload = parseLinkClickPayload(body.data);

  if (!payload) {
    return analyticsResponse(400);
  }

  if (!allowAnalyticsEvent("link-click", payload.anonymousVisitorId)) {
    return analyticsResponse(429);
  }

  let supabase: ReturnType<typeof createServiceRoleSupabaseClient>;

  try {
    supabase = createServiceRoleSupabaseClient();
  } catch {
    reportAnalyticsFailureOnce("link-click", "storage-unavailable");
    return analyticsResponse(202);
  }

  if (!supabase) {
    reportAnalyticsFailureOnce("link-click", "storage-unavailable");
    return analyticsResponse(202);
  }

  try {
    const { error } = await supabase.from("link_clicks").insert({
      anonymous_visitor_id: payload.anonymousVisitorId,
      destination_url: payload.destinationUrl,
      link_type: payload.linkType,
      session_id: payload.sessionId,
      source_page: payload.sourcePage,
    });

    if (error) {
      reportAnalyticsFailureOnce("link-click", "insert-failed");
      return analyticsResponse(202);
    }
  } catch {
    reportAnalyticsFailureOnce("link-click", "insert-failed");
    return analyticsResponse(202);
  }

  return analyticsResponse(201);
}
