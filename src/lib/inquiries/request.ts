const MAX_INQUIRY_BODY_BYTES = 8192;

export type BoundedInquiryJsonResult =
  | { data: unknown; status: "ok" }
  | { status: "invalid" | "too-large" | "unsupported-media" };

export async function readBoundedInquiryJson(
  request: Request,
): Promise<BoundedInquiryJsonResult> {
  const contentType =
    request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ??
    "";

  if (contentType !== "application/json") {
    return { status: "unsupported-media" };
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const parsedLength = Number(contentLength);
    if (
      !Number.isFinite(parsedLength) ||
      parsedLength < 0 ||
      parsedLength > MAX_INQUIRY_BODY_BYTES
    ) {
      return { status: "too-large" };
    }
  }

  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_INQUIRY_BODY_BYTES) {
      return { status: "too-large" };
    }

    return { data: JSON.parse(text) as unknown, status: "ok" };
  } catch {
    return { status: "invalid" };
  }
}

export function isSameOriginInquiryRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function inquiryJsonResponse(
  status: number,
  body?: Record<string, unknown>,
) {
  const headers = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
    "Content-Type": "application/json; charset=utf-8",
    Pragma: "no-cache",
    "X-Content-Type-Options": "nosniff",
  };

  return new Response(body ? JSON.stringify(body) : null, {
    headers,
    status,
  });
}

export const inquiryRequestConstants = {
  maximumBodyBytes: MAX_INQUIRY_BODY_BYTES,
} as const;

