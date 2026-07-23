import { z } from "zod";

import {
  addCalendarDays,
  getManilaCalendarDate,
} from "@/lib/dashboard/dateRange";
import type {
  InquiryFieldErrors,
  InquiryFieldName,
  ValidatedInquiry,
} from "@/types/inquiries";
import { inquiryFieldNames } from "@/types/inquiries";

const MINIMUM_FILL_TIME_MS = 2_000;
const MAXIMUM_FILL_TIME_MS = 86_400_000;
const MAXIMUM_ADVANCE_DAYS = 730;

const validCalendarDate = /^\d{4}-\d{2}-\d{2}$/;
const phoneCharacters = /^[0-9+().\-\s]+$/;

export function sanitizeSingleLine(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMessage(value: string) {
  return value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isRealCalendarDate(value: string) {
  if (!validCalendarDate.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function luhnValid(value: string) {
  let sum = 0;
  let double = false;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);

    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

export function containsPaymentCardNumber(value: string) {
  const candidates = value.match(/(?:\d[ -]?){13,19}/g) ?? [];

  return candidates.some((candidate) => {
    const digits = candidate.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19 && luhnValid(digits);
  });
}

const inquirySchema = z
  .strictObject({
    checkIn: z.union([z.string().max(10), z.null()]),
    checkOut: z.union([z.string().max(10), z.null()]),
    clientId: z.uuid({ message: "Please refresh the page and try again." }),
    consent: z.literal(true, {
      error: "Consent is required so the host may respond.",
    }),
    email: z
      .string()
      .max(254, "Email must be 254 characters or fewer.")
      .transform((value) => sanitizeSingleLine(value).toLowerCase())
      .refine(
        (value) => value === "" || z.email().safeParse(value).success,
        "Enter a valid email address.",
      ),
    formStartedAt: z
      .number()
      .int()
      .positive("Please refresh the page and try again."),
    message: z
      .string()
      .max(2_000, "Message must be 2,000 characters or fewer.")
      .transform(sanitizeMessage)
      .pipe(
        z
          .string()
          .min(10, "Please include at least 10 characters in your message.")
          .max(2_000, "Message must be 2,000 characters or fewer."),
      ),
    name: z
      .string()
      .max(100, "Name must be 100 characters or fewer.")
      .transform(sanitizeSingleLine)
      .pipe(
        z
          .string()
          .min(2, "Enter your full name.")
          .max(100, "Name must be 100 characters or fewer."),
      ),
    numberOfGuests: z.union([
      z
        .number()
        .int("Guest count must be a whole number.")
        .min(1, "Guest count must be at least 1.")
        .max(20, "Guest count must be 20 or fewer."),
      z.null(),
    ]),
    phone: z
      .string()
      .max(30, "Phone or messaging number must be 30 characters or fewer.")
      .transform(sanitizeSingleLine)
      .refine(
        (value) =>
          value === "" ||
          (value.length >= 7 && phoneCharacters.test(value)),
        "Enter a valid phone or messaging number.",
      ),
    website: z.string().max(200),
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone) {
      context.addIssue({
        code: "custom",
        message: "Provide an email or phone/messaging number.",
        path: ["email"],
      });
      context.addIssue({
        code: "custom",
        message: "Provide an email or phone/messaging number.",
        path: ["phone"],
      });
    }

    const hasCheckIn = Boolean(value.checkIn);
    const hasCheckOut = Boolean(value.checkOut);

    if (hasCheckIn !== hasCheckOut) {
      context.addIssue({
        code: "custom",
        message: "Provide both preferred dates or leave both blank.",
        path: [hasCheckIn ? "checkOut" : "checkIn"],
      });
    }

    if (value.checkIn && !isRealCalendarDate(value.checkIn)) {
      context.addIssue({
        code: "custom",
        message: "Enter a valid check-in date.",
        path: ["checkIn"],
      });
    }

    if (value.checkOut && !isRealCalendarDate(value.checkOut)) {
      context.addIssue({
        code: "custom",
        message: "Enter a valid checkout date.",
        path: ["checkOut"],
      });
    }

    if (
      value.checkIn &&
      value.checkOut &&
      isRealCalendarDate(value.checkIn) &&
      isRealCalendarDate(value.checkOut) &&
      value.checkOut <= value.checkIn
    ) {
      context.addIssue({
        code: "custom",
        message: "Checkout must be later than check-in.",
        path: ["checkOut"],
      });
    }

    if (containsPaymentCardNumber(value.message)) {
      context.addIssue({
        code: "custom",
        message: "Remove payment-card numbers from the message.",
        path: ["message"],
      });
    }
  });

function collectFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const fieldErrors: InquiryFieldErrors = {};

  for (const issue of error.issues) {
    const candidate = String(issue.path[0] ?? "form");
    const field = inquiryFieldNames.includes(candidate as InquiryFieldName)
      ? (candidate as InquiryFieldName)
      : "form";

    fieldErrors[field] ??= issue.message;
  }

  return fieldErrors;
}

export type InquiryParseResult =
  | {
      clientId: string;
      data: ValidatedInquiry;
      status: "valid";
    }
  | { errors: InquiryFieldErrors; status: "invalid" }
  | { status: "spam" };

export function parseInquirySubmission(
  input: unknown,
  now = new Date(),
): InquiryParseResult {
  const honeypot = z
    .object({ website: z.string().max(200) })
    .safeParse(input);

  if (
    honeypot.success &&
    sanitizeSingleLine(honeypot.data.website).length > 0
  ) {
    return { status: "spam" };
  }

  const result = inquirySchema.safeParse(input);

  if (!result.success) {
    return { errors: collectFieldErrors(result.error), status: "invalid" };
  }

  const elapsed = now.getTime() - result.data.formStartedAt;
  if (elapsed < MINIMUM_FILL_TIME_MS || elapsed > MAXIMUM_FILL_TIME_MS) {
    return {
      errors: { form: "Please refresh the page and complete the form again." },
      status: "invalid",
    };
  }

  const today = getManilaCalendarDate(now);
  const latestCheckIn = addCalendarDays(today, MAXIMUM_ADVANCE_DAYS);

  if (result.data.checkIn && result.data.checkIn < today) {
    return {
      errors: { checkIn: "Preferred check-in cannot be in the past." },
      status: "invalid",
    };
  }

  if (result.data.checkIn && result.data.checkIn > latestCheckIn) {
    return {
      errors: { checkIn: "Preferred check-in must be within the next two years." },
      status: "invalid",
    };
  }

  return {
    clientId: result.data.clientId,
    data: {
      consent: true,
      email: result.data.email || null,
      message: result.data.message,
      name: result.data.name,
      numberOfGuests: result.data.numberOfGuests,
      phone: result.data.phone || null,
      preferredCheckIn: result.data.checkIn,
      preferredCheckOut: result.data.checkOut,
    },
    status: "valid",
  };
}

export const inquiryValidationConstants = {
  maximumAdvanceDays: MAXIMUM_ADVANCE_DAYS,
  maximumFillTimeMs: MAXIMUM_FILL_TIME_MS,
  minimumFillTimeMs: MINIMUM_FILL_TIME_MS,
} as const;

