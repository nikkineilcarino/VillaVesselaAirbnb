import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function DisabledContactInquiryForm() {
  return (
    <form
      aria-describedby="inquiry-disabled-reason"
      aria-labelledby="inquiry-shell"
      className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-8"
    >
      <div className="flex gap-4 rounded-card border border-accent/35 bg-accent/10 p-5">
        <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-warning" size={24} />
        <div>
          <h2 className="text-xl font-semibold">Website inquiry form is not active</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/75" id="inquiry-disabled-reason">
            The owner has not enabled website inquiries. Approved booking and contact channels above remain available independently.
          </p>
        </div>
      </div>

      <fieldset className="mt-8" disabled>
        <legend className="text-2xl font-semibold">Inquiry details</legend>
        <p className="mt-2 text-sm leading-6 text-foreground/75">
          This preview cannot submit or store information while inquiries are disabled.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Full name
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" name="name" required type="text" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" name="email" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Phone or messaging number
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" name="phone" type="tel" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Number of guests
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" min="1" name="guests" type="number" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Preferred check-in
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" name="checkIn" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Preferred checkout
            <input className="min-h-12 rounded-xl border border-border bg-surface-muted px-4" name="checkOut" type="date" />
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Message
            <textarea className="min-h-32 rounded-xl border border-border bg-surface-muted p-4" name="message" required />
          </label>
          <label className="flex gap-3 text-sm leading-6 text-foreground/75 sm:col-span-2">
            <input className="mt-1 size-4 shrink-0" name="consent" required type="checkbox" />
            I consent to Villa Vessela using these details to respond to my inquiry.
          </label>
        </div>

        <Button className="mt-7" disabled size="large" type="submit">
          Inquiry submission unavailable
        </Button>
      </fieldset>
      <p className="mt-5 text-xs leading-5 text-foreground/75">
        Never send payment-card details through a property inquiry form.
      </p>
    </form>
  );
}

