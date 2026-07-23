import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DisclosureNoteProps = {
  children: ReactNode;
  className?: string;
  title: string;
};

export function DisclosureNote({ children, className, title }: DisclosureNoteProps) {
  return (
    <aside
      className={cn(
        "flex gap-4 rounded-card border border-accent/35 bg-accent/10 p-5 sm:p-6",
        className,
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 shrink-0 text-warning" size={23} />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <div className="mt-2 text-sm leading-6 text-foreground/75">{children}</div>
      </div>
    </aside>
  );
}
