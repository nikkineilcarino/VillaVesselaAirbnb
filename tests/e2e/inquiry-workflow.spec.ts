import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const inquiryEnabled =
  process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";

function futureDate(days: number) {
  const date = new Date(Date.now() + days * 86_400_000);
  return date.toISOString().slice(0, 10);
}

test("contact inquiry UI matches the server feature mode and handles enabled states", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/contact");

  if (!inquiryEnabled) {
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
    return;
  }

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
  await page.route("**/api/contact", async (route) => {
    submission += 1;
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

    await route.fulfill(
      submission === 2
        ? {
            body: JSON.stringify({ status: "received" }),
            contentType: "application/json",
            status: 201,
          }
        : {
            body: JSON.stringify({ status: "unavailable" }),
            contentType: "application/json",
            status: 503,
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
});

test("contact API rejects invalid data and never disguises unavailable storage", async ({
  page,
}) => {
  if (!inquiryEnabled) {
    const response = await page.request.post("/api/contact", {
      data: {},
      headers: { Origin: "http://localhost:3000" },
    });
    expect(response.status()).toBe(404);
    expect(response.headers()["cache-control"]).toContain("no-store");
    return;
  }

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
      website: "",
    },
    headers: { Origin: "http://localhost:3000" },
  });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toMatchObject({ status: "invalid" });

  const unavailable = await page.request.post("/api/contact", {
    data: {
      checkIn: futureDate(7),
      checkOut: futureDate(10),
      clientId: "22222222-2222-4222-8222-222222222222",
      consent: true,
      email: "guest@example.invalid",
      formStartedAt: Date.now() - 5_000,
      message: "Please tell me whether these preferred dates are available.",
      name: "Sample Guest",
      numberOfGuests: 4,
      phone: "",
      website: "",
    },
    headers: { Origin: "http://localhost:3000" },
  });
  expect(unavailable.status()).toBe(503);
  expect(await unavailable.json()).toEqual({ status: "unavailable" });
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
