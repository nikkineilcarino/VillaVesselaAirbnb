import { Images } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { galleryPreviewItems } from "@/data/gallery";

import { SectionHeading } from "./SectionHeading";

export function GalleryPreview() {
  return (
    <section aria-labelledby="gallery-title" className="py-20 sm:py-24">
      <Container size="wide">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            className="max-w-2xl"
            description="See the villa exterior, sleeping spaces, tropical garden, and nearby Tondol Beach through photographs supplied for Villa Vessela."
            eyebrow="Gallery preview"
            id="gallery-title"
            title="A first look at Villa Vessela"
          />
          <p className="inline-flex max-w-sm items-center gap-3 rounded-full border border-border bg-surface-muted px-5 py-3 text-sm text-foreground/75">
            <Images aria-hidden="true" className="shrink-0 text-secondary" size={19} />
            Explore 41 supplied photographs in the full gallery.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryPreviewItems.map((item, index) => (
            <figure
              className={
                index === 0
                  ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                  : index === galleryPreviewItems.length - 1
                    ? "sm:col-span-2 lg:col-span-2"
                    : undefined
              }
              key={item.category}
            >
              <div
                className={
                  index === galleryPreviewItems.length - 1
                    ? "relative aspect-[9/7] overflow-hidden rounded-card border border-border bg-surface-muted lg:aspect-[18/7]"
                    : "relative aspect-[9/7] overflow-hidden rounded-card border border-border bg-surface-muted"
                }
              >
                <Image
                  alt={item.alt}
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  fill
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
                  src={item.src}
                />
              </div>
              <figcaption className="mt-3 text-sm font-semibold">{item.category}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
