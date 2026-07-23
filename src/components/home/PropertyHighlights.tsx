import { Bath, BedDouble, Maximize2, UsersRound } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { expandedCapacityNote, propertyStats } from "@/data/accommodation";

import { SectionHeading } from "./SectionHeading";

const icons = [UsersRound, BedDouble, Maximize2, Bath] as const;

export function PropertyHighlights() {
  return (
    <section aria-labelledby="highlights-title" className="py-20 sm:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          description="A free-standing holiday home with comfortable shared spaces, private outdoor areas, and the beach only a short walk away."
          eyebrow="At a glance"
          id="highlights-title"
          title="Space for unhurried days together"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {propertyStats.map((stat, index) => {
            const Icon = icons[index];

            return (
              <article
                className="rounded-card border border-border bg-surface p-6 shadow-soft"
                key={stat.value}
              >
                {Icon ? (
                  <Icon aria-hidden="true" className="text-secondary" size={28} strokeWidth={1.6} />
                ) : null}
                <p className="mt-5 text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/75">{stat.detail}</p>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-7 max-w-3xl rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-center text-sm leading-6 text-foreground/75">
          {expandedCapacityNote}
        </p>
      </Container>
    </section>
  );
}
