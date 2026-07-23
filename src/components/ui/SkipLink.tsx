import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SkipLink({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 font-semibold text-white transition-transform focus:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}
