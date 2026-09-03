import type { Metadata } from "next";
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteInquiry,
  updateInquiryStatus,
} from "@/app/admin/(protected)/inquiries/actions";
import { InquiryDeleteSubmitButton } from "@/components/admin/InquiryDeleteSubmitButton";
import { InquiryOperationalStatus } from "@/components/admin/InquiryOperationalStatus";
import { InquiryStatusSubmitButton } from "@/components/admin/InquiryStatusSubmitButton";
import {
  formatInquiryDates,
  formatManilaTimestamp,
} from "@/lib/dashboard/aggregation";
import {
  getAdminInquiries,
} from "@/lib/inquiries/admin";
import { isContactInquiryVisible } from "@/lib/config/features";
import {
  resolveInquiryListFilters,
  type InquiryStatusFilter,
} from "@/lib/inquiries/filters";
import { getInquiryOperationalStatus } from "@/lib/inquiries/status";
import { inquiryStatuses } from "@/types/inquiries";

export function generateMetadata(): Metadata {
  if (!isContactInquiryVisible()) {
    return { title: "Administrator" };
  }

  return {
    description:
      "Protected Villa Vessela inquiry review, status, and exact-record deletion.",
    title: "Inquiries",
  };
}

type InquiryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions: { label: string; value: InquiryStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
  { label: "Spam", value: "spam" },
];

const notices = {
  deleted: {
    kind: "success",
    message: "The exact inquiry was deleted from the active database.",
  },
  "delete-failed": {
    kind: "error",
    message: "The inquiry could not be deleted. Nothing is reported as removed; please try again.",
  },
  "delete-invalid": {
    kind: "error",
    message: "That deletion request was not valid or was not confirmed.",
  },
  failed: {
    kind: "error",
    message: "The inquiry status could not be updated. Please try again.",
  },
  invalid: {
    kind: "error",
    message: "That status update was not valid.",
  },
  updated: {
    kind: "success",
    message: "Inquiry status updated.",
  },
} as const;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function filterHref(status: InquiryStatusFilter, page = 1) {
  const query = new URLSearchParams({ page: String(page), status });
  return `/admin/inquiries?${query.toString()}`;
}

function readableStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  if (!isContactInquiryVisible()) {
    notFound();
  }

  const parameters = await searchParams;
  const filterResult = resolveInquiryListFilters(parameters);
  const notice = notices[firstValue(parameters.notice) as keyof typeof notices];
  const operationalStatus = await getInquiryOperationalStatus();

  return (
    <section aria-labelledby="inquiries-heading">
      <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <Inbox aria-hidden="true" size={25} strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
          Protected guest information
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" id="inquiries-heading">
          Website inquiries
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-foreground/70">
          Review voluntary guest details and update workflow status. Treat every record as private; booking and availability remain unconfirmed until the host replies.
        </p>
      </div>

      <InquiryOperationalStatus status={operationalStatus} />

      {notice ? (
        <p
          className={`mt-6 rounded-xl border p-4 text-sm ${
            notice.kind === "success"
              ? "border-success/30 bg-success/5 text-success"
              : "border-danger/30 bg-danger/5 text-danger"
          }`}
          role={notice.kind === "success" ? "status" : "alert"}
        >
          {notice.message}
        </p>
      ) : null}

      {!filterResult.success ? (
        <div className="mt-6 rounded-card border border-danger/35 bg-danger/5 p-6" role="alert">
          <h2 className="font-semibold">That inquiry filter is not valid</h2>
          <p className="mt-2 text-sm text-foreground/70">{filterResult.message}</p>
          <Link className="mt-4 inline-flex font-semibold text-primary underline" href={filterHref("all")}>
            Return to all inquiries
          </Link>
        </div>
      ) : (
        <InquiryResults filters={filterResult.filters} />
      )}
    </section>
  );
}

