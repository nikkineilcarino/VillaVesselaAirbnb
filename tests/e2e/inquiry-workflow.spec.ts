import { randomUUID } from "node:crypto";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const inquiryEnabled =
  process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
const inquiryVisible =
  inquiryEnabled ||
  process.env.CONTACT_INQUIRY_VISIBLE?.trim().toLowerCase() === "true";
const testOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
).origin;

// Inquiry tests exercise submitted form values and retry identifiers. Keep them
// out of retained Playwright artifacts even when a local or CI assertion fails.
test.use({ screenshot: "off", trace: "off", video: "off" });

function futureDate(days: number) {
  const date = new Date(Date.now() + days * 86_400_000);
  return date.toISOString().slice(0, 10);
}

test("unfinished inquiry surfaces remain hidden", async ({ page }) => {
  test.skip(inquiryVisible, "This check requires the unfinished feature to be hidden.");

  await page.goto("/contact");
  await expect(page.locator("main:not([aria-busy='true'])")).not.toContainText(
    /inquir/i,
  );
  await expect(page.getByRole("form")).toHaveCount(0);

  await page.goto("/privacy");
  await expect(page.locator("main:not([aria-busy='true'])")).not.toContainText(
    /inquir/i,
  );

  await page.goto("/admin/inquiries");
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect(await page.title()).not.toMatch(/inquir/i);
  await expect(page.locator("body")).not.toContainText(/inquir/i);
});

test("visible but disabled inquiry mode remains unavailable", async ({
  page,
}) => {
  test.skip(
    inquiryEnabled || !inquiryVisible,
    "This fallback check requires visible but disabled inquiries.",
  );

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/contact");

  await expect(
    page.getByRole("heading", { name: "Website inquiries are currently disabled" }),
  ).toBeVisible();
  await expect(page.getByRole("form").locator("fieldset")).toHaveAttribute(
    "disabled",
    "",
  );
  await expect(
    page.getByRole("button", { name: "Inquiry submission unavailable" }),
  ).toBeDisabled();
  await expect(page.getByRole("form")).toContainText(
    "Nothing entered in this disabled preview is submitted or stored.",
  );
  await expect(page.getByRole("form").getByRole("link", { name: "Privacy notice" }))
    .toHaveAttribute("href", "/privacy");
});

