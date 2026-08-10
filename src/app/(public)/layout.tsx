import type { ReactNode } from "react";

import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { isAnalyticsEnabled } from "@/lib/analytics/server";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  const analyticsEnabled = isAnalyticsEnabled();

  return (
    <AnalyticsProvider enabled={analyticsEnabled}>
      <PageViewTracker />
      <Header />
      {children}
      <Footer />
      <AnalyticsConsent />
    </AnalyticsProvider>
  );
}