async function InquiryResults({
  filters,
}: {
  filters: Extract<
    ReturnType<typeof resolveInquiryListFilters>,
    { success: true }
  >["filters"];
}) {
  const result = await getAdminInquiries(filters);

  if (result.status === "unavailable") {
    return (
      <div className="mt-6 rounded-card border border-warning/35 bg-warning/5 p-6" role="alert">
        <div className="flex gap-3">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-warning" size={21} />
          <div>
            <h2 className="font-semibold">Inquiry data is temporarily unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              No database or account details are displayed. Try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { inquiries, page, total, totalPages } = result.data;

  return (
    <>
      <section aria-labelledby="inquiry-filter-heading" className="mt-6 rounded-card border border-border bg-surface p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold" id="inquiry-filter-heading">Filter by status</h2>
            <p className="mt-1 text-sm text-foreground/60">{total} matching inquiries</p>
          </div>
          <p className="text-sm text-foreground/60">Page {page} of {totalPages}</p>
        </div>
        <nav aria-label="Inquiry status filters" className="mt-4 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Link
              aria-current={filters.status === option.value ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold ${
                filters.status === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-border text-primary hover:bg-surface-muted"
              }`}
              href={filterHref(option.value)}
              key={option.value}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </section>

      <section aria-labelledby="inquiry-list-heading" className="mt-7">
        <h2 className="text-2xl font-semibold" id="inquiry-list-heading">Inquiry records</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          Up to 20 records are displayed per page. Exact contact values appear only in this protected view and approved exports.
        </p>

        {inquiries.length === 0 ? (
          <div className="mt-4 rounded-card border border-dashed border-border bg-surface p-8 text-center" role="status">
            <h3 className="font-semibold">No inquiries found</h3>
            <p className="mt-2 text-sm text-foreground/65">No records match this status and page.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5">
            {inquiries.map((inquiry) => {
              const updateAction = updateInquiryStatus.bind(null, inquiry.id);
              const deleteAction = deleteInquiry.bind(null, inquiry.id);

              return (
                <article className="rounded-card border border-border bg-surface p-5 shadow-soft sm:p-6" key={inquiry.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-secondary uppercase">
                        {formatManilaTimestamp(inquiry.created_at)}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{inquiry.name}</h3>
                    </div>
                    <form action={updateAction} className="flex flex-wrap items-end gap-3">
                      <label className="grid gap-1.5 text-xs font-semibold">
                        Status
                        <select
                          className="min-h-10 rounded-xl border border-border bg-surface px-3 text-sm"
                          defaultValue={inquiry.status}
                          name="status"
                        >
                          {inquiryStatuses.map((status) => (
                            <option key={status} value={status}>{readableStatus(status)}</option>
                          ))}
                        </select>
                      </label>
                      <InquiryStatusSubmitButton />
                    </form>
                  </div>

                  <dl className="mt-5 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <dt className="font-semibold">Email</dt>
                      <dd className="mt-1 break-all text-foreground/70">{inquiry.email ?? "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Phone or messaging</dt>
                      <dd className="mt-1 break-all text-foreground/70">{inquiry.phone ?? "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Preferred dates</dt>
                      <dd className="mt-1 text-foreground/70">{formatInquiryDates(inquiry.preferred_check_in, inquiry.preferred_check_out)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Guests</dt>
                      <dd className="mt-1 text-foreground/70">{inquiry.number_of_guests ?? "Not provided"}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 rounded-xl bg-surface-muted p-4">
                    <h4 className="text-sm font-semibold">Message</h4>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/75">
                      {inquiry.message}
                    </p>
                  </div>

                  <details className="mt-5 rounded-xl border border-danger/25 bg-danger/5 p-4">
                    <summary className="cursor-pointer font-semibold text-danger">
                      Delete this inquiry
                    </summary>
                    <div className="mt-3 max-w-3xl text-sm leading-6 text-foreground/70">
                      <p>
                        This permanently removes only this exact record from the
                        active inquiry table and cannot be undone here. It does
                        not automatically erase provider backups, browser copies,
                        downloaded CSV files, or details copied into another
                        approved contact channel.
                      </p>
                      <form action={deleteAction} className="mt-4">
                        <InquiryDeleteSubmitButton />
                      </form>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <nav aria-label="Inquiry pagination" className="mt-7 flex items-center justify-between gap-4">
        {page > 1 ? (
          <Link className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-primary" href={filterHref(filters.status, page - 1)}>
            <ChevronLeft aria-hidden="true" size={16} />
            Previous
          </Link>
        ) : <span />}
        {page < totalPages ? (
          <Link className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-primary" href={filterHref(filters.status, page + 1)}>
            Next
            <ChevronRight aria-hidden="true" size={16} />
          </Link>
        ) : null}
      </nav>
    </>
  );
}