test("enabled inquiry form keeps one retry identity until an accepted response", async ({
  page,
}) => {
  test.skip(!inquiryEnabled, "This operational-form check requires inquiries to be enabled.");

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/contact");

  await expect(
    page.getByRole("heading", { name: "Ask the host about your stay" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Send a website inquiry" })).toBeVisible();
  await expect(
    page.locator('input[type="password"], input[autocomplete="cc-number"]'),
  ).toHaveCount(0);
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  let submission = 0;
  const submittedPayloads: Array<{
    clientId: string;
    privacyNoticeVersion: string;
    submissionId: string;
  }> = [];
  await page.route("**/api/contact", async (route) => {
    submission += 1;
    submittedPayloads.push(
      route.request().postDataJSON() as {
        clientId: string;
        privacyNoticeVersion: string;
        submissionId: string;
      },
    );
    if (submission === 1) {
      await route.fulfill({
        body: JSON.stringify({
          errors: {
            consent: "Consent is required so the host may respond.",
            email: "Provide an email or phone/messaging number.",
            phone: "Provide an email or phone/messaging number.",
          },
          status: "invalid",
        }),
        contentType: "application/json",
        status: 400,
      });
      return;
    }

    if (submission === 2) {
      await route.fulfill({
        body: JSON.stringify({ status: "received" }),
        contentType: "application/json",
        status: 201,
      });
      return;
    }

    if (submission === 3) {
      await route.fulfill({
        body: JSON.stringify({ status: "unavailable" }),
        contentType: "application/json",
        status: 503,
      });
      return;
    }

    if (submission === 4) {
      await route.fulfill({
        body: JSON.stringify({ status: "received" }),
        contentType: "application/json",
        status: 200,
      });
      return;
    }

    await route.fulfill(
      submission === 5
        ? {
            body: JSON.stringify({ status: "conflict" }),
            contentType: "application/json",
            status: 409,
          }
        : {
            body: JSON.stringify({ status: "unexpected" }),
            contentType: "application/json",
            status: 200,
          },
    );
  });

  await page.getByLabel("Full name").fill("Sample Guest");
  await page
    .getByLabel("Message")
    .fill("Please tell me whether the villa is available.");
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.getByRole("form").getByRole("alert")).toContainText(
    "Please correct the highlighted fields",
  );
  const inquiryForm = page.getByRole("form");
  await expect(inquiryForm.locator('input[name="email"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(inquiryForm.locator('input[name="email"]')).toBeFocused();
  await expect(inquiryForm.locator('input[name="phone"]')).toHaveAttribute(
    "aria-invalid",
    "true",
  );

  await inquiryForm.locator('input[name="email"]').fill("guest@example.invalid");
  await page
    .getByLabel(/I consent to Villa Vessela storing/)
    .check();
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(page.getByRole("form").getByRole("status")).toContainText(
    "Your inquiry was received",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(inquiryForm.locator('input[name="email"]')).toHaveValue("");

  await page.getByLabel("Full name").fill("Retry Guest");
  await inquiryForm.locator('input[name="email"]').fill("retry@example.invalid");
  await page
    .getByLabel("Message")
    .fill("Please keep these entries if storage is unavailable.");
  await page.getByLabel(/I consent to Villa Vessela storing/).check();
  await page.getByRole("button", { name: "Send inquiry" }).click();

  await expect(inquiryForm.getByRole("alert")).toContainText(
    "Your inquiry could not be stored",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Retry Guest");
  await expect(inquiryForm.locator('input[name="email"]')).toHaveValue(
    "retry@example.invalid",
  );

  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("form").getByRole("status")).toContainText(
    "Your inquiry was received",
  );

  await page.getByLabel("Full name").fill("Conflict Guest");
  await inquiryForm.locator('input[name="email"]').fill("conflict@example.invalid");
  await page
    .getByLabel("Message")
    .fill("Please keep this conflicting retry visible in the form.");
  await page.getByLabel(/I consent to Villa Vessela storing/).check();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(inquiryForm.getByRole("alert")).toContainText(
    "may already have been stored with different details",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Conflict Guest");
  await expect(inquiryForm.locator('input[name="email"]')).toHaveValue(
    "conflict@example.invalid",
  );

  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(inquiryForm.getByRole("alert")).toContainText(
    "Your inquiry could not be stored",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Conflict Guest");

  expect(submittedPayloads).toHaveLength(6);
  const uuidV4Pattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  expect(
    submittedPayloads.every(({ submissionId }) =>
      uuidV4Pattern.test(submissionId),
    ),
  ).toBe(true);
  expect(
    submittedPayloads.every(
      ({ privacyNoticeVersion }) => privacyNoticeVersion === "2026-08-31",
    ),
  ).toBe(true);
  expect(submittedPayloads[0]?.submissionId).toBe(
    submittedPayloads[1]?.submissionId,
  );
  expect(submittedPayloads[2]?.submissionId).not.toBe(
    submittedPayloads[1]?.submissionId,
  );
  expect(submittedPayloads[2]?.submissionId).toBe(
    submittedPayloads[3]?.submissionId,
  );
  expect(submittedPayloads[4]?.submissionId).not.toBe(
    submittedPayloads[3]?.submissionId,
  );
  expect(submittedPayloads[5]?.submissionId).toBe(
    submittedPayloads[4]?.submissionId,
  );
  expect(submittedPayloads.every(({ clientId, submissionId }) => clientId !== submissionId))
    .toBe(true);
});

test("enabled inquiry form announces a stale privacy notice error once", async ({
  page,
}) => {
  test.skip(!inquiryEnabled, "This operational-form check requires inquiries to be enabled.");

  const staleNoticeMessage =
    "The privacy notice changed. Refresh the page before submitting.";
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        errors: { form: staleNoticeMessage },
        status: "invalid",
      }),
      contentType: "application/json",
      status: 400,
    });
  });
  await page.goto("/contact");

  const inquiryForm = page.getByRole("form");
  await page.getByLabel("Full name").fill("Stale Notice Guest");
  await page
    .getByLabel("Message")
    .fill("Please keep this inquiry visible after a stale notice response.");
  await page.getByRole("button", { name: "Send inquiry" }).click();

  const alert = inquiryForm.getByRole("alert");
  await expect(alert).toHaveText(staleNoticeMessage);
  await expect(alert).toBeFocused();
  await expect(inquiryForm).toHaveAttribute(
    "aria-describedby",
    /\binquiry-form-feedback\b/,
  );
  await expect(
    inquiryForm.getByText(staleNoticeMessage, { exact: true }),
  ).toHaveCount(1);
  await expect(page.getByLabel("Full name")).toHaveValue("Stale Notice Guest");
});

test("privacy inquiry disclosures match the server feature mode", async ({ page }) => {
  await page.goto("/privacy");

  if (!inquiryVisible) {
    await expect(page.locator("main:not([aria-busy='true'])")).not.toContainText(
      /inquir/i,
    );
    return;
  }

  if (inquiryEnabled) {
    await expect(page.getByText("Website inquiry collection is active.")).toBeVisible();
    await expect(page.getByText(/random submission identifier/)).toBeVisible();
    await expect(page.getByText(/sends no automatic reply/)).toBeVisible();
    await expect(page.getByText(/strictly older than 365 days/)).toBeVisible();
  } else {
    await expect(
      page.getByText(/Website inquiry collection is currently disabled/),
    ).toBeVisible();
    await expect(page.getByText(/creates no new inquiry record/)).toBeVisible();
  }

  await expect(page.getByText(/delete one exact inquiry/).first()).toBeVisible();
  await expect(page.getByText(/downloaded file is a separate copy/)).toBeVisible();
  await expect(page.getByText(/does not instantly remove provider backup copies/)).toBeVisible();
});

test("contact API rejects invalid data and never disguises unavailable storage", async ({
  page,
}) => {
  if (!inquiryEnabled) {
    const response = await page.request.post("/api/contact", {
      data: {},
      headers: { Origin: testOrigin },
    });
    expect(response.status()).toBe(404);
    expect(response.headers()["cache-control"]).toContain("no-store");
    return;
  }

  const rateLimitClientId = randomUUID();
  const rateLimitSubmissionId = randomUUID();
  const validPayload = {
    checkIn: futureDate(7),
    checkOut: futureDate(10),
    clientId: rateLimitClientId,
    consent: true,
    email: "guest@example.invalid",
    formStartedAt: Date.now() - 5_000,
    message: "Please tell me whether these preferred dates are available.",
    name: "Sample Guest",
    numberOfGuests: 4,
    phone: "",
    privacyNoticeVersion: "2026-08-31",
    submissionId: rateLimitSubmissionId,
    website: "",
  };

  const missingOrigin = await page.request.post("/api/contact", {
    data: validPayload,
  });
  expect(missingOrigin.status()).toBe(403);

  const crossOrigin = await page.request.post("/api/contact", {
    data: validPayload,
    headers: {
      Origin: "https://attacker.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });
  expect(crossOrigin.status()).toBe(403);

  const unsupportedMedia = await page.request.post("/api/contact", {
    data: "not-json",
    headers: {
      "Content-Type": "text/plain",
      Origin: testOrigin,
    },
  });
  expect(unsupportedMedia.status()).toBe(415);

  const malformedJson = await page.request.post("/api/contact", {
    data: "{",
    headers: {
      "Content-Type": "application/json",
      Origin: testOrigin,
    },
  });
  expect(malformedJson.status()).toBe(400);

  const oversized = await page.request.post("/api/contact", {
    data: { value: "x".repeat(8_193) },
    headers: { Origin: testOrigin },
  });
  expect(oversized.status()).toBe(413);

  const honeypot = await page.request.post("/api/contact", {
    data: {
      ...validPayload,
      clientId: "55555555-5555-4555-8555-555555555555",
      submissionId: "66666666-6666-4666-8666-666666666666",
      website: "filled.example",
    },
    headers: { Origin: testOrigin },
  });
  expect(honeypot.status()).toBe(202);
  expect(await honeypot.json()).toEqual({ status: "received" });

  const invalid = await page.request.post("/api/contact", {
    data: {
      checkIn: null,
      checkOut: null,
      clientId: "11111111-1111-4111-8111-111111111111",
      consent: false,
      email: "",
      formStartedAt: Date.now() - 5_000,
      message: "Too short",
      name: "",
      numberOfGuests: 0,
      phone: "",
      privacyNoticeVersion: "2026-08-31",
      submissionId: "33333333-3333-4333-8333-333333333333",
      website: "",
    },
    headers: { Origin: testOrigin },
  });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toMatchObject({ status: "invalid" });

  const unavailable = await page.request.post("/api/contact", {
    data: validPayload,
    headers: { Origin: testOrigin },
  });
  expect(unavailable.status()).toBe(503);
  expect(await unavailable.json()).toEqual({ status: "unavailable" });

  for (let retry = 0; retry < 2; retry += 1) {
    const stillUnavailable = await page.request.post("/api/contact", {
      data: validPayload,
      headers: { Origin: testOrigin },
    });
    expect(stillUnavailable.status()).toBe(503);
  }

  const rateLimited = await page.request.post("/api/contact", {
    data: validPayload,
    headers: { Origin: testOrigin },
  });
  expect(rateLimited.status()).toBe(429);
  expect(await rateLimited.json()).toEqual({ status: "rate-limited" });
  expect(Number(rateLimited.headers()["retry-after"])).toBeGreaterThan(0);

  for (const response of [
    missingOrigin,
    crossOrigin,
    unsupportedMedia,
    malformedJson,
    oversized,
    honeypot,
    invalid,
    unavailable,
    rateLimited,
  ]) {
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  }
});

test("unauthenticated CSV export access does not return protected data", async ({
  page,
}) => {
  const response = await page.goto(
    `/admin/exports/page-views?start=${futureDate(-7)}&end=${futureDate(0)}`,
  );

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: "Administrator sign in" }),
  ).toBeVisible();
  expect(await page.locator("body").textContent()).not.toContain("Anonymous visitor");
});
