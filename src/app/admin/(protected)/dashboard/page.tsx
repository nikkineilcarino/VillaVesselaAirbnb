import type { Metadata } from "next";
import { AlertTriangle, Database, Info, RefreshCw } from "lucide-react";
import Link from "next/link";

import { DashboardActivityTables } from "@/components/admin/DashboardActivityTables";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { DashboardDateFilters } from "@/components/admin/DashboardDateFilters";
import { DashboardExportLinks } from "@/components/admin/DashboardExportLinks";
import { DashboardMetricCards } from "@/components/admin/DashboardMetricCards";
import { DashboardOperationalStatus } from "@/components/admin/DashboardOperationalStatus";
import { isContactInquiryVisible } from "@/lib/config/features";
import { resolveDashboardDateRange } from "@/lib/dashboard/dateRange";
import { getDashboardData } from "@/lib/dashboard/query";
import { getDashboardOperationalStatus } from "@/lib/dashboard/status";

export const metadata: Metadata = {
  description: "Protected, privacy-safe Villa Vessela analytics reporting.",
  title: "Analytics dashboard",
};

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function buildRangeHref(range: {
  endDate: string;
  preset: string;
  startDate: string;
}) {
  if (range.preset === "custom") {
    const query = new URLSearchParams({
      end: range.endDate,
      range: "custom",
      start: range.startDate,
    });
    return `/admin/dashboard?${query.toString()}`;
  }

  return `/admin/dashboard?range=${range.preset}`;
}

export default async function AdminDashboardPage({
  searchParams,
}: DashboardPageProps) {
  const parameters = await searchParams;
  const now = new Date();
  const rangeResult = resolveDashboardDateRange(parameters, now);
  const fallbackResult = resolveDashboardDateRange({}, now);
  const operationalStatus = await getDashboardOperationalStatus();
  const inquiryVisible = isContactInquiryVisible();

  if (!fallbackResult.success) {
    throw new Error("Dashboard date initialization failed.");
  }

  const displayedRange = rangeResult.success ? rangeResult.range : fallbackResult.range;

  return (
    <section aria-labelledby="dashboard-heading">
      <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <Database aria-hidden="true" size={25} strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
          Protected reporting
        </p>
        <h1
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          id="dashboard-heading"
        >
          Analytics dashboard
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-foreground/70">
          {inquiryVisible
            ? "Review privacy-safe website activity and inquiry totals. Every value comes from the authenticated database connection; no sample fallback is substituted for missing data."
            : "Review privacy-safe website activity. Every value comes from the authenticated database connection; no sample fallback is substituted for missing data."}
        </p>
      </div>

      <DashboardOperationalStatus status={operationalStatus} />

      <div className="mt-6">
        <DashboardDateFilters
          activePreset={rangeResult.success ? rangeResult.range.preset : "custom"}
          range={displayedRange}
        />
      </div>

      {!rangeResult.success ? (
        <div
          className="mt-6 rounded-card border border-danger/35 bg-danger/5 p-6"
          role="alert"
        >
          <div className="flex gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-danger" size={21} />
            <div>
              <h2 className="font-semibold">That reporting period is not valid</h2>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{rangeResult.message}</p>
              <Link
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-primary hover:bg-surface-muted"
                href="/admin/dashboard?range=30d"
              >
                Return to the last 30 days
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <DashboardResults
          inquiryVisible={inquiryVisible}
          range={rangeResult.range}
        />
      )}
    </section>
  );
}

async function DashboardResults({
  inquiryVisible,
  range,
}: {
  inquiryVisible: boolean;
  range: Extract<
    ReturnType<typeof resolveDashboardDateRange>,
    { success: true }
  >["range"];
}) {
  const result = await getDashboardData(range, {
    includeInquiries: inquiryVisible,
  });

  if (result.status === "unavailable") {
    return (
      <div
        className="mt-6 rounded-card border border-warning/40 bg-warning/5 p-6"
        role="alert"
      >
        <div className="flex gap-3">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-warning" size={21} />
          <div>
            <h2 className="font-semibold">Dashboard data is temporarily unavailable</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70">
              The reporting query could not be completed. No database or account details are shown, and an outage is not presented as an empty report.
            </p>
            <Link
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-primary hover:bg-surface-muted"
              href={buildRangeHref(range)}
            >
              <RefreshCw aria-hidden="true" size={16} />
              Try this period again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data } = result;
  const empty =
    data.summary.totalPageViews === 0 &&
    data.summary.totalExternalLinkClicks === 0 &&
    (!inquiryVisible || data.recentInquiries.length === 0);

  return (
    <>
      {data.summary.hasDemonstrationData ? (
        <div
          className="mt-6 rounded-card border border-accent/50 bg-accent/10 p-5"
          role="status"
        >
          <div className="flex gap-3">
            <Info aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={21} />
            <div>
              <h2 className="font-semibold">Demonstration data included</h2>
              <p className="mt-1 text-sm leading-6 text-foreground/70">
                This selected period contains visibly synthetic local seed records. Do not interpret those records as guest activity.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {empty ? (
        <div className="mt-6 rounded-card border border-dashed border-border bg-surface-muted/55 p-6" role="status">
          <h2 className="font-semibold">No activity in this period</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            {inquiryVisible
              ? "The database query succeeded, but it returned no page views, link clicks, or inquiries for these dates."
              : "The database query succeeded, but it returned no page views or link clicks for these dates."}
          </p>
        </div>
      ) : null}

      <DashboardMetricCards
        links={data.links}
        showInquiries={inquiryVisible}
        summary={data.summary}
      />
      <DashboardCharts
        daily={data.daily}
        devices={data.devices}
        links={data.links}
        pages={data.pages}
      />
      <DashboardActivityTables
        inquiries={data.recentInquiries}
        links={data.recentLinks}
        pages={data.recentPages}
        showInquiries={inquiryVisible}
      />
      <DashboardExportLinks range={range} showInquiries={inquiryVisible} />

      <details className="mt-7 rounded-card border border-border bg-surface p-5">
        <summary className="cursor-pointer font-semibold text-primary">Metric definitions</summary>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-foreground/70 md:grid-cols-2">
          <p>
            <strong className="text-foreground">Estimated unique visitors:</strong>{" "}
            distinct anonymous visitor IDs among people who allowed analytics in the selected period.
          </p>
          <p>
            <strong className="text-foreground">Sessions:</strong> distinct anonymous session IDs created after analytics was allowed in the selected period.
          </p>
          <p>
            <strong className="text-foreground">Click-through rate:</strong> visitors who allowed analytics and both viewed a page and clicked at least one supported external link, divided by estimated unique visitors. A zero denominator returns 0%.
          </p>
          <p>
            <strong className="text-foreground">Date boundary:</strong> start-inclusive and end-exclusive UTC timestamps derived from Asia/Manila midnight.
          </p>
        </div>
      </details>
    </>
  );
}
