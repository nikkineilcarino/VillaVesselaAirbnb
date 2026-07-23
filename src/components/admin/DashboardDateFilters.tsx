import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type {
  DashboardDateRange,
  DashboardRangePreset,
} from "@/types/dashboard";

const presetLinks: { href: string; label: string; preset: DashboardRangePreset }[] = [
  { href: "/admin/dashboard?range=today", label: "Today", preset: "today" },
  { href: "/admin/dashboard?range=7d", label: "Last 7 days", preset: "7d" },
  { href: "/admin/dashboard?range=30d", label: "Last 30 days", preset: "30d" },
  { href: "/admin/dashboard?range=month", label: "Current month", preset: "month" },
];

type DashboardDateFiltersProps = {
  activePreset: DashboardRangePreset;
  range: DashboardDateRange;
};

export function DashboardDateFilters({
  activePreset,
  range,
}: DashboardDateFiltersProps) {
  return (
    <section
      aria-labelledby="dashboard-filter-heading"
      className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-lg font-semibold" id="dashboard-filter-heading">
            Reporting period
          </h2>
          <p className="mt-1 text-sm leading-6 text-foreground/65">
            Every card, chart, and table uses Asia/Manila calendar days.
          </p>
        </div>
        <p className="text-sm font-semibold text-primary">{range.label}</p>
      </div>

      <nav aria-label="Dashboard date presets" className="mt-5 flex flex-wrap gap-2">
        {presetLinks.map(({ href, label, preset }) => {
          const active = activePreset === preset;

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted",
              )}
              href={href}
              key={preset}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <form
        action="/admin/dashboard"
        className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        method="get"
      >
        <input name="range" type="hidden" value="custom" />
        <label className="grid gap-2 text-sm font-semibold">
          Start date
          <input
            className="min-h-11 rounded-xl border border-border bg-surface px-3 py-2 text-foreground"
            defaultValue={range.startDate}
            max={range.today}
            name="start"
            required
            type="date"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          End date
          <input
            className="min-h-11 rounded-xl border border-border bg-surface px-3 py-2 text-foreground"
            defaultValue={range.endDate}
            max={range.today}
            name="end"
            required
            type="date"
          />
        </label>
        <Button className="w-full sm:w-auto" type="submit" variant="secondary">
          Apply custom dates
        </Button>
      </form>
    </section>
  );
}

