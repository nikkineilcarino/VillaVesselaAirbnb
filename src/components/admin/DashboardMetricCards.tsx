import {
  CalendarClock,
  ExternalLink,
  Eye,
  MousePointerClick,
  Send,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

import type { DashboardLinkTotal, DashboardSummary } from "@/types/dashboard";

type MetricDefinition = {
  description: string;
  icon: ComponentType<{ "aria-hidden": true; className?: string; size?: number }>;
  label: string;
  value: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

export function DashboardMetricCards({
  links,
  summary,
}: {
  links: DashboardLinkTotal[];
  summary: DashboardSummary;
}) {
  const metrics: MetricDefinition[] = [
    {
      description: "Distinct anonymous visitor IDs among people who allowed analytics",
      icon: Users,
      label: "Estimated unique visitors",
      value: formatCount(summary.estimatedUniqueVisitors),
    },
    {
      description: "Recorded public-route views after analytics was allowed",
      icon: Eye,
      label: "Total page views",
      value: formatCount(summary.totalPageViews),
    },
    {
      description: "Distinct anonymous sessions after analytics was allowed",
      icon: CalendarClock,
      label: "Sessions",
      value: formatCount(summary.sessions),
    },
    {
      description: "All supported external-link click records after analytics was allowed",
      icon: ExternalLink,
      label: "External-link clicks",
      value: formatCount(summary.totalExternalLinkClicks),
    },
    {
      description: `${formatCount(summary.uniqueClickingVisitors)} visitors who allowed analytics clicked an external link`,
      icon: MousePointerClick,
      label: "Click-through rate",
      value: `${summary.clickThroughRate.toFixed(1)}%`,
    },
    {
      description: "Inquiries currently carrying new status",
      icon: Send,
      label: "New inquiries",
      value: formatCount(summary.newInquiries),
    },
  ];

  return (
    <section aria-labelledby="dashboard-summary-heading" className="mt-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold" id="dashboard-summary-heading">
            Summary metrics
          </h2>
        </div>
        <p className="text-sm text-foreground/60">
          Database totals for the selected period; analytics metrics include only allowed collection
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ description, icon: Icon, label, value }) => (
          <article className="rounded-card border border-border bg-surface p-5" key={label}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold leading-5 text-foreground/70">{label}</p>
              <Icon aria-hidden className="shrink-0 text-secondary" size={20} />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Complete breakdown
          </p>
          <h3 className="mt-2 text-xl font-semibold">Link clicks by category</h3>
        </div>
        <p className="text-sm text-foreground/60">
          Every supported reporting category is shown, including zero totals
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {links.map((link) => (
          <article
            className="rounded-card border border-border bg-surface p-5"
            key={link.linkType}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold leading-5 text-foreground/70">
                {link.label} clicks
              </p>
              <ExternalLink aria-hidden className="shrink-0 text-secondary" size={20} />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {formatCount(link.total)}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              Consent-based clicks categorized as {link.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
