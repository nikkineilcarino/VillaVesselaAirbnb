"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <section
      aria-labelledby="dashboard-error-heading"
      className="rounded-card border border-danger/35 bg-surface p-7 text-center shadow-soft"
      role="alert"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-danger uppercase">
        Dashboard unavailable
      </p>
      <h1 className="mt-3 text-3xl font-semibold" id="dashboard-error-heading">
        We could not finish this report.
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-foreground/70">
        Try again or return to the default reporting period. No database, account, or technical error details are displayed.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-primary hover:bg-surface-muted"
          href="/admin/dashboard?range=30d"
        >
          Last 30 days
        </Link>
      </div>
    </section>
  );
}

