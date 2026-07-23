import { CircleHelp, ListChecks, WifiOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityBadge } from "@/components/public/AvailabilityBadge";
import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import {
  amenityGroups,
  connectivityNote,
  optionalServiceNotes,
} from "@/data/amenities";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Explore supplied Villa Vessela beach, outdoor, comfort, kitchen, parking, and connectivity information with clear confirmation notes.",
  path: "/amenities",
  title: "Amenities",
});

export default function AmenitiesPage() {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary transition-colors hover:bg-surface-muted"
            href="/guest-guide"
            prefetch={false}
          >
            Plan what to bring
          </Link>
        }
        currentPage="Amenities"
        currentPath="/amenities"
        description="A source-grounded guide to the villa's practical comforts, with visible confirmation states for anything that may change or still needs owner approval."
        eyebrow="Practical comforts"
        title="Amenities for a relaxed, self-catered stay"
      />

      <section aria-labelledby="amenities-list" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            align="center"
            description="“Supplied property information” reflects the project package. “Confirm before stay” marks an arrangement that should not be treated as guaranteed."
            eyebrow="What's available"
            id="amenities-list"
            title="Grouped clearly, with no hidden assumptions"
          />

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {amenityGroups.map((group) => (
              <section
                aria-labelledby={`amenity-${group.title.toLowerCase().replaceAll(" ", "-")}`}
                className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8"
                key={group.title}
              >
                <ListChecks aria-hidden="true" className="text-secondary" size={29} />
                <h2
                  className="mt-5 text-2xl font-semibold"
                  id={`amenity-${group.title.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {group.title}
                </h2>
                <ul className="mt-6 space-y-5">
                  {group.items.map((item) => (
                    <li className="border-t border-border pt-5 first:border-0 first:pt-0" key={item.name}>
                      <p className="font-semibold leading-6">{item.name}</p>
                      {"detail" in item && item.detail ? (
                        <p className="mt-2 text-sm leading-6 text-foreground/75">{item.detail}</p>
                      ) : null}
                      <div className="mt-3">
                        <AvailabilityBadge status={item.availability} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="connectivity-title" className="bg-primary-dark py-20 text-white sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center" size="wide">
          <div>
            <WifiOff aria-hidden="true" className="text-accent" size={36} />
            <p className="mt-6 text-sm font-bold tracking-[0.18em] text-white/90 uppercase">
              Connectivity
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" id="connectivity-title">
              Mobile network, not fixed Wi-Fi
            </h2>
          </div>
          <div className="rounded-card border border-white/15 bg-white/8 p-6 sm:p-8">
            <p className="text-lg leading-8 text-white/85">{connectivityNote}</p>
            <p className="mt-5 text-sm leading-6 text-white/75">
              Available Philippine networks may support browsing, email, video calls, and streaming, but no provider, signal strength, speed, or uninterrupted service is guaranteed.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-title" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="The supplied guide mentions these optional services, but their availability and fees depend on current arrangements."
            eyebrow="Optional help"
            id="services-title"
            title="Services that may be arranged"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {optionalServiceNotes.map((service) => (
              <article className="rounded-card border border-border bg-surface p-5 shadow-soft" key={service}>
                <CircleHelp aria-hidden="true" className="text-warning" size={24} />
                <h3 className="mt-4 font-semibold">{service}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/75">
                  Confirm availability and the current fee with the host.
                </p>
              </article>
            ))}
          </div>

          <DisclosureNote className="mt-8" title="No service or fee is guaranteed">
            <p>
              These services may depend on availability. No fixed service amount is published until the owner confirms the current terms.
            </p>
          </DisclosureNote>
        </Container>
      </section>
    </main>
  );
}
