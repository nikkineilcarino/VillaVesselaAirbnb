import type { LinkClickPayload, PageViewPayload } from "@/types/analytics";

const jsonHeaders = { "Content-Type": "application/json" } as const;

export function dispatchPageView(payload: PageViewPayload) {
  try {
    void fetch("/api/analytics/page-view", {
      body: JSON.stringify(payload),
      credentials: "same-origin",
      headers: jsonHeaders,
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  } catch {
    // Analytics is best effort and must never disrupt public rendering.
  }
}

export function dispatchLinkClick(payload: LinkClickPayload) {
  const body = JSON.stringify(payload);

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(
        "/api/analytics/link-click",
        new Blob([body], { type: "application/json" }),
      )
    ) {
      return;
    }
  } catch {
    // A fetch keepalive request is attempted below.
  }

  try {
    void fetch("/api/analytics/link-click", {
      body,
      credentials: "same-origin",
      headers: jsonHeaders,
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  } catch {
    // Navigation continues even when both delivery mechanisms are unavailable.
  }
}
