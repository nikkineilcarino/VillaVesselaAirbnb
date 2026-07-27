import { Bath, BedDouble, Check, Home, ShieldCheck, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import {
  accommodationGroups,
  accommodationInclusionNotes,
  bathroomNote,
  expandedCapacityNote,
  propertyStats,
} from "@/data/accommodation";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Review Villa Vessela's supplied room, capacity, shared-space, bathroom, parking, and booking-inclusion information.",
  path: "/accommodation",
  title: "Accommodation",
});

const statIcons = [UsersRound, BedDouble, Home, Bath] as const;

export default function AccommodationPage() {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary transition-colors hover:bg-surface-muted"
              href="/amenities"
              prefetch={false}
            >
              Explore amenities
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              href="/guest-guide"
              prefetch={false}
            >
              Read the guest guide
            </Link>
          </>
        }
        currentPage="Accommodation"
        currentPath="/accommodation"
        description="A practical, self-catering villa for families and groups, with confirmed standard capacity and clear notes wherever an arrangement still needs approval."
        eyebrow="Inside Villa Vessela"
        title="Room to gather, rest, and enjoy the coast"
      />

      <section aria-labelledby="accommodation-overview" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            align="center"
            description="The figures below follow the supplied property information. Conditional capacity and reported facilities remain visibly separate from the standard arrangement."
            eyebrow="Property overview"
            id="accommodation-overview"
            title="The confirmed essentials at a glance"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {propertyStats.map((stat, index) => {
              const Icon = statIcons[index];

              return (
                <article className="rounded-card border border-border bg-surface p-6 shadow-soft" key={stat.value}>
                  {Icon ? <Icon aria-hidden="true" className="text-secondary" size={28} /> : null}
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">{stat.value}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/75">{stat.detail}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <DisclosureNote title="Expanded capacity is conditional">
              <p>{expandedCapacityNote}</p>
            </DisclosureNote>
            <DisclosureNote title="Bathroom arrangement">
              <p>{bathroomNote}</p>
            </DisclosureNote>
          </div>
        </Container>
      </section>

      <section aria-labelledby="spaces-title" className="bg-surface-muted py-20 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]" size="wide">
          <figure className="lg:sticky lg:top-28">
            <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
              <Image
                alt="Front view of Villa Vessela with flowers and a paved walkway"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                src="/images/villa-vessela/property/villa-front-page1-cover.jpg"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-foreground/75">
              The flower-lined front of Villa Vessela.
            </figcaption>
          </figure>

          <div>
            <PageSectionHeading
              description="Indoor gathering areas, practical self-catering facilities, and outdoor space are described from the supplied listing and project information."
              eyebrow="Spaces and facilities"
              id="spaces-title"
              title="A free-standing villa inside a gated tropical compound"
            />

            <div className="mt-10 grid gap-5">
              {accommodationGroups.map((group) => (
                <article className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8" key={group.title}>
                  <h3 className="text-2xl font-semibold">{group.title}</h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <li className="flex gap-3 text-sm leading-6 text-foreground/75" key={item}>
                        <Check aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={18} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="inclusions-title" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            align="center"
            description="These structures appear in the supplied information, but their booking status must not be assumed."
            eyebrow="Important inclusion notes"
            id="inclusions-title"
            title="Confirm these arrangements before booking"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {accommodationInclusionNotes.map((note) => (
              <article className="rounded-card border border-accent/35 bg-accent/10 p-6" key={note.title}>
                <ShieldCheck aria-hidden="true" className="text-warning" size={27} />
                <h3 className="mt-5 text-xl font-semibold">{note.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/75">{note.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[1.75rem] bg-primary px-6 py-9 text-center text-white sm:px-10 lg:flex-row lg:text-left">
            <div>
              <h2 className="text-2xl font-semibold">Planning the practical details?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Review cooking, connectivity, arrival, packing, and house-rule guidance before the stay.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary hover:bg-surface-muted"
              href="/guest-guide"
              prefetch={false}
            >
              Open the guest guide
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
