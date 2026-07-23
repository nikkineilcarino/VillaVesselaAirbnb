import "server-only";

const reportedReasons = new Set<string>();

export function reportInquiryFailureOnce(
  reason: "insert-failed" | "storage-unavailable",
) {
  if (reportedReasons.has(reason)) {
    return;
  }

  reportedReasons.add(reason);
  console.warn(`[inquiry] submission was not stored (${reason}).`);
}

