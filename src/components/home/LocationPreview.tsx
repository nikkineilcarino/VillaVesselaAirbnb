import { Compass, MapPin } from "lucide-react";
import Image from "next/image";

import { InteractiveMaps } from "@/components/location/InteractiveMaps";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locationPreview } from "@/data/location";

import { SectionHeading } from "./SectionHeading";

export function LocationPreview() {
  const mapsConfigured = Boolean(
    locationPreview.mapEmbedUrl &&
      locationPreview.mapUrl &&
      locationPreview.wazeEmbedUrl &&
      locationPreview.wazeUrl,
  );

  return (
    <section
      aria-labelledby="location-title"
      className="py-20 sm:py-24"
      id="location"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2" size="wide">
        <div>
          <SectionHeading
            description="Set in Tondol, a quieter coastal area of Anda with the sandy beach just a short walk from the compound."
            eyebrow="Location"
            id="location-title"
            title="Close to the shore, away from the city"
          />

          <div className="mt-8 space-y-5">
            <div className="flex gap-4 rounded-card border border-border bg-surface p-5">
              <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={24} />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {locationPreview.address}
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-card border border-border bg-surface p-5">
              <Compass aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={24} />
              <div>
                <h3 className="font-semibold">Approach from Anda town</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {locationPreview.directions}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs leading-5 text-foreground/75">
            The map pin is verified against the public property listing. Confirm final
            arrival details through an approved booking or caretaker channel.
          </p>
        </div>

        {mapsConfigured ? (
          <InteractiveMaps
            googleMapsEmbedUrl={locationPreview.mapEmbedUrl}
            googleMapsUrl={locationPreview.mapUrl}
            wazeEmbedUrl={locationPreview.wazeEmbedUrl}
            wazeUrl={locationPreview.wazeUrl}
          />
        ) : (
          <div>
            <figure>
              <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface-muted shadow-soft">
                <Image
                  alt="Illustrated coastline map placeholder for Villa Vessela; interactive map configuration pending"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  src="/images/placeholders/location-placeholder.svg"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-foreground/75">
                Map illustration only — not a navigational map. Interactive maps are
                temporarily unavailable.
              </figcaption>
            </figure>
            <Button
              aria-label="Open interactive maps: map configuration unavailable"
              className="mt-6"
              disabled
              title="Map configuration unavailable"
              variant="secondary"
            >
              Interactive maps unavailable
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
