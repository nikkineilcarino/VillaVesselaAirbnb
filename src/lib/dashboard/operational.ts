import type { AnalyticsOperationalState } from "@/types/dashboard";

type OperationalStateInput = {
  collectionEnabled: boolean;
  hasActivity: boolean;
  reportingAvailable: boolean;
  storageConfigured: boolean;
};

export function resolveAnalyticsOperationalState({
  collectionEnabled,
  hasActivity,
  reportingAvailable,
  storageConfigured,
}: OperationalStateInput): AnalyticsOperationalState {
  if (!collectionEnabled) {
    return "disabled";
  }

  if (!storageConfigured || !reportingAvailable) {
    return "storage-unavailable";
  }

  return hasActivity ? "activity" : "healthy-no-data";
}
