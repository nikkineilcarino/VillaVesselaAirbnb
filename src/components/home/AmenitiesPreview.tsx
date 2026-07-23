import {
  Car,
  Droplets,
  Leaf,
  UtensilsCrossed,
  Waves,
  WifiOff,
  Wind,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { amenityPreviews, connectivityNote } from "@/data/amenities";

import { SectionHeading } from "./SectionHeading";

const amenityIcons = {
  air: Wind,
  beach: Waves,
  garden: Leaf,
  kitchen: UtensilsCrossed,
  parking: Car,
  shower: Droplets,
} as const;

export function AmenitiesPreview() {
  return (
    <section aria-labelledby="amenities-title" className="bg-primary-dark py-20 text-white sm:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          className="max-w-3xl"
          description="Practical comforts for a relaxed, self-catered stay by the beach—described carefully from the supplied listing information."
          eyebrow="Amenities"
          id="amenities-title"
          inverted
          title="Everything you need for an easy coastal stay"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenityPreviews.map((amenity) => {
            const Icon = amenityIcons[amenity.icon];

            return (
              <article
                className="rounded-card border border-white/15 bg-white/8 p-6"
                key={amenity.title}
              >
                <Icon aria-hidden="true" className="text-accent" size={29} strokeWidth={1.6} />
                <h3 className="mt-5 text-xl font-semibold">{amenity.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{amenity.description}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex gap-4 rounded-card border border-white/15 bg-white/8 p-6">
          <WifiOff aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={25} />
          <div>
            <h3 className="font-semibold">A clear note about connectivity</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">{connectivityNote}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
