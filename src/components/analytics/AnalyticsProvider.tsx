"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { clearAnonymousAnalyticsIdentity } from "@/lib/analytics/identifiers";
import {
  type AnalyticsPreference,
  readAnalyticsPreference,
  subscribeAnalyticsPreference,
  writeAnalyticsPreference,
} from "@/lib/analytics/preference";

type AnalyticsConsentState = {
  canTrack: boolean;
  featureEnabled: boolean;
  preference: AnalyticsPreference | "undecided";
  setPreference: (preference: AnalyticsPreference) => boolean;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentState>({
  canTrack: false,
  featureEnabled: false,
  preference: "undecided",
  setPreference: () => false,
});

export function AnalyticsProvider({
  children,
  enabled,
}: Readonly<{ children: ReactNode; enabled: boolean }>) {
  const preference = useSyncExternalStore<AnalyticsPreference | "undecided">(
    subscribeAnalyticsPreference,
    () => readAnalyticsPreference() ?? "undecided",
    () => "undecided",
  );

  useEffect(() => {
    if (!enabled || readAnalyticsPreference() !== "allowed") {
      clearAnonymousAnalyticsIdentity();
    }
  }, [enabled, preference]);

  const setPreference = useCallback(
    (nextPreference: AnalyticsPreference) => {
      if (!enabled) {
        return false;
      }

      if (nextPreference === "declined") {
        clearAnonymousAnalyticsIdentity();
      }

      const persisted = writeAnalyticsPreference(nextPreference);

      if (!persisted) {
        clearAnonymousAnalyticsIdentity();
        return false;
      }

      return true;
    },
    [enabled],
  );

  const value = useMemo<AnalyticsConsentState>(
    () => ({
      canTrack: enabled && preference === "allowed",
      featureEnabled: enabled,
      preference,
      setPreference,
    }),
    [enabled, preference, setPreference],
  );

  return (
    <AnalyticsConsentContext value={value}>{children}</AnalyticsConsentContext>
  );
}

export function useAnalyticsEnabled() {
  return useContext(AnalyticsConsentContext).canTrack;
}

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}
