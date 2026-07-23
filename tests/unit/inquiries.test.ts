import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { handleInquiryRequest } from "@/lib/inquiries/handler";
import {
  resolveInquiryListFilters,
} from "@/lib/inquiries/filters";
import type { ValidatedInquiry } from "@/types/inquiries";
import {
  containsPaymentCardNumber,
  parseInquirySubmission,
  sanitizeMessage,
  sanitizeSingleLine,
} from "@/lib/validation/inquiry";

const now = new Date("2026-07-23T08:00:00.000Z");

function validPayload() {
  return {
    checkIn: "2026-07-30",
    checkOut: "2026-08-02",
    clientId: "11111111-1111-4111-8111-111111111111",
    consent: true,
    email: "guest@example.invalid",
    formStartedAt: now.getTime() - 5_000,
    message: "Please tell me whether these preferred dates are available.",
    name: "Sample Guest",
    numberOfGuests: 4,
    phone: "",
    website: "",
  };
}

function inquiryRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://villa.example/api/contact", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Origin: "https://villa.example",
      ...headers,
    },
    method: "POST",
  });
}

describe("inquiry validation and sanitization", () => {
  it("sanitizes valid voluntary details and keeps optional values explicit", () => {
    const result = parseInquirySubmission(
      {
        ...validPayload(),
        email: "  GUEST@EXAMPLE.INVALID ",
        message: "  Please   confirm.\r\n\r\n\r\nThank you.  ",
        name: "  Sample\u0000   Guest  ",
      },
      now,
    );

    expect(result).toEqual({
      clientId: "11111111-1111-4111-8111-111111111111",
      data: {
        consent: true,
        email: "guest@example.invalid",
        message: "Please confirm.\n\nThank you.",
        name: "Sample Guest",
        numberOfGuests: 4,
        phone: null,
        preferredCheckIn: "2026-07-30",
        preferredCheckOut: "2026-08-02",
      },
      status: "valid",
    });
    expect(sanitizeSingleLine(" A\t B ")).toBe("A B");
    expect(sanitizeMessage("A\r\nB")).toBe("A\nB");
  });

  it("requires one contact method, consent, a bounded guest count, and strict fields", () => {
    const cases = [
      { ...validPayload(), email: "", phone: "" },
      { ...validPayload(), consent: false },
      { ...validPayload(), numberOfGuests: 21 },
      { ...validPayload(), unexpected: "field" },
    ];

    for (const payload of cases) {
      expect(parseInquirySubmission(payload, now).status).toBe("invalid");
    }
  });

  it("requires preferred dates as a valid ordered pair in the supported window", () => {
    const cases = [
      { ...validPayload(), checkOut: null },
      { ...validPayload(), checkIn: "2026-02-30" },
      { ...validPayload(), checkIn: "2026-07-20", checkOut: "2026-07-24" },
      { ...validPayload(), checkIn: "2026-08-02", checkOut: "2026-08-01" },
      { ...validPayload(), checkIn: "2028-08-01", checkOut: "2028-08-03" },
    ];

    for (const payload of cases) {
      expect(parseInquirySubmission(payload, now).status).toBe("invalid");
    }

    expect(
      parseInquirySubmission(
        { ...validPayload(), checkIn: null, checkOut: null },
        now,
      ).status,
    ).toBe("valid");
  });

  it("rejects realistic payment-card patterns and invalid form timing", () => {
    const paymentPattern = "4111 1111 1111 1111";
    expect(containsPaymentCardNumber(paymentPattern)).toBe(true);
    expect(
      parseInquirySubmission(
        { ...validPayload(), message: `Please charge ${paymentPattern} for the booking.` },
        now,
      ).status,
    ).toBe("invalid");
    expect(
      parseInquirySubmission(
        { ...validPayload(), formStartedAt: now.getTime() - 500 },
        now,
      ).status,
    ).toBe("invalid");
    expect(
      parseInquirySubmission(
        { ...validPayload(), formStartedAt: now.getTime() - 90_000_000 },
        now,
      ).status,
    ).toBe("invalid");
  });

  it("treats a filled honeypot as a silent decoy without requiring other fields", () => {
    expect(parseInquirySubmission({ website: "bot.example" }, now)).toEqual({
      status: "spam",
    });
  });
});

