import { ArrowDown, MapPin, ShieldCheck, Waves } from "lucide-react";
import Image from "next/image";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-dark text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(114,184,197,0.25),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(199,154,68,0.18),transparent_30%)]"
      />
      <Container
        className="grid min-h-[calc(100svh-5rem)] items-center gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20"
        size="wide"
      >
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-white uppercase">
            <Waves aria-hidden="true" size={17} strokeWidth={1.8} />
            {siteConfig.hero.eyebrow}
          </p>
          <h1 className="mt-7 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
            {siteConfig.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/78 sm:text-xl">
            {siteConfig.hero.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {primaryBookingAction.href ? (
              <TrackedExternalLink
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-primary transition-colors hover:bg-surface-muted"
                href={primaryBookingAction.href}
                linkType="airbnb"
              >
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
                {primaryBookingAction.label}
              </Button>
            )}
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              href="#location"
            >
              <MapPin aria-hidden="true" size={19} strokeWidth={1.8} />
              View location
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/60">
            {primaryBookingAction.href
              ? "Continue only through the approved Airbnb destination. No direct payment is collected on this website."
              : "Airbnb listing link awaiting confirmation. No direct payment is collected on this website."}
          </p>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="text-accent" size={19} />
              Gated private compound
            </span>
            <span className="inline-flex items-center gap-2">
              <ArrowDown aria-hidden="true" className="text-accent" size={19} />
              Beach under 100 metres
            </span>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-3xl lg:mx-0">
          <div className="absolute -inset-3 rounded-[2rem] border border-white/15" />
          <div className="relative aspect-[8/5] overflow-hidden rounded-[1.5rem] border border-white/20 bg-surface-muted shadow-2xl">
            <Image
              alt="Illustrated placeholder of a tropical beachfront villa; official Villa Vessela photograph pending"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              src="/images/placeholders/hero-beachfront.svg"
            />
          </div>
          <figcaption className="absolute right-4 bottom-4 left-4 rounded-xl bg-primary-dark/90 px-4 py-3 text-xs leading-5 text-white/80 sm:right-auto sm:max-w-sm">
            Illustrated placeholder — official Villa Vessela photography is still
            required.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
