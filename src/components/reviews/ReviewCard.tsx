import { Quote, Star } from "lucide-react";

import type { ReviewPreview } from "@/data/reviews";

export function ReviewCard({ review }: { review: ReviewPreview }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-soft sm:p-7">
      <Quote aria-hidden="true" className="text-accent" size={31} strokeWidth={1.5} />
      <p className="mt-5 flex-1 text-base leading-8 text-foreground/80">“{review.quote}”</p>
      <footer className="mt-7 border-t border-border pt-5">
        <div className="flex gap-1 text-accent" role="img" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, index) => (
            <Star aria-hidden="true" fill="currentColor" key={index} size={16} />
          ))}
        </div>
        <p className="mt-3 font-semibold">{review.name}</p>
        <p className="mt-1 text-sm text-foreground/75">{review.date} · Airbnb</p>
      </footer>
    </article>
  );
}