describe("inquiry request handler", () => {
  function dependencies(overrides: Partial<Parameters<typeof handleInquiryRequest>[1]> = {}) {
    return {
      allowRequest: () => true,
      allowSubmission: () => true,
      enabled: true,
      now,
      store: vi.fn(async () => true),
      ...overrides,
    };
  }

  it("is genuinely unavailable when disabled", async () => {
    const response = await handleInquiryRequest(
      inquiryRequest(validPayload()),
      dependencies({ enabled: false }),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects cross-origin, unsupported, oversized, malformed, and invalid requests", async () => {
    const crossOrigin = await handleInquiryRequest(
      inquiryRequest(validPayload(), { Origin: "https://evil.example" }),
      dependencies(),
    );
    expect(crossOrigin.status).toBe(403);

    const unsupported = await handleInquiryRequest(
      new Request("https://villa.example/api/contact", {
        body: "{}",
        headers: { "Content-Type": "text/plain" },
        method: "POST",
      }),
      dependencies(),
    );
    expect(unsupported.status).toBe(415);

    const oversized = await handleInquiryRequest(
      inquiryRequest({}, { "Content-Length": "9000" }),
      dependencies(),
    );
    expect(oversized.status).toBe(413);

    const malformed = await handleInquiryRequest(
      new Request("https://villa.example/api/contact", {
        body: "{",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
      dependencies(),
    );
    expect(malformed.status).toBe(400);

    const invalid = await handleInquiryRequest(
      inquiryRequest({ ...validPayload(), email: "", phone: "" }),
      dependencies(),
    );
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toMatchObject({
      errors: { email: expect.any(String), phone: expect.any(String) },
      status: "invalid",
    });
  });

  it("applies global/client rate limits before storage", async () => {
    expect(
      (
        await handleInquiryRequest(
          inquiryRequest(validPayload()),
          dependencies({ allowRequest: () => false }),
        )
      ).status,
    ).toBe(429);
    expect(
      (
        await handleInquiryRequest(
          inquiryRequest(validPayload()),
          dependencies({ allowSubmission: () => false }),
        )
      ).status,
    ).toBe(429);
  });

  it("stores only validated data and returns real storage outcomes", async () => {
    const store = vi.fn(async (inquiry: ValidatedInquiry) => Boolean(inquiry));
    const success = await handleInquiryRequest(
      inquiryRequest(validPayload()),
      dependencies({ store }),
    );
    expect(success.status).toBe(201);
    expect(store).toHaveBeenCalledWith(
      expect.objectContaining({
        consent: true,
        email: "guest@example.invalid",
        name: "Sample Guest",
      }),
    );
    expect(store.mock.calls[0]?.[0]).not.toHaveProperty("clientId");

    const unavailable = await handleInquiryRequest(
      inquiryRequest(validPayload()),
      dependencies({ store: async () => false }),
    );
    expect(unavailable.status).toBe(503);
  });

  it("returns a decoy success for honeypot traffic without storage", async () => {
    const store = vi.fn(async () => true);
    const response = await handleInquiryRequest(
      inquiryRequest({ website: "filled.example" }),
      dependencies({ store }),
    );

    expect(response.status).toBe(202);
    expect(store).not.toHaveBeenCalled();
  });
});

describe("administrator inquiry boundaries", () => {
  it("validates status and pagination query values", () => {
    expect(resolveInquiryListFilters({})).toEqual({
      filters: { page: 1, status: "all" },
      success: true,
    });
    expect(resolveInquiryListFilters({ page: "25", status: "contacted" })).toEqual({
      filters: { page: 25, status: "contacted" },
      success: true,
    });

    for (const query of [
      { page: "0" },
      { page: "-1" },
      { page: "1.5" },
      { page: "10001" },
      { status: "deleted" },
    ]) {
      expect(resolveInquiryListFilters(query).success).toBe(false);
    }
  });

  it("keeps admin reads and updates RLS-bound while isolating the public service insert", () => {
    const root = process.cwd();
    const publicRoute = readFileSync(
      join(root, "src", "app", "api", "contact", "route.ts"),
      "utf8",
    );
    const adminQuery = readFileSync(
      join(root, "src", "lib", "inquiries", "admin.ts"),
      "utf8",
    );
    const statusAction = readFileSync(
      join(root, "src", "app", "admin", "(protected)", "inquiries", "actions.ts"),
      "utf8",
    );

    expect(publicRoute).toContain("createServiceRoleSupabaseClient");
    expect(adminQuery).toContain("createServerSupabaseClient");
    expect(adminQuery).not.toContain("createServiceRoleSupabaseClient");
    expect(statusAction).toContain("requireAdmin");
    expect(statusAction).toContain(".update({ status: statusResult.data })");
    expect(statusAction).not.toMatch(/\.update\(\{[^}]+(?:name|email|phone|message)/s);
  });
});
