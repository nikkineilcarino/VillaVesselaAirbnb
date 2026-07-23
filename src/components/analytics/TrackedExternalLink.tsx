"use client";

import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { dispatchLinkClick } from "@/lib/analytics/dispatch";
import { getAnonymousAnalyticsIdentity } from "@/lib/analytics/identifiers";
import { normalizePublicPath } from "@/lib/analytics/normalization";
import type { ExternalLinkType } from "@/types/analytics";

import { useAnalyticsEnabled } from "./AnalyticsProvider";

type TrackedExternalLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  href: string;
  linkType: ExternalLinkType;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function TrackedExternalLink({
  href,
  linkType,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  const pathname = usePathname();
  const analyticsEnabled = useAnalyticsEnabled();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!analyticsEnabled) {
      return;
    }

    const identity = getAnonymousAnalyticsIdentity();
    const sourcePage = normalizePublicPath(pathname);

    if (identity && sourcePage) {
      dispatchLinkClick({
        ...identity,
        destinationUrl: href,
        linkType,
        sourcePage,
      });
    }
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
