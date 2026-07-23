export default function DashboardLoading() {
  return (
    <section aria-busy="true" aria-labelledby="dashboard-loading-heading" aria-live="polite">
      <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-9">
        <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
          Protected reporting
        </p>
        <h1 className="mt-3 text-3xl font-semibold" id="dashboard-loading-heading">
          Loading dashboard
        </h1>
        <p className="mt-3 text-sm text-foreground/65">
          Checking the selected period and retrieving database aggregates&hellip;
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            aria-hidden="true"
            className="h-36 animate-pulse rounded-card border border-border bg-surface-muted"
            key={index}
          />
        ))}
      </div>
      <span className="sr-only">Dashboard data is loading.</span>
    </section>
  );
}

