import "server-only";

const reportedFailures = new Set<string>();

export function isAnalyticsEnabled() {
  return process.env.ANALYTICS_ENABLED?.trim().toLowerCase() === "true";
}

export function reportAnalyticsFailureOnce(
  kind: "link-click" | "page-view",
  reason: "insert-failed" | "storage-unavailable",
) {
  const key = `${kind}:${reason}`;

  if (reportedFailures.has(key)) {
    return;
  }

  reportedFailures.add(key);
  console.warn(`[analytics] ${kind} event was dropped (${reason}).`);
}
