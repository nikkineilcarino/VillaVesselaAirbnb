"use client";

import { Expand } from "lucide-react";

import type { GalleryItem } from "@/data/gallery";

import { GalleryImage } from "./GalleryImage";

export type GalleryGridProps = {
  items: readonly GalleryItem[];
  onOpen: (index: number, trigger: HTMLButtonElement) => void;
};

export function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <article className="overflow-hidden rounded-card border border-border bg-surface shadow-soft" key={item.id}>
          <button
            aria-label={`Open ${item.category} image`}
            className="group block w-full text-left"
            onClick={(event) => onOpen(index, event.currentTarget)}
            type="button"
          >
            <span className="relative block aspect-[9/7] overflow-hidden">
              <GalleryImage
                alt={item.alt}
                className="transition-transform duration-500 group-hover:scale-[1.02]"
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={item.src}
              />
              <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-primary-dark/90 px-3 py-2 text-xs font-semibold text-white">
                <Expand aria-hidden="true" size={15} />
                Open image
              </span>
            </span>
            <span className="block p-5">
              <span className="block text-lg font-semibold text-foreground">{item.category}</span>
              <span className="mt-1 block text-sm leading-6 text-foreground/75">
                {item.caption}
              </span>
            </span>
          </button>
        </article>
      ))}
    </div>
  );
}
