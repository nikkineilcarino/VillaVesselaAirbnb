import {
  CalendarClock,
  ExternalLink,
  Eye,
  MapPinned,
  MessageCircle,
  MousePointerClick,
  Send,
  Share2,
  Users,
  Waves,
} from "lucide-react";
import type { ComponentType } from "react";

import type { DashboardSummary } from "@/types/dashboard";

type MetricDefinition = {
  description: string;
  icon: ComponentType<{ "aria-hidden": true; className?: string; size?: number }>;
  label: string;
  value: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

export function DashboardMetricCards({ summary }: { summary: DashboardSummary }) {
  const metrics: MetricDefinition[] = [
    {
      description: "Distinct anonymous visitor IDs",
      icon: Users,
      label: "Estimated unique visitors",
      value: formatCount(summary.estimatedUniqueVisitors),
    },
    {
      description: "All recorded public-route views",
      icon: Eye,
      label: "Total page views",
      value: formatCount(summary.totalPageViews),
    },
    {
      description: "Distinct anonymous sessions",
      icon: CalendarClock,
      label: "Sessions",
      value: formatCount(summary.sessions),
    },
    {
      description: "Clicks to the configured Airbnb listing",
      icon: Waves,
      label: "Airbnb clicks",
      value: formatCount(summary.airbnbClicks),
    },
    {
      description: "Clicks to the configured Facebook page",
      icon: Share2,
      label: "Facebook clicks",
      value: formatCount(summary.facebookClicks),
    },
    {
      description: "Clicks to the approved map destination",
      icon: MapPinned,
      label: "Google Maps clicks",
      value: formatCount(summary.googleMapsClicks),
    },
    {
      description: "Clicks to the configured WhatsApp contact",
      icon: MessageCircle,
      label: "WhatsApp clicks",
      value: formatCount(summary.whatsappClicks),
    },
    {
      description: "All approved external-link click records",
      icon: ExternalLink,
      label: "External-link clicks",
      value: formatCount(summary.totalExternalLinkClicks),
    },
    {
      description: `${formatCount(summary.uniqueClickingVisitors)} visitors clicked an external link`,
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
        <p className="text-sm text-foreground/60">Database totals for the selected period</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
    </section>
  );
}
