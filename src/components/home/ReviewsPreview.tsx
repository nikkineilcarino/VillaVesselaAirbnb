import { Quote, Star } from "lucide-react";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction } from "@/data/navigation";
import { reviewPreviews, reviewSummary } from "@/data/reviews";

import { SectionHeading } from "./SectionHeading";

export function ReviewsPreview() {
  return (
    <section aria-labelledby="reviews-title" className="bg-surface-muted py-20 sm:py-24">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <SectionHeading
              description={`${reviewSummary.count} reviews are reported on the property's Airbnb listing.`}
              eyebrow="Guest feedback"
              id="reviews-title"
              title={`${reviewSummary.rating} out of 5`}
            />
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
              {reviewSummary.categories.map((category) => (
                <div className="border-b border-border pb-3" key={category.label}>
                  <p className="text-xs text-foreground/75">{category.label}</p>
                  <p className="mt-1 font-semibold">{category.value.toFixed(1)}</p>
                </div>
              ))}
            </div>
            {primaryBookingAction.href ? (
              <TrackedExternalLink
                className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                href={primaryBookingAction.href}
                linkType="airbnb"
              >
                View all reviews on Airbnb
              </TrackedExternalLink>
            ) : (
              <Button
                aria-label={`View all reviews on Airbnb: ${primaryBookingAction.unavailableReason}`}
                className="mt-8"
                disabled
                title={primaryBookingAction.unavailableReason}
                variant="secondary"
              >
                View all reviews on Airbnb
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviewPreviews.map((review) => (
              <article className="flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-soft" key={review.name}>
                <Quote aria-hidden="true" className="text-accent" size={30} strokeWidth={1.5} />
                <p className="mt-5 flex-1 text-sm leading-7 text-foreground/72">
                  “{review.quote}”
                </p>
                <div className="mt-6 border-t border-border pt-5">
                  <span aria-label={`${review.rating} out of 5 stars`} className="flex gap-1 text-accent" role="img">
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Star aria-hidden="true" fill="currentColor" key={index} size={15} />
                    ))}
                  </span>
                  <p className="mt-3 font-semibold">{review.name}</p>
                  <p className="mt-1 text-xs text-foreground/75">{review.date} · Airbnb</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-foreground/75">
          Review excerpts are lightly polished from supplied Airbnb feedback. Airbnb
          does not endorse this independent website.
        </p>
      </Container>
    </section>
  );
}
