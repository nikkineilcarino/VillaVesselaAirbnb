"use client";

import { Send } from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/Button";
import { getManilaCalendarDate } from "@/lib/dashboard/dateRange";
import { getInquiryClientId } from "@/lib/inquiries/client";
import type {
  InquiryFieldErrors,
  InquiryFieldName,
  InquirySubmissionPayload,
} from "@/types/inquiries";

type SubmissionState =
  | { kind: "error"; message: string }
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success"; message: string };

function ErrorText({
  errors,
  field,
}: {
  errors: InquiryFieldErrors;
  field: InquiryFieldName;
}) {
  const message = errors[field];
  return message ? (
    <span className="text-xs font-medium text-danger" id={`inquiry-${field}-error`}>
      {message}
    </span>
  ) : null;
}

function fieldAttributes(errors: InquiryFieldErrors, field: InquiryFieldName) {
  return {
    "aria-describedby": errors[field] ? `inquiry-${field}-error` : undefined,
    "aria-invalid": errors[field] ? (true as const) : undefined,
  };
}

export function EnabledContactInquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef(0);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [state, setState] = useState<SubmissionState>({ kind: "idle" });
  const [today] = useState(() => getManilaCalendarDate());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setState({ kind: "pending" });

    const clientId = getInquiryClientId();
    if (!clientId || startedAtRef.current === 0) {
      setState({
        kind: "error",
        message: "Please refresh the page and try again.",
      });
      return;
    }

    const form = event.currentTarget;
    const values = new FormData(form);
    const guestValue = String(values.get("numberOfGuests") ?? "").trim();
    const checkIn = String(values.get("checkIn") ?? "").trim();
    const checkOut = String(values.get("checkOut") ?? "").trim();
    const payload: InquirySubmissionPayload = {
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      clientId,
      consent: values.get("consent") === "on",
      email: String(values.get("email") ?? ""),
      formStartedAt: startedAtRef.current,
      message: String(values.get("message") ?? ""),
      name: String(values.get("name") ?? ""),
      numberOfGuests: guestValue ? Number(guestValue) : null,
      phone: String(values.get("phone") ?? ""),
      website: String(values.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(payload),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body = (await response.json().catch(() => null)) as
        | { errors?: InquiryFieldErrors; status?: string }
        | null;

      if (response.status === 201 || response.status === 202) {
        form.reset();
        startedAtRef.current = Date.now();
        setState({
          kind: "success",
          message:
            "Your inquiry was received. The host can review it, but availability is not confirmed until the host replies.",
        });
        return;
      }

      if (response.status === 400 && body?.errors) {
        setErrors(body.errors);
        setState({
          kind: "error",
          message: "Please correct the highlighted fields and try again.",
        });
        return;
      }

      if (response.status === 429) {
        setState({
          kind: "error",
          message: "Too many attempts were made. Please wait before trying again.",
        });
        return;
      }

      if (response.status === 404) {
        setState({
          kind: "error",
          message: "Website inquiries are not currently accepting submissions.",
        });
        return;
      }

      setState({
        kind: "error",
        message:
          "Your inquiry could not be stored. Your entries remain in the form so you can try again or use an approved contact channel.",
      });
    } catch {
      setState({
        kind: "error",
        message:
          "The inquiry service could not be reached. Your entries remain in the form so you can try again.",
      });
    }
  }

  const pending = state.kind === "pending";

  return (
    <form
      aria-describedby="inquiry-purpose inquiry-payment-warning"
      aria-labelledby="inquiry-shell"
      className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-8"
      noValidate
      onSubmit={submitInquiry}
      ref={formRef}
    >
      <div className="flex gap-4 rounded-card border border-secondary/25 bg-secondary/5 p-5">
        <Send aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={24} />
        <div>
          <h2 className="text-xl font-semibold">Send a website inquiry</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/75" id="inquiry-purpose">
            These details are used only to review and respond to your property inquiry. Submission does not confirm availability or a booking.
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input
            autoComplete="off"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </label>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Full name
          <input
            {...fieldAttributes(errors, "name")}
            autoComplete="name"
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            maxLength={100}
            name="name"
            required
            type="text"
          />
          <ErrorText errors={errors} field="name" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input
            {...fieldAttributes(errors, "email")}
            autoComplete="email"
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            maxLength={254}
            name="email"
            type="email"
          />
          <ErrorText errors={errors} field="email" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Phone or messaging number
          <input
            {...fieldAttributes(errors, "phone")}
            autoComplete="tel"
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            inputMode="tel"
            maxLength={30}
            name="phone"
            type="tel"
          />
          <ErrorText errors={errors} field="phone" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Number of guests
          <input
            {...fieldAttributes(errors, "numberOfGuests")}
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            inputMode="numeric"
            max="20"
            min="1"
            name="numberOfGuests"
            type="number"
          />
          <ErrorText errors={errors} field="numberOfGuests" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Preferred check-in
          <input
            {...fieldAttributes(errors, "checkIn")}
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            min={today}
            name="checkIn"
            type="date"
          />
          <ErrorText errors={errors} field="checkIn" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Preferred checkout
          <input
            {...fieldAttributes(errors, "checkOut")}
            className="min-h-12 rounded-xl border border-border bg-surface px-4"
            min={today}
            name="checkOut"
            type="date"
          />
          <ErrorText errors={errors} field="checkOut" />
        </label>
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
          Message
          <textarea
            {...fieldAttributes(errors, "message")}
            className="min-h-36 rounded-xl border border-border bg-surface p-4"
            maxLength={2000}
            name="message"
            required
          />
          <span className="text-xs font-normal leading-5 text-foreground/70">
            Include your questions or plans, but no payment-card information.
          </span>
          <ErrorText errors={errors} field="message" />
        </label>
        <label className="flex gap-3 text-sm leading-6 text-foreground/75 sm:col-span-2">
          <input
            {...fieldAttributes(errors, "consent")}
            className="mt-1 size-4 shrink-0"
            name="consent"
            required
            type="checkbox"
          />
          <span>
            I consent to Villa Vessela storing these details and using them to respond to this inquiry.
            <ErrorText errors={errors} field="consent" />
          </span>
        </label>
      </div>

      {errors.form ? (
        <p className="mt-5 text-sm font-medium text-danger" id="inquiry-form-error">
          {errors.form}
        </p>
      ) : null}

      {state.kind === "error" ? (
        <p className="mt-5 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm leading-6 text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.kind === "success" ? (
        <p className="mt-5 rounded-xl border border-success/30 bg-success/5 p-4 text-sm leading-6 text-success" role="status">
          {state.message}
        </p>
      ) : null}

      <Button className="mt-7 gap-2" disabled={pending} size="large" type="submit">
        <Send aria-hidden="true" size={18} />
        {pending ? "Sending inquiry…" : "Send inquiry"}
      </Button>
      <p className="mt-5 text-xs leading-5 text-foreground/70" id="inquiry-payment-warning">
        Never send payment-card details through this form. Airbnb bookings and payments should remain on Airbnb.
      </p>
    </form>
  );
}
