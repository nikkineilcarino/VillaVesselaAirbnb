import { Compass, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { CopyAddressButton } from "@/components/location/CopyAddressButton";
import { InteractiveMaps } from "@/components/location/InteractiveMaps";
import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locationPreview } from "@/data/location";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "View Villa Vessela's verified Tondol location in interactive Google Maps and Waze views, with supplied approach directions.",
  path: "/location",
  title: "Location",
});

export default function LocationPage() {
  const mapsConfigured = Boolean(
    locationPreview.mapEmbedUrl &&
      locationPreview.mapUrl &&
      locationPreview.wazeEmbedUrl &&
      locationPreview.wazeUrl,
  );

  return (
    <main id="main-content">
      <PageHero
        currentPage="Location"
        currentPath="/location"
        description="Use the confirmed address and supplied approach directions, or inspect the same verified property pin in Google Maps and Waze before travelling."
        eyebrow="Tondol, Anda"
        title="Close to the beach in a quieter coastal setting"
      />

      <section aria-labelledby="location-details" className="py-20 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2" size="wide">
          <div>
            <PageSectionHeading
              description="Keep the address available when travelling, and confirm final arrival instructions through an approved booking channel."
              eyebrow="Address and approach"
              id="location-details"
              title="Plan the final stretch to Tondol"
            />

            <div className="mt-9 space-y-5">
              <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
                <MapPin aria-hidden="true" className="text-secondary" size={28} />
                <h2 className="mt-5 text-xl font-semibold">Confirmed text address</h2>
                <address className="mt-3 text-base leading-7 text-foreground/80 not-italic">
                  {locationPreview.address}
                </address>
                <div className="mt-5">
                  <CopyAddressButton address={locationPreview.address} />
                </div>
              </article>

              <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
                <Compass aria-hidden="true" className="text-secondary" size={28} />
                <h2 className="mt-5 text-xl font-semibold">Approach from Anda town</h2>
                <p className="mt-3 text-base leading-7 text-foreground/80">
                  {locationPreview.directions}
                </p>
              </article>
            </div>
          </div>

          <div>
            {mapsConfigured ? (
              <InteractiveMaps
                googleMapsEmbedUrl={locationPreview.mapEmbedUrl}
                googleMapsUrl={locationPreview.mapUrl}
                wazeEmbedUrl={locationPreview.wazeEmbedUrl}
                wazeUrl={locationPreview.wazeUrl}
              />
            ) : (
              <>
                <figure>
                  <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface-muted shadow-soft">
                    <Image
                      alt="Illustrated coastline map placeholder for Villa Vessela; interactive map configuration pending"
                      className="object-cover"
                      fill
                      priority
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
                  size="large"
                  title="Map configuration unavailable"
                >
                  Interactive maps unavailable
                </Button>
              </>
            )}

            <DisclosureNote className="mt-5" title="Confirm final arrival details">
              <p>
                The verified map listing is “{locationPreview.workingListingName}”. Confirm
                final arrival details through the approved booking or caretaker channels,
                especially if travelling after dark or during poor weather.
              </p>
            </DisclosureNote>
          </div>
        </Container>
      </section>
    </main>
  );
}
