"use client";

import { Button } from "@/components/ui/Button";

export default function InquiryError({ reset }: { reset: () => void }) {
  return (
    <section className="rounded-card border border-danger/35 bg-surface p-7 text-center shadow-soft" role="alert">
      <p className="text-xs font-semibold tracking-[0.18em] text-danger uppercase">Inquiry area unavailable</p>
      <h1 className="mt-3 text-3xl font-semibold">We could not load the inquiries.</h1>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-foreground/70">
        Try again. No guest, account, database, or technical error details are displayed.
      </p>
      <Button className="mt-7" onClick={reset}>Try again</Button>
    </section>
  );
}

