import type { Metadata } from "next";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { MessengerReviewPlaceholders } from "@/components/reviews/MessengerReviewPlaceholders";
import { RatingBreakdown } from "@/components/reviews/RatingBreakdown";
import { RatingSummary } from "@/components/reviews/RatingSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction } from "@/data/navigation";
import { reviewPreviews, reviewPublicationNote } from "@/data/reviews";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Read the supplied Villa Vessela Airbnb rating summary and selected review excerpts with clear source and independence disclosures.",
  path: "/reviews",
  title: "Reviews",
});

export default function ReviewsPage() {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary hover:bg-surface-muted"
            href="#airbnb-feedback"
          >
            Read supplied feedback
          </a>
        }
        currentPage="Reviews"
        currentPath="/reviews"
        description="A transparent presentation of the rating summary and selected excerpts supplied from the property's Airbnb listing."
        eyebrow="Guest feedback"
        title="What guests have shared about Villa Vessela"
      />

      <section aria-labelledby="airbnb-feedback" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description={reviewPublicationNote}
            eyebrow="Airbnb listing information"
            id="airbnb-feedback"
            title="Reported ratings, presented with their source"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <RatingSummary />
            <RatingBreakdown />
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {reviewPreviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

          <div className="mt-10 text-center">
            {primaryBookingAction.href ? (
              <TrackedExternalLink
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                href={primaryBookingAction.href}
                linkType="airbnb"
              >
                View all reviews on Airbnb
              </TrackedExternalLink>
            ) : (
              <Button
                aria-label={`View all reviews on Airbnb: ${primaryBookingAction.unavailableReason}`}
                disabled
                title={primaryBookingAction.unavailableReason}
                variant="secondary"
              >
                View all reviews on Airbnb
              </Button>
            )}
            <p className="mt-3 text-sm leading-6 text-foreground/75">
              {primaryBookingAction.href
                ? "This opens the configured, approved Airbnb destination."
                : "The full verified Airbnb destination has not been configured."}
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="messenger-feedback" className="bg-surface-muted py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="The project package requests space for approved Messenger feedback, but no publishable text or privacy-safe screenshots have been supplied."
            eyebrow="Messenger feedback"
            id="messenger-feedback"
            title="Reserved without inventing reviews"
          />
          <div className="mt-10">
            <MessengerReviewPlaceholders />
          </div>
        </Container>
      </section>
    </main>
  );
}
