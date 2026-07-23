"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { dispatchPageView } from "@/lib/analytics/dispatch";
import { getAnonymousAnalyticsIdentity } from "@/lib/analytics/identifiers";
import {
  classifyBrowser,
  classifyDevice,
  normalizePublicPath,
  normalizeReferrer,
} from "@/lib/analytics/normalization";

export function PageViewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const lastTrackedPath = useRef<null | string>(null);

  useEffect(() => {
    if (!enabled || lastTrackedPath.current === pathname) {
      return;
    }

    const path = normalizePublicPath(pathname);
    const identity = getAnonymousAnalyticsIdentity();

    if (!path || !identity) {
      return;
    }

    lastTrackedPath.current = pathname;
    dispatchPageView({
      ...identity,
      browserType: classifyBrowser(navigator.userAgent),
      deviceType: classifyDevice(navigator.userAgent),
      path,
      referrer: normalizeReferrer(document.referrer),
    });
  }, [enabled, pathname]);

  return null;
}
