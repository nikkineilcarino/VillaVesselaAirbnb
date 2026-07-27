import type { Metadata } from "next";

import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import { galleryItems } from "@/data/gallery";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Browse supplied photographs of Villa Vessela, its rooms, garden, amenities, nearby beach, and local attractions.",
  path: "/gallery",
  title: "Gallery",
});

export default function GalleryPage() {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary hover:bg-surface-muted"
            href="#gallery-grid"
          >
            Browse gallery categories
          </a>
        }
        currentPage="Gallery"
        currentPath="/gallery"
        description="Explore supplied photographs of the villa, indoor and outdoor spaces, nearby beach, local scenery, and stay examples in an accessible lightbox."
        eyebrow="Property gallery"
        title="A closer look at Villa Vessela"
      />

      <section aria-labelledby="gallery-grid" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Open any photograph for a larger view. Captions identify nearby attractions and clearly separate optional or still-unconfirmed arrangements."
            eyebrow="37 supplied photographs"
            id="gallery-grid"
            title="Explore the property and nearby coast"
          />
          <DisclosureNote className="mt-8" title="Three future photo slots are reserved">
            <p>
              Blue Kubo, Green Kubo, and confirmed parking still use clearly labelled placeholders and can be added later without changing the gallery layout. Their booking arrangements require owner confirmation. Food is illustrative rather than included, small pets require prior approval, and the beach cottage may be unavailable or separately charged.
            </p>
          </DisclosureNote>
          <div className="mt-10">
            <GalleryExperience items={galleryItems} />
          </div>
          <p className="mt-8 text-center text-sm leading-6 text-foreground/75">
            Use Tab to reach a category, Enter or Space to open it, arrow keys for previous and next, and Escape to close.
          </p>
        </Container>
      </section>
    </main>
  );
}
