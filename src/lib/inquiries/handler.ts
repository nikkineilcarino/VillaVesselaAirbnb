import {
  inquiryJsonResponse,
  isSameOriginInquiryRequest,
  readBoundedInquiryJson,
} from "@/lib/inquiries/request";
import { parseInquirySubmission } from "@/lib/validation/inquiry";
import type { ValidatedInquiry } from "@/types/inquiries";

export type InquiryHandlerDependencies = {
  allowRequest: () => boolean;
  allowSubmission: (clientId: string) => boolean;
  enabled: boolean;
  now?: Date;
  store: (inquiry: ValidatedInquiry) => Promise<boolean>;
};

export async function handleInquiryRequest(
  request: Request,
  dependencies: InquiryHandlerDependencies,
) {
  if (!dependencies.enabled) {
    return inquiryJsonResponse(404, { status: "disabled" });
  }

  if (!isSameOriginInquiryRequest(request)) {
    return inquiryJsonResponse(403, { status: "rejected" });
  }

  if (!dependencies.allowRequest()) {
    return inquiryJsonResponse(429, { status: "rate-limited" });
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

  if (!dependencies.allowSubmission(parsed.clientId)) {
    return inquiryJsonResponse(429, { status: "rate-limited" });
  }

  try {
    const stored = await dependencies.store(parsed.data);
    return inquiryJsonResponse(stored ? 201 : 503, {
      status: stored ? "received" : "unavailable",
    });
  } catch {
    return inquiryJsonResponse(503, { status: "unavailable" });
  }
}

