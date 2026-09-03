import { isContactInquiryVisible } from "@/lib/config/features";

export default function InquiryLoading() {
  if (!isContactInquiryVisible()) {
    return null;
  }

  return (
    <section aria-busy="true" aria-live="polite">
      <div className="rounded-[1.75rem] border border-border bg-surface p-7 shadow-soft">
        <h1 className="text-3xl font-semibold">Loading inquiries</h1>
        <p className="mt-3 text-sm text-foreground/65">Retrieving protected inquiry records&hellip;</p>
      </div>
      <div aria-hidden="true" className="mt-6 grid gap-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="h-64 animate-pulse rounded-card border border-border bg-surface-muted" key={index} />
        ))}
      </div>
    </section>
  );
}
