import { reviewSummary } from "@/data/reviews";

export function RatingBreakdown() {
  return (
    <section aria-labelledby="rating-breakdown-title" className="rounded-card border border-border bg-surface p-7 shadow-soft sm:p-9">
      <h2 className="text-2xl font-semibold" id="rating-breakdown-title">
        Rating categories
      </h2>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        {reviewSummary.categories.map((category) => (
          <div className="border-b border-border pb-4" key={category.label}>
            <dt className="text-sm text-foreground/75">{category.label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{category.value.toFixed(1)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
