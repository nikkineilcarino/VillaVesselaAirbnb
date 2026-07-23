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
    "Browse Villa Vessela's planned gallery categories through clearly labelled placeholders while approved property photography is pending.",
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
        description="Explore the planned photo categories in an accessible lightbox. Every current image is a visible placeholder, not a photograph of the property."
        eyebrow="Property gallery"
        title="A closer look, ready for official photography"
      />

      <section aria-labelledby="gallery-grid" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Open any category to test the complete gallery experience. Approved Villa Vessela photographs can replace these assets without changing the interaction."
            eyebrow="Fourteen categories"
            id="gallery-grid"
            title="Explore each part of the planned gallery"
          />
          <DisclosureNote className="mt-8" title="Every current image is provisional">
            <p>
              The illustrations below reserve layout only. They do not document the appearance of the villa, room arrangement, kubo inclusion, parking, beach conditions, or nearby attractions.
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
