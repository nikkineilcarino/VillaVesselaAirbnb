import { MapPin, ShieldCheck } from "lucide-react";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction } from "@/data/navigation";

export function BookingCTA() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-center text-white shadow-soft sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_90%_80%,rgba(199,154,68,0.28),transparent_26%)]"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-bold tracking-[0.18em] text-accent uppercase">
              Plan your stay
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Ready for a quieter kind of beach escape?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Review the verified details, then continue only through an approved,
              fully configured booking channel.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {primaryBookingAction.href ? (
                <TrackedExternalLink
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-primary transition-colors hover:bg-surface-muted"
                  href={primaryBookingAction.href}
                  linkType="airbnb"
                >
                  <ShieldCheck aria-hidden="true" className="mr-2" size={19} />
                  {primaryBookingAction.label}
                </TrackedExternalLink>
              ) : (
                <Button
                  aria-label={`${primaryBookingAction.label}: ${primaryBookingAction.unavailableReason}`}
                  className="border border-white/20 disabled:bg-white/15 disabled:text-white/70"
                  disabled
                  size="large"
                  title={primaryBookingAction.unavailableReason}
                >
                  <ShieldCheck aria-hidden="true" className="mr-2" size={19} />
                  {primaryBookingAction.label}
                </Button>
              )}
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                href="#location"
              >
                <MapPin aria-hidden="true" size={19} />
                Review location
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/60">
              For payment security, guests booking through Airbnb should communicate
              and complete payment through Airbnb.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
