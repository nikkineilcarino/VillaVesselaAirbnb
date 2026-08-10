"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { formatManilaTimestamp } from "@/lib/dashboard/aggregation";

export function DashboardRefreshControl({ refreshedAt }: { refreshedAt: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function refreshDashboard() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-foreground/65">
        Last refreshed: {" "}
        <time dateTime={refreshedAt}>{formatManilaTimestamp(refreshedAt)}</time>{" "}
        (Asia/Manila)
      </p>
      <button
        className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-border bg-surface px-4 text-sm font-semibold text-primary hover:bg-surface-muted disabled:cursor-wait disabled:opacity-65 sm:self-auto"
        disabled={isPending}
        onClick={refreshDashboard}
        type="button"
      >
        <RefreshCw
          aria-hidden="true"
          className={isPending ? "animate-spin" : undefined}
          size={16}
        />
        {isPending ? "Refreshing..." : "Refresh dashboard"}
      </button>
    </div>
  );
}
