import Image from "next/image";

import { cn } from "@/lib/utils";

const logoSources = {
  full: {
    dark: "/logo/villa-vessela-logo-dark.svg",
    light: "/logo/villa-vessela-logo-light.svg",
  },
  mark: {
    dark: "/logo/villa-vessela-mark.svg",
    light: "/logo/villa-vessela-mark-light.svg",
  },
} as const;

const logoDimensions = {
  full: { height: 120, width: 480 },
  mark: { height: 128, width: 128 },
} as const;

export type VillaLogoProps = {
  className?: string;
  format?: keyof typeof logoSources;
  priority?: boolean;
  tone?: keyof (typeof logoSources)["full"];
};

export function VillaLogo({
  className,
  format = "full",
  priority = false,
  tone = "dark",
}: VillaLogoProps) {
  const dimensions = logoDimensions[format];

  return (
    <Image
      alt={format === "full" ? "Villa Vessela" : "Villa Vessela emblem"}
      className={cn("h-auto", className)}
      height={dimensions.height}
      priority={priority}
      src={logoSources[format][tone]}
      width={dimensions.width}
    />
  );
}
