"use client";

import { createContext, type ReactNode, useContext } from "react";

const AnalyticsEnabledContext = createContext(false);

export function AnalyticsProvider({
  children,
  enabled,
}: Readonly<{ children: ReactNode; enabled: boolean }>) {
  return (
    <AnalyticsEnabledContext value={enabled}>
      {children}
    </AnalyticsEnabledContext>
  );
}

export function useAnalyticsEnabled() {
  return useContext(AnalyticsEnabledContext);
}
