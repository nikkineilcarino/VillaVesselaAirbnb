import { Check, Info } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import {
  accommodationFeatures,
  bathroomNote,
  expandedCapacityNote,
} from "@/data/accommodation";

import { SectionHeading } from "./SectionHeading";

export function AccommodationPreview() {
  return (
    <section aria-labelledby="accommodation-title" className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2" size="wide">
        <figure>
          <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface-muted shadow-soft">
            <Image
              alt="Illustrated placeholder for the Villa Vessela exterior; official property photograph pending"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/images/placeholders/exterior-placeholder.svg"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-foreground/75">
            Illustrated exterior placeholder. Replace with an approved Villa Vessela
            photograph when available.
          </figcaption>
        </figure>

        <div>
          <SectionHeading
            description="Comfortable indoor gathering spaces meet practical self-catering facilities and private outdoor room to unwind."
            eyebrow="Accommodation"
            id="accommodation-title"
            title="A complete villa for time together"
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {accommodationFeatures.map((feature) => (
              <li className="flex gap-3 text-sm leading-6 text-foreground/75" key={feature}>
                <Check aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={19} />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 rounded-card border border-border bg-surface p-5">
            <p className="flex gap-3 text-sm leading-6 text-foreground/70">
              <Info aria-hidden="true" className="mt-0.5 shrink-0 text-primary" size={19} />
              {expandedCapacityNote}
            </p>
            <p className="pl-8 text-sm leading-6 text-foreground/70">{bathroomNote}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
