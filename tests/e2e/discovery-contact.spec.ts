import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const testOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
).origin;

const phaseFiveRoutes = [
  {
    heading: "A closer look, ready for official photography",
    label: "Gallery",
    path: "/gallery",
  },
  {
    heading: "What guests have shared about Villa Vessela",
    label: "Reviews",
    path: "/reviews",
  },
  {
    heading: "Close to the beach in a quieter coastal setting",
    label: "Location",
    path: "/location",
  },
  {
    heading: "Choose a verified channel when one becomes available",
    label: "Contact",
    path: "/contact",
  },
] as const;

test("Phase 5 routes are public, titled, and active in navigation", async ({ page }) => {
  for (const route of phaseFiveRoutes) {
    const response = await page.goto(route.path);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(page).toHaveTitle(`${route.label} | Villa Vessela`);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(`Home/${route.label}`);
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: route.label, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
});

test("gallery exposes every category and local placeholder asset", async ({ page, request }) => {
  const response = await request.get("/images/placeholders/gallery-generic-placeholder.svg");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");

  await page.route("**/images/placeholders/exterior-placeholder.svg", (route) => route.abort());
  await page.goto("/gallery");
  await expect(page.getByRole("button", { name: /^Open .+ image$/ })).toHaveCount(14);
  await expect(page.getByText("Official photography pending", { exact: true })).toHaveCount(14);
  await expect(page.getByText(/They do not document the appearance of the villa/)).toBeVisible();
  await expect(page.getByText("Image unavailable", { exact: true })).toHaveCount(1);
});

test("gallery lightbox traps focus, supports arrows, and restores its trigger", async ({ page }) => {
  await page.goto("/gallery");

  const exteriorTrigger = page.getByRole("button", { name: "Open Exterior image" });
  await exteriorTrigger.click();

  const dialog = page.getByRole("dialog", { name: "Exterior" });
  const closeButton = dialog.getByRole("button", { name: "Close gallery" });
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(dialog.getByText("Image 1 of 14")).toBeVisible();
  await expect(dialog.getByRole("img", { name: /Illustrated placeholder for the Villa Vessela exterior/ })).toHaveClass(
    /object-contain/,
  );

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", { name: "Villa" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Villa" }).getByText("Image 2 of 14")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog", { name: "Exterior" })).toBeVisible();

  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next image" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(exteriorTrigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("reviews preserve supplied attribution and reserve Messenger content honestly", async ({ page }) => {
  await page.goto("/reviews");

  await expect(page.getByRole("heading", { name: "4.76 / 5" })).toBeVisible();
  await expect(page.getByText(/Based on 21 reviews reported in the supplied Airbnb listing/)).toBeVisible();
  await expect(page.getByText(/They are not live-synced, and Airbnb does not endorse/)).toBeVisible();
  await expect(page.getByText("Dyesebel", { exact: true })).toBeVisible();
  await expect(page.getByText("Helda", { exact: true })).toBeVisible();
  await expect(page.getByText("Rosalie", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Approved Messenger review pending" })).toHaveCount(3);
  await expect(page.getByRole("button", { name: /View all reviews on Airbnb/ })).toBeDisabled();
});

test("location keeps the map disabled and copies only the confirmed address", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: testOrigin,
  });
  await page.goto("/location");

  const address = "Tondol, Purok 2, Anda, Pangasinan, Philippines";
  await expect(page.getByText(address, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Open in Google Maps/ })).toBeDisabled();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText(/not a navigational map and not a verified pin/)).toBeVisible();

  await page.getByRole("button", { name: "Copy address" }).click();
  await expect(page.getByRole("button", { name: "Address copied" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("confirmed text address");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
});

test("contact channels and inquiry shell remain safely disabled", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("button", { name: /destination awaiting confirmation/ })).toHaveCount(6);
  for (const button of await page.getByRole("button", { name: /destination awaiting confirmation/ }).all()) {
    await expect(button).toBeDisabled();
  }

  const form = page.getByRole("form");
  expect(await form.getAttribute("action")).toBeNull();
  await expect(form.locator("fieldset")).toHaveAttribute("disabled", "");
  const disabledFields = form.locator("input, textarea");
  await expect(disabledFields).toHaveCount(8);
  for (const field of await disabledFields.all()) {
    await expect(field).toBeDisabled();
  }
  await expect(form.locator('input[type="password"], input[autocomplete="cc-number"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Inquiry submission unavailable" })).toBeDisabled();
  await expect(page.getByText(/Never send payment-card details/)).toBeVisible();
});

test("Phase 5 routes expose no unverified external destination", async ({ page }) => {
  for (const route of phaseFiveRoutes) {
    await page.goto(route.path);
    await expect(page.locator('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Book on Airbnb/ })).toBeDisabled();
  }
});

test("Phase 5 routes fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of phaseFiveRoutes) {
    await page.goto(route.path);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${route.path} should not overflow horizontally`).toBe(false);
  }
});

test("Phase 5 routes have no automatically detectable accessibility violations", async ({ page }) => {
  for (const route of phaseFiveRoutes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route.path}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});
