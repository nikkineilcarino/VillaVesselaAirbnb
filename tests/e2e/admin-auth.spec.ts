import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("administrator login is public, private from search engines, and has no registration", async ({
  page,
}) => {
  const response = await page.goto("/admin/login");
  const cacheControl = response?.headers()["cache-control"];

  expect(response?.status()).toBe(200);
  // Next's development server replaces configured private/no-store with its own
  // no-cache policy. The production-header check is recorded separately in QA.
  expect(cacheControl).toContain("no-cache");
  expect(cacheControl).toContain("must-revalidate");
  await expect(
    page.getByRole("heading", { level: 1, name: "Administrator sign in" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveAttribute("autocomplete", "username");
  await expect(page.getByLabel("Password")).toHaveAttribute(
    "autocomplete",
    "current-password",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByText(/There is no public registration/)).toBeVisible();
  await expect(page.getByRole("link", { name: /sign up|register/i })).toHaveCount(0);
});

test("an unauthenticated protected request redirects only to the fixed login route", async ({
  page,
}) => {
  const response = await page.goto("/admin/dashboard?returnTo=https://example.invalid");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Administrator sign in" }),
  ).toBeVisible();
  expect(page.url()).not.toContain("example.invalid");
});

test("unknown login notices are ignored and technical details stay hidden", async ({ page }) => {
  await page.goto("/admin/login?notice=unexpected-internal-error");

  await expect(page.getByText("unexpected-internal-error")).toHaveCount(0);
  await expect(page.getByText(/stack|digest|supabase auth error/i)).toHaveCount(0);
});

test("administrator login has no mobile overflow or automatic accessibility violations", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/admin/login");
  await expect(
    page.getByRole("heading", { level: 1, name: "Administrator sign in" }),
  ).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  const accessibilityResults = await new AxeBuilder({ page }).analyze();

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect(accessibilityResults.violations).toEqual([]);
});
