"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type GalleryImageProps = {
  alt: string;
  className?: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  quality?: number;
  sizes: string;
  src: string;
};

export function GalleryImage({
  alt,
  className,
  fit = "cover",
  priority = false,
  quality,
  sizes,
  src,
}: GalleryImageProps) {
  const [state, setState] = useState<"error" | "loaded" | "loading">("loading");

  return (
    <div className={cn("relative h-full w-full bg-surface-muted", className)}>
      {state === "loading" ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center text-xs font-semibold tracking-wide text-foreground/70 uppercase"
        >
          Loading image
        </span>
      ) : null}
      {state === "error" ? (
        <div className="absolute inset-0 grid place-items-center p-6 text-center" role="status">
          <div>
            <ImageOff aria-hidden="true" className="mx-auto text-secondary" size={30} />
            <p className="mt-3 text-sm font-semibold">Image unavailable</p>
            <p className="mt-1 text-xs leading-5 text-foreground/70">
              The gallery label and description remain available.
            </p>
          </div>
        </div>
      ) : null}
      <Image
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          fit === "contain" ? "object-contain" : "object-cover",
          state === "loaded" ? "opacity-100" : "opacity-0",
        )}
        fill
        onError={() => setState("error")}
        onLoad={() => setState("loaded")}
        priority={priority}
        quality={quality}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}
