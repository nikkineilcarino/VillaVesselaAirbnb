"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { GalleryItem } from "@/data/gallery";

import { GalleryImage } from "./GalleryImage";

export type GalleryLightboxProps = {
  index: number;
  item: GalleryItem;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  total: number;
};

export function GalleryLightbox({
  index,
  item,
  onClose,
  onNext,
  onPrevious,
  total,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex="0"]'),
      );
      const first = controls[0];
      const last = controls.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      aria-labelledby="gallery-lightbox-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid bg-primary-dark/95 p-3 sm:p-6"
      ref={dialogRef}
      role="dialog"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <div className="flex items-center justify-between gap-5 py-2 text-white">
          <div>
            <p className="text-xs font-bold tracking-wider text-white/75 uppercase">
              Image {index + 1} of {total}
            </p>
            <h2 className="mt-1 text-xl font-semibold" id="gallery-lightbox-title">
              {item.category}
            </h2>
          </div>
          <button
            aria-label="Close gallery"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" size={23} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.5rem] border border-white/20 bg-surface-muted">
          <GalleryImage alt={item.alt} fit="contain" key={item.id} priority sizes="90vw" src={item.src} />
        </div>

        <div className="flex items-center justify-between gap-4 py-3 text-white">
          <button
            aria-label="Previous image"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold hover:bg-white/10"
            onClick={onPrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={19} />
            Previous
          </button>
          <p className="hidden max-w-xl text-center text-xs leading-5 text-white/75 sm:block">
            {item.caption}
          </p>
          <button
            aria-label="Next image"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold hover:bg-white/10"
            onClick={onNext}
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
