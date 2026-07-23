import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[90rem]",
} as const;

export type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: keyof typeof sizeClasses;
};

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", sizeClasses[size], className)}
      {...props}
    />
  );
}
