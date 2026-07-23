# Review Components

## Purpose

This directory presents the supplied Airbnb rating summary and approved excerpts while keeping source attribution and independent-site limitations visible.

## Components

- `RatingSummary.tsx` presents the reported overall score and review count.
- `RatingBreakdown.tsx` presents the six supplied category scores as text.
- `ReviewCard.tsx` renders one supplied excerpt with date, first name, and star label.
- `MessengerReviewPlaceholders.tsx` reserves space without inventing Facebook/Messenger feedback.

## Interactions and configuration

The Reviews route passes static typed records from `src/data/reviews.ts`; these components perform no fetch and read no environment variable. A future approved Airbnb destination must enter through validated public configuration, not a review component.

## Restrictions

- Do not describe rating data as live-synced.
- Do not imply Airbnb endorsement or management of this site.
- Do not fabricate reviews, names, ratings, or screenshots.
- Do not publish Messenger profile details, surnames, phone numbers, or unrelated messages without explicit permission.

## Testing

Audit every displayed value and excerpt against `src/data/reviews.ts` and the supplied package. Run semantic-label, disabled-destination, Axe, responsive, lint, type, and production-build checks after changes.

## Security, privacy, and careful review

Assume every prop becomes public. `ReviewCard.tsx`, `RatingSummary.tsx`, and the Messenger placeholder component require source/permission review because changes can expose guest identity or misstate provenance; approved review media also requires a private-detail scan.
