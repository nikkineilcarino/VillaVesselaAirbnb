import { expect, test } from "@playwright/test";

test("homepage presents every required preview section", async ({ page }) => {
  await page.goto("/");

  for (const heading of [
    "Your peaceful beachfront escape in Anda, Pangasinan",
    "Space for unhurried days together",
    "A quiet tropical base for families and groups",
    "A complete villa for time together",
    "Everything you need for an easy coastal stay",
    "A first look, awaiting official photographs",
    "4.76 out of 5",
    "Close to the shore, away from the city",
    "Explore more of Anda and Pangasinan",
    "Ready for a quieter kind of beach escape?",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeAttached();
  }
});

test("homepage preserves key facts and uncertainty qualifiers", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("10 guests", { exact: true })).toBeVisible();
  await expect(page.getByText("2 bedrooms", { exact: true })).toBeVisible();
  await expect(page.getByText("5 beds", { exact: true })).toBeVisible();
  await expect(page.getByText("1 main bathroom", { exact: true })).toBeVisible();
  await expect(page.getByText(/Up to 13 guests may be considered only with prior host approval/).first()).toBeVisible();
  await expect(page.getByText(/mobile-network connectivity rather than conventional fixed Wi-Fi/)).toBeVisible();
  await expect(page.getByText(/additional external toilets and a shower have been reported/)).toBeVisible();
  await expect(page.getByText(/Rating and review information is based on the property's Airbnb listing/)).toBeVisible();
});

test("unverified destinations remain inactive", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your peaceful beachfront escape in Anda, Pangasinan",
    }),
  ).toBeVisible();

  const externalLinks = page.locator(
    'a[href^="http"], a[href^="tel:"], a[href^="mailto:"], a[href^="https:"]',
  );
  await expect(externalLinks).toHaveCount(0);

  const bookingButtons = page.getByRole("button", { name: /Book on Airbnb/ });
  expect(await bookingButtons.count()).toBeGreaterThanOrEqual(3);
  for (let index = 0; index < (await bookingButtons.count()); index += 1) {
    await expect(bookingButtons.nth(index)).toBeDisabled();
  }
  await expect(page.getByRole("button", { name: /Open in Google Maps/ })).toBeDisabled();
});

test("homepage placeholders are explicit and locally available", async ({ page, request }) => {
  for (const asset of [
    "/images/placeholders/hero-beachfront.svg",
    "/images/placeholders/exterior-placeholder.svg",
    "/images/placeholders/bedroom-placeholder.svg",
    "/images/placeholders/garden-placeholder.svg",
    "/images/placeholders/beach-placeholder.svg",
    "/images/placeholders/location-placeholder.svg",
  ]) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should load`).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
  }

  await page.goto("/");
  expect(await page.getByAltText(/placeholder/i).count()).toBeGreaterThanOrEqual(6);
  await expect(page.getByText(/These clearly labelled illustrations/)).toBeAttached();
  await expect(page.getByText(/Map illustration only/)).toBeAttached();
});

test("location and about anchors navigate within the homepage", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "View location", exact: true }).click();
  await expect(page).toHaveURL(/#location$/);
  await expect(page.getByRole("heading", { name: "Close to the shore, away from the city" })).toBeInViewport();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("heading", { name: "A quiet tropical base for families and groups" })).toBeInViewport();
});
