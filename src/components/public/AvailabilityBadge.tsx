import { CheckCircle2, CircleHelp } from "lucide-react";

import type { AmenityAvailability } from "@/data/amenities";

const labels = {
  confirm: "Confirm before stay",
  supplied: "Supplied property information",
} as const satisfies Record<AmenityAvailability, string>;

export function AvailabilityBadge({ status }: { status: AmenityAvailability }) {
  const Icon = status === "supplied" ? CheckCircle2 : CircleHelp;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground/75">
      <Icon aria-hidden="true" size={14} />
      {labels[status]}
    </span>
  );
}
