import { Compass, MapPin } from "lucide-react";
import Image from "next/image";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locationPreview } from "@/data/location";

import { SectionHeading } from "./SectionHeading";

export function LocationPreview() {
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

          {locationPreview.mapUrl ? (
            <TrackedExternalLink
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
              href={locationPreview.mapUrl}
              linkType="google_maps"
            >
              Open in Google Maps
            </TrackedExternalLink>
          ) : (
            <Button
              aria-label="Open in Google Maps: verified map link awaiting confirmation"
              className="mt-7"
              disabled
              title="Verified Google Maps link awaiting confirmation"
              variant="secondary"
            >
              Open in Google Maps
            </Button>
          )}
          <p className="mt-3 text-xs leading-5 text-foreground/75">
            {locationPreview.mapUrl
              ? "Use only this configured, approved map destination for navigation."
              : "The map and listing URL remain disabled until the exact location is verified."}
          </p>
        </div>

        <figure>
          <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface-muted shadow-soft">
            <Image
              alt="Illustrated coastline map placeholder for Villa Vessela; verified Google Maps link pending"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/images/placeholders/location-placeholder.svg"
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-foreground/75">
            Map illustration only — not a navigational map. Verify the exact listing
            before travelling.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
