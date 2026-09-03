import {
  inquiryJsonResponse,
  isSameOriginInquiryRequest,
  readBoundedInquiryJson,
} from "@/lib/inquiries/request";
import { parseInquirySubmission } from "@/lib/validation/inquiry";
import type { FixedWindowRateLimitResult } from "@/lib/rateLimit";
import type { ValidatedInquiry } from "@/types/inquiries";

export type InquiryStoreResult =
  | "conflict"
  | "created"
  | "duplicate"
  | "unavailable";

export type InquiryHandlerDependencies = {
  allowRequest: () => FixedWindowRateLimitResult;
  allowSubmission: (clientId: string) => FixedWindowRateLimitResult;
  enabled: boolean;
  expectedOrigin: string;
  now?: Date;
  store: (inquiry: ValidatedInquiry) => Promise<InquiryStoreResult>;
};

function rateLimitedResponse(result: FixedWindowRateLimitResult) {
  return inquiryJsonResponse(
    429,
    { status: "rate-limited" },
    { "Retry-After": String(result.retryAfterSeconds) },
  );
}

export async function handleInquiryRequest(
  request: Request,
  dependencies: InquiryHandlerDependencies,
) {
  if (!dependencies.enabled) {
    return inquiryJsonResponse(404, { status: "disabled" });
  }

  if (!isSameOriginInquiryRequest(request, dependencies.expectedOrigin)) {
    return inquiryJsonResponse(403, { status: "rejected" });
  }

  const requestLimit = dependencies.allowRequest();
  if (!requestLimit.allowed) {
    return rateLimitedResponse(requestLimit);
  }

  const body = await readBoundedInquiryJson(request);

  if (body.status === "too-large") {
    return inquiryJsonResponse(413, { status: "invalid" });
  }

  if (body.status === "unsupported-media") {
    return inquiryJsonResponse(415, { status: "invalid" });
  }

  if (body.status !== "ok") {
    return inquiryJsonResponse(400, { status: "invalid" });
  }

  const parsed = parseInquirySubmission(body.data, dependencies.now);

  if (parsed.status === "spam") {
    return inquiryJsonResponse(202, { status: "received" });
  }

  if (parsed.status === "invalid") {
    return inquiryJsonResponse(400, {
      errors: parsed.errors,
      status: "invalid",
    });
  }

  const submissionLimit = dependencies.allowSubmission(parsed.clientId);
  if (!submissionLimit.allowed) {
    return rateLimitedResponse(submissionLimit);
  }

  try {
    const result = await dependencies.store(parsed.data);

    if (result === "created") {
      return inquiryJsonResponse(201, { status: "received" });
    }

    if (result === "duplicate") {
      return inquiryJsonResponse(200, { status: "received" });
    }

    if (result === "conflict") {
      return inquiryJsonResponse(409, { status: "conflict" });
    }

    return inquiryJsonResponse(503, { status: "unavailable" });
  } catch {
    return inquiryJsonResponse(503, { status: "unavailable" });
  }
}
