import type { ReactNode } from "react";

import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  const analyticsEnabled = process.env.ANALYTICS_ENABLED === "true";

  return (
    <AnalyticsProvider enabled={analyticsEnabled}>
      <PageViewTracker enabled={analyticsEnabled} />
      <Header />
      {children}
      <Footer />
    </AnalyticsProvider>
  );
}
