import { Download } from "lucide-react";

import type { DashboardDateRange } from "@/types/dashboard";

const exports = [
  { label: "Page views", type: "page-views" },
  { label: "Link clicks", type: "link-clicks" },
  { label: "Inquiries", type: "inquiries" },
] as const;

export function DashboardExportLinks({ range }: { range: DashboardDateRange }) {
  return (
    <section aria-labelledby="dashboard-export-heading" className="mt-9 rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">Protected downloads</p>
      <h2 className="mt-2 text-2xl font-semibold" id="dashboard-export-heading">CSV exports</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/65">
        Exports use this dashboard period, Asia/Manila timestamps, human-readable columns, formula-safe cells, and a 10,000-row ceiling. Inquiry exports contain private guest details and must be stored securely.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {exports.map((item) => {
          const query = new URLSearchParams({
            end: range.endDate,
            start: range.startDate,
          });
          return (
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-primary hover:bg-surface-muted"
              download
              href={`/admin/exports/${item.type}?${query.toString()}`}
              key={item.type}
            >
              <Download aria-hidden="true" size={17} />
              Export {item.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}

