import Link from "next/link";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { VillaLogo } from "@/components/branding/VillaLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction } from "@/data/navigation";

import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95">
      <Container className="flex min-h-20 items-center justify-between gap-5" size="wide">
        <Link
          aria-label="Villa Vessela home"
          className="shrink-0 rounded-sm"
          href="/"
          prefetch={false}
        >
          <VillaLogo className="w-[12.5rem] sm:w-[14rem]" priority />
        </Link>

        <div className="flex items-center gap-3">
          <DesktopNavigation />
          {primaryBookingAction.href ? (
            <TrackedExternalLink
              className="hidden min-h-11 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:inline-flex"
              href={primaryBookingAction.href}
              linkType="airbnb"
            >
              {primaryBookingAction.label}
            </TrackedExternalLink>
          ) : (
            <Button
              aria-label={`${primaryBookingAction.label}: ${primaryBookingAction.unavailableReason}`}
              className="hidden xl:inline-flex"
              disabled
              title={primaryBookingAction.unavailableReason}
            >
              {primaryBookingAction.label}
            </Button>
          )}
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
