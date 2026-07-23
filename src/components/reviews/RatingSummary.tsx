import { Star } from "lucide-react";

import { reviewSummary } from "@/data/reviews";

export function RatingSummary() {
  return (
    <section aria-labelledby="rating-summary-title" className="rounded-[1.75rem] bg-primary-dark p-7 text-white shadow-soft sm:p-9">
      <p className="text-sm font-bold tracking-[0.18em] text-white/90 uppercase">Airbnb summary</p>
      <h2 className="mt-4 text-5xl font-semibold tracking-tight" id="rating-summary-title">
        {reviewSummary.rating}
        <span className="text-xl font-normal text-white/75"> / 5</span>
      </h2>
      <div className="mt-5 flex gap-1 text-accent" role="img" aria-label="Rating reported as 4.76 out of 5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star aria-hidden="true" fill="currentColor" key={index} size={20} />
        ))}
      </div>
      <p className="mt-5 text-base leading-7 text-white/80">
        Based on {reviewSummary.count} reviews reported in the supplied Airbnb listing information.
      </p>
    </section>
  );
}
