import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  PauseCircle,
} from "lucide-react";
import type { ComponentType } from "react";

import { DashboardRefreshControl } from "@/components/admin/DashboardRefreshControl";
import { formatManilaTimestamp } from "@/lib/dashboard/aggregation";
import { resolveAnalyticsOperationalState } from "@/lib/dashboard/operational";
import type {
  AnalyticsOperationalState,
  DashboardOperationalStatus as OperationalStatus,
} from "@/types/dashboard";

type StatusPresentation = {
  description: string;
  icon: ComponentType<{ "aria-hidden": true; className?: string; size?: number }>;
  title: string;
  tone: string;
};

const statusPresentation: Record<AnalyticsOperationalState, StatusPresentation> = {
  activity: {
    description:
      "Collection and write storage are configured, authenticated reporting is reachable, and stored analytics activity is available. Live delivery is verified separately.",
    icon: Activity,
    title: "Stored analytics activity is available",
    tone: "border-success/35 bg-success/5",
  },
  disabled: {
    description:
      "The server-side analytics switch is off. New public visits and link clicks should not be collected.",
    icon: PauseCircle,
    title: "Analytics collection is disabled",
    tone: "border-border bg-surface-muted/55",
  },
  "healthy-no-data": {
    description:
      "Collection and write storage are configured and authenticated reporting is reachable, but no analytics records exist yet. This does not prove live event delivery.",
    icon: CheckCircle2,
    title: "Analytics is configured; no stored activity yet",
    tone: "border-success/35 bg-success/5",
  },
  "storage-unavailable": {
    description:
      "Collection is enabled, but analytics cannot be considered healthy until write storage is configured and authenticated reporting is reachable.",
    icon: AlertTriangle,
    title: "Analytics storage is unavailable",
    tone: "border-warning/40 bg-warning/5",
  },
};

function AvailabilityCard({
  description,
  label,
  value,
}: {
  description: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold tracking-[0.14em] text-foreground/55 uppercase">
        {label}
      </p>
      <p className="mt-2 font-semibold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-foreground/60">{description}</p>
    </div>
  );
}

function LastActivity({
  label,
  reportingAvailable,
  value,
}: {
  label: string;
  reportingAvailable: boolean;
  value: string | null;
}) {
  let content = "No record found";

  if (value) {
    content = formatManilaTimestamp(value);
  } else if (!reportingAvailable) {
    content = "Unavailable while reporting storage cannot be queried";
  }

  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.14em] text-foreground/55 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">
        {value ? <time dateTime={value}>{content}</time> : content}
      </dd>
    </div>
  );
}

export function DashboardOperationalStatus({
  status,
}: {
  status: OperationalStatus;
}) {
  const state = resolveAnalyticsOperationalState({
    collectionEnabled: status.collectionEnabled,
    hasActivity: Boolean(status.lastPageViewAt || status.lastLinkClickAt),
    reportingAvailable: status.reportingAvailable,
    storageConfigured: status.storageConfigured,
  });
  const presentation = statusPresentation[state];
  const Icon = presentation.icon;
  const storageValue = status.storageConfigured ? "Configured" : "Unconfigured";
  const reportingValue = status.reportingAvailable ? "Available" : "Unavailable";

  return (
    <section
      aria-labelledby="analytics-operational-status-heading"
      className={`mt-6 rounded-card border p-5 sm:p-6 ${presentation.tone}`}
    >
      <div className="flex gap-3">
        <Icon aria-hidden className="mt-0.5 shrink-0 text-secondary" size={22} />
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Operational status
          </p>
          <h2
            className="mt-2 text-xl font-semibold"
            id="analytics-operational-status-heading"
          >
            {presentation.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/70">
            {presentation.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <AvailabilityCard
          description="Evaluated from the exact server-only feature switch."
          label="Collection"
          value={status.collectionEnabled ? "Enabled" : "Disabled"}
        />
        <AvailabilityCard
          description="Checks only whether the server has the required write configuration; no value is displayed."
          label="Write storage"
          value={storageValue}
        />
        <AvailabilityCard
          description="Uses this signed-in administrator request and remains subject to Row Level Security."
          label="Authenticated reporting"
          value={reportingValue}
        />
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <Database aria-hidden className="mt-0.5 shrink-0 text-secondary" size={19} />
          <dl className="grid flex-1 gap-4 sm:grid-cols-2">
            <LastActivity
              label="Last page view"
              reportingAvailable={status.reportingAvailable}
              value={status.lastPageViewAt}
            />
            <LastActivity
              label="Last link click"
              reportingAvailable={status.reportingAvailable}
              value={status.lastLinkClickAt}
            />
          </dl>
        </div>
      </div>

      <div className="mt-5 border-t border-border/80 pt-4">
        <DashboardRefreshControl refreshedAt={status.refreshedAt} />
      </div>
    </section>
  );
}
