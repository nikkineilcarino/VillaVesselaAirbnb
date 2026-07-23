import { expect, test } from "@playwright/test";

test("the public homepage opens without authentication", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Villa Vessela/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your peaceful beachfront escape in Anda, Pangasinan",
    }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
});

test("the homepage does not overflow a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test("the skip link reaches the main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("an unknown route returns the accessible not-found page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "This page could not be found." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute(
    "href",
    "/",
  );
});
