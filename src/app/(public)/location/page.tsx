import { Compass, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { CopyAddressButton } from "@/components/location/CopyAddressButton";
import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locationPreview } from "@/data/location";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Review Villa Vessela's confirmed Tondol address, supplied approach directions, and an owner-approved map destination when configured.",
  path: "/location",
  title: "Location",
});

export default function LocationPage() {
  return (
    <main id="main-content">
      <PageHero
        currentPage="Location"
        currentPath="/location"
        description="Use the confirmed text address and supplied approach directions for planning. A map action becomes active only when its complete destination is owner-approved and configured."
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
            <figure>
              <div className="relative aspect-[9/7] overflow-hidden rounded-[1.75rem] border border-border bg-surface-muted shadow-soft">
                <Image
                  alt="Illustrated coastline map placeholder for Villa Vessela; verified Google Maps destination pending"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  src="/images/placeholders/location-placeholder.svg"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-foreground/75">
                Map illustration only — not a navigational map and not a verified pin.
              </figcaption>
            </figure>

            {locationPreview.mapUrl ? (
              <TrackedExternalLink
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
                href={locationPreview.mapUrl}
                linkType="google_maps"
              >
                Open in Google Maps
              </TrackedExternalLink>
            ) : (
              <Button
                aria-label="Open in Google Maps: verified map link awaiting confirmation"
                className="mt-6"
                disabled
                size="large"
                title="Verified Google Maps link awaiting confirmation"
              >
                Open in Google Maps
              </Button>
            )}
            <DisclosureNote className="mt-5" title="Do not navigate from the illustration">
              <p>
                {locationPreview.mapUrl
                  ? `The working listing name is “${locationPreview.workingListingName}”. Use the configured map action—not this illustration—for navigation.`
                  : `The working listing name is “${locationPreview.workingListingName}”, but the exact map URL, embed URL, and pin must be confirmed before activation.`}
              </p>
            </DisclosureNote>
          </div>
        </Container>
      </section>
    </main>
  );
}
