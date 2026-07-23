import {
  trackablePublicPaths,
  type AnalyticsBrowserType,
  type AnalyticsDeviceType,
  type TrackablePublicPath,
} from "@/types/analytics";

const publicPathSet = new Set<string>(trackablePublicPaths);

export function normalizePublicPath(value: string): TrackablePublicPath | null {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("?") ||
    value.includes("#") ||
    value.includes("\\")
  ) {
    return null;
  }

  const normalized = value.length > 1 ? value.replace(/\/+$/, "") : value;

  return publicPathSet.has(normalized) ? (normalized as TrackablePublicPath) : null;
}

/** Stores only an HTTP(S) origin, never a referrer path, query, hash, or credentials. */
export function normalizeReferrer(value: null | string | undefined) {
  const candidate = value?.trim();

  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);

    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password) {
      return null;
    }

    return url.origin.length <= 255 ? url.origin : null;
  } catch {
    return null;
  }
}

export function classifyBrowser(userAgent: string): AnalyticsBrowserType {
  const value = userAgent.toLowerCase();

  if (!value) return "unknown";
  if (value.includes("edg/")) return "edge";
  if (value.includes("firefox/") || value.includes("fxios/")) return "firefox";
  if (value.includes("chrome/") || value.includes("crios/")) return "chrome";
  if (value.includes("safari/") && !value.includes("chrome/") && !value.includes("crios/")) {
    return "safari";
  }

  return "other";
}

export function classifyDevice(userAgent: string): AnalyticsDeviceType {
  const value = userAgent.toLowerCase();

  if (!value) return "unknown";
  if (/ipad|tablet|kindle|silk/.test(value)) return "tablet";
  if (/mobile|iphone|ipod|android/.test(value)) return "mobile";

  return "desktop";
}
