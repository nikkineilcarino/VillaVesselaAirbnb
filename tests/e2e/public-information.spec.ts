import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicInformationRoutes = [
  {
    heading: "Room to gather, rest, and enjoy the coast",
    label: "Accommodation",
    path: "/accommodation",
  },
  {
    heading: "Amenities for a relaxed, self-catered stay",
    label: "Amenities",
    path: "/amenities",
  },
  {
    heading: "A practical guide to Villa Vessela and Tondol",
    label: "Guest Guide",
    path: "/guest-guide",
  },
] as const;

test("Phase 4 information routes are public and active in primary navigation", async ({ page }) => {
  for (const route of publicInformationRoutes) {
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

test("accommodation keeps capacity, facilities, and inclusions qualified", async ({ page }) => {
  await page.goto("/accommodation");

  await expect(page.getByText("10 guests", { exact: true })).toBeVisible();
  await expect(page.getByText(/Up to 13 guests may be considered only with prior host approval/).first()).toBeVisible();
  await expect(page.getByText(/One main bathroom is confirmed; additional external toilets/).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blue and Green Kubos" })).toBeVisible();
  await expect(page.getByText(/Their inclusion in a standard booking has not been confirmed/)).toBeVisible();
  await expect(page.getByText(/beach cottage may be available for an additional charge/)).toBeVisible();
});

test("amenities distinguish supplied information from confirmation items", async ({ page }) => {
  await page.goto("/amenities");

  await expect(page.getByRole("heading", { name: "Mobile network, not fixed Wi-Fi" })).toBeVisible();
  await expect(page.getByText(/no provider, signal strength, speed, or uninterrupted service is guaranteed/)).toBeVisible();
  await expect(page.getByText(/current arrangement still needs owner confirmation/)).toBeVisible();
  await expect(page.getByText(/current guest access has not been confirmed/)).toBeVisible();
  expect(await page.getByText("Confirm before stay", { exact: true }).count()).toBeGreaterThanOrEqual(3);
});

test("guest guide provides rules, fee safeguards, attractions, and accessible FAQs", async ({ page }) => {
  await page.goto("/guest-guide");

  await expect(page.getByText("Videoke must stop by 10:00 PM.", { exact: true })).toBeVisible();
  await expect(page.getByText("No smoking inside the villa or on balconies.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Every listed amount still requires confirmation" })).toBeVisible();
  await expect(page.getByText(/No amount is published until the owner approves/)).toBeVisible();
  await expect(page.locator("main").getByText(/PHP|₱/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Toothbrush Island" })).toBeVisible();
  await expect(page.locator("details")).toHaveCount(20);

  const waterFaq = page.locator("details").filter({ hasText: "Is drinking water provided?" });
  await waterFaq.getByText("Is drinking water provided?", { exact: true }).click();
  await expect(waterFaq.getByText(/current arrangement should be confirmed with the host/)).toBeVisible();
});

test("guest guide section navigation reaches its labelled content", async ({ page }) => {
  await page.goto("/guest-guide");

  await page.getByRole("navigation", { name: "Guest guide sections" }).getByRole("link", { name: "House rules" }).click();
  await expect(page).toHaveURL(/#house-rules$/);
  await expect(page.getByRole("heading", { name: "Care for the villa, neighbours, and coast" })).toBeInViewport();

  await page.getByRole("navigation", { name: "Guest guide sections" }).getByRole("link", { name: "FAQs" }).click();
  await expect(page).toHaveURL(/#faqs$/);
  await expect(page.getByRole("heading", { name: "Useful answers before you book" })).toBeInViewport();
});

test("Phase 4 pages contain no active unverified external destination", async ({ page }) => {
  for (const route of publicInformationRoutes) {
    await page.goto(route.path);
    await expect(page.locator('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Book on Airbnb/ })).toBeDisabled();
  }
});

test("Phase 4 pages fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of publicInformationRoutes) {
    await page.goto(route.path);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${route.path} should not overflow horizontally`).toBe(false);
  }
});

test("Phase 4 pages have no automatically detectable accessibility violations", async ({ page }) => {
  for (const route of publicInformationRoutes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route.path}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});
