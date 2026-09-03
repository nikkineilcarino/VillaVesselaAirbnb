import { AlertTriangle, CheckCircle2, Inbox, PauseCircle } from "lucide-react";

import { formatManilaTimestamp } from "@/lib/dashboard/aggregation";
import type { InquiryOperationalStatus as OperationalStatus } from "@/lib/inquiries/status";

function StatusCard({
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

export function InquiryOperationalStatus({
  status,
}: {
  status: OperationalStatus;
}) {
  const healthy =
    status.collectionEnabled &&
    status.storageConfigured &&
    status.reportingAvailable;
  const incomplete =
    status.collectionEnabled &&
    (!status.storageConfigured || !status.reportingAvailable);
  const Icon = healthy
    ? CheckCircle2
    : incomplete
      ? AlertTriangle
      : PauseCircle;
  const title = healthy
    ? "Website inquiry intake is configured"
    : incomplete
      ? "Inquiry intake needs attention"
      : "Website inquiry collection is disabled";
  const description = healthy
    ? "The public switch and write configuration are present, and this signed-in administrator can query the protected inquiry table. Live submission is verified separately."
    : incomplete
      ? "The public switch is on, but storage or authenticated reporting is not ready. Disable collection if a live submission cannot be stored and reviewed."
      : "The public form and storage endpoint should remain unavailable. Existing protected records and retention duties continue independently.";

  return (
    <section
      aria-labelledby="inquiry-operational-status-heading"
      className={`mt-6 rounded-card border p-5 sm:p-6 ${
        incomplete
          ? "border-warning/40 bg-warning/5"
          : healthy
            ? "border-success/35 bg-success/5"
            : "border-border bg-surface-muted/55"
      }`}
    >
      <div className="flex gap-3">
        <Icon aria-hidden className="mt-0.5 shrink-0 text-secondary" size={22} />
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Operational status
          </p>
          <h2
            className="mt-2 text-xl font-semibold"
            id="inquiry-operational-status-heading"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/70">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <StatusCard
          description="Evaluated from the exact server-only feature switch."
          label="Public intake"
          value={status.collectionEnabled ? "Enabled" : "Disabled"}
        />
        <StatusCard
          description="Checks only whether required server write configuration is present; no value is displayed."
          label="Write storage"
          value={status.storageConfigured ? "Configured" : "Unconfigured"}
        />
        <StatusCard
          description="Uses this signed-in administrator request and remains subject to Row Level Security."
          label="Protected reporting"
          value={status.reportingAvailable ? "Available" : "Unavailable"}
        />
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface p-4">
        <div className="flex gap-3">
          <Inbox aria-hidden className="mt-0.5 shrink-0 text-secondary" size={19} />
          <div className="text-sm leading-6 text-foreground/70">
            <p>
              <strong className="text-foreground">Newest stored inquiry:</strong>{" "}
              {status.lastInquiryAt ? (
                <time dateTime={status.lastInquiryAt}>
                  {formatManilaTimestamp(status.lastInquiryAt)}
                </time>
              ) : status.reportingAvailable ? (
                "No record found"
              ) : (
                "Unavailable while protected reporting cannot be queried"
              )}
            </p>
            <p className="mt-2">
              Check this inbox daily while intake is enabled. No email, SMS,
              automatic reply, or booking confirmation is sent by this website.
            </p>
            <p className="mt-2">
              Active-table records expire after 365 days. For an earlier privacy
              request, confirm the requester through the same email or phone/messaging
              channel already stored on that exact inquiry. Never reveal whether a
              different person&apos;s inquiry exists. After verification, delete only
              that exact record and separately remove any downloaded CSV or external
              copy you control that is covered by the request.
            </p>
            <p className="mt-2 text-xs text-foreground/55">
              Status refreshed {formatManilaTimestamp(status.refreshedAt)}
              {" "}(Asia/Manila).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
