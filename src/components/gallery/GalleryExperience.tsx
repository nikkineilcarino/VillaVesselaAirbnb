"use client";

import { useCallback, useRef, useState } from "react";

import type { GalleryItem } from "@/data/gallery";

import { GalleryGrid } from "./GalleryGrid";
import { GalleryLightbox } from "./GalleryLightbox";

export function GalleryExperience({ items }: { items: readonly GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  const next = useCallback(() => {
    setActiveIndex((current) => (current === null ? 0 : (current + 1) % items.length));
  }, [items.length]);

  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? items.length - 1 : (current - 1 + items.length) % items.length,
    );
  }, [items.length]);

  const open = useCallback((index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }, []);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <GalleryGrid items={items} onOpen={open} />
      {activeItem && activeIndex !== null ? (
        <GalleryLightbox
          index={activeIndex}
          item={activeItem}
          onClose={close}
          onNext={next}
          onPrevious={previous}
          total={items.length}
        />
      ) : null}
    </>
  );
}
