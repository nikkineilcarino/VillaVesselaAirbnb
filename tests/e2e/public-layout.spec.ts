import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("desktop header and footer expose only implemented destinations", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const header = page.getByRole("banner");
  const footer = page.getByRole("contentinfo");
  const primaryNavigation = page.getByRole("navigation", { name: "Primary" });

  await expect(header.getByRole("img", { name: "Villa Vessela" })).toBeVisible();
  await expect(primaryNavigation).toBeVisible();
  await expect(primaryNavigation.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(primaryNavigation.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/#about",
  );
  await expect(primaryNavigation.locator('[aria-disabled="true"]')).toHaveCount(0);
  await expect(header.getByRole("button", { name: /Book on Airbnb/ })).toBeDisabled();
  await expect(footer.getByText("Tondol, Purok 2")).toBeVisible();
  await expect(footer.getByText(/Airbnb does not endorse this website/)).toBeVisible();
});

test("mobile menu locks scrolling and restores focus after Escape", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open site menu" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  const closeButton = dialog.getByRole("button", { name: "Close site menu" });

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(dialog.getByRole("navigation", { name: "Mobile primary" })).toBeVisible();
  await expect(dialog.locator('[aria-disabled="true"]')).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: /Book on Airbnb/ })).toBeDisabled();

  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("mobile menu traps focus and closes after navigation", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open site menu" }).click();

  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  const closeButton = dialog.getByRole("button", { name: "Close site menu" });
  const lastAvailableLink = dialog.getByRole("link", { name: "Contact" });

  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(lastAvailableLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await lastAvailableLink.click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/contact$/);
});

test("brand assets and favicon are available", async ({ page, request }) => {
  for (const asset of [
    "/logo/villa-vessela-logo-dark.svg",
    "/logo/villa-vessela-logo-light.svg",
    "/logo/villa-vessela-mark.svg",
    "/logo/villa-vessela-mark-light.svg",
    "/logo/favicon.svg",
  ]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should load`).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  }

  await page.goto("/");
  await expect(
    page.locator('link[rel="icon"][href="/logo/favicon.svg"]'),
  ).toHaveAttribute(
    "href",
    /\/logo\/favicon\.svg/,
  );
});

test("public shell has no automatically detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your peaceful beachfront escape in Anda, Pangasinan",
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
