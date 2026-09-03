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
    const normalizedLength = contentLength.trim();
    const parsedLength = Number(normalizedLength);
    if (
      !/^\d+$/.test(normalizedLength) ||
      !Number.isFinite(parsedLength) ||
      parsedLength < 0 ||
      parsedLength > MAX_INQUIRY_BODY_BYTES
    ) {
      try {
        await request.body?.cancel();
      } catch {
        // A rejected request body does not need to remain readable.
      }
      return { status: "too-large" };
    }
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { status: "invalid" };
  }

  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      byteLength += value.byteLength;
      if (byteLength > MAX_INQUIRY_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // The size decision remains authoritative if stream cancellation fails.
        }
        return { status: "too-large" };
      }

      chunks.push(value);
    }

    const bytes = new Uint8Array(byteLength);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { data: JSON.parse(text) as unknown, status: "ok" };
  } catch {
    try {
      await reader.cancel();
    } catch {
      // The fixed invalid response is sufficient when the stream already failed.
    }
    return { status: "invalid" };
  } finally {
    reader.releaseLock();
  }
}

export function isSameOriginInquiryRequest(
  request: Request,
  expectedOrigin: string,
) {
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    const allowedOrigin = new URL(expectedOrigin).origin;

    if (expectedOrigin !== allowedOrigin) {
      return false;
    }

    return origin === parsedOrigin.origin && parsedOrigin.origin === allowedOrigin;
  } catch {
    return false;
  }
}

export function inquiryJsonResponse(
  status: number,
  body?: Record<string, unknown>,
  additionalHeaders?: HeadersInit,
) {
  const headers = new Headers({
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
    "Content-Type": "application/json; charset=utf-8",
    Expires: "0",
    Pragma: "no-cache",
    Vary: "Origin",
    "X-Content-Type-Options": "nosniff",
  });

  const additions = new Headers(additionalHeaders);
  additions.forEach((value, key) => headers.set(key, value));

  return new Response(body ? JSON.stringify(body) : null, {
    headers,
    status,
  });
}

export const inquiryRequestConstants = {
  maximumBodyBytes: MAX_INQUIRY_BODY_BYTES,
} as const;
