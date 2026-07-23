import { Footprints, Map, Sparkles, Waves } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { attractionPreviews } from "@/data/attractions";

import { SectionHeading } from "./SectionHeading";

const attractionIcons = {
  footprints: Footprints,
  islands: Map,
  salt: Sparkles,
  sandbar: Waves,
} as const;

export function AttractionsPreview() {
  return (
    <section aria-labelledby="attractions-title" className="bg-surface-muted py-20 sm:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          className="max-w-3xl"
          description="Island trips, beach time, and local traditions can add to a stay—always subject to weather, tides, providers, and current schedules."
          eyebrow="Nearby attractions"
          id="attractions-title"
          title="Explore more of Anda and Pangasinan"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attractionPreviews.map((attraction) => {
            const Icon = attractionIcons[attraction.icon];

            return (
              <article className="rounded-card border border-border bg-surface p-6 shadow-soft" key={attraction.title}>
                <Icon aria-hidden="true" className="text-secondary" size={29} strokeWidth={1.6} />
                <h3 className="mt-5 text-xl font-semibold">{attraction.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/75">
                  {attraction.description}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-foreground/75">
          Tour arrangements may be available. Guests should verify current prices and
          conditions and bring suitable sun protection, aqua shoes, and swimming gear.
        </p>
      </Container>
    </section>
  );
}
