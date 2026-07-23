import { MessageCircleMore } from "lucide-react";

import { messengerReviewPlaceholders } from "@/data/reviews";

export function MessengerReviewPlaceholders() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {messengerReviewPlaceholders.map((placeholder) => (
        <article className="rounded-card border border-dashed border-border bg-surface-muted p-6" key={placeholder.id}>
          <MessageCircleMore aria-hidden="true" className="text-secondary" size={28} />
          <h3 className="mt-5 font-semibold">{placeholder.label}</h3>
          <p className="mt-3 text-sm leading-6 text-foreground/75">
            No quote, reviewer identity, rating, or screenshot is published until permission and privacy-safe source material are supplied.
          </p>
        </article>
      ))}
    </div>
  );
}
