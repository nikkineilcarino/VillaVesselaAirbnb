import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  configuredAirbnbUrl,
  configuredCaretakerPhones,
  configuredContactEmail,
  configuredFacebookUrl,
  configuredGoogleMapsEmbedUrl,
  configuredGoogleMapsUrl,
  configuredInteractiveMaps,
  configuredMessengerUrl,
  configuredWazeEmbedUrl,
  configuredWazeUrl,
  configuredWhatsAppUrl,
} from "./configured-destinations";

const testOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
).origin;
const inquiryEnabled =
  process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
const inquiryVisible =
  inquiryEnabled ||
  process.env.CONTACT_INQUIRY_VISIBLE?.trim().toLowerCase() === "true";

const phaseFiveRoutes = [
  {
    heading: "A closer look at Villa Vessela",
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
    heading: "Choose a verified contact channel",
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

test("gallery exposes every supplied photograph and the three honest open slots", async ({ page, request }) => {
  const publishedPhotos = [
    "/images/villa-vessela/property/villa-vessela-photo-wall.jpg",
    "/images/villa-vessela/attraction/silaki-island-giant-clams.jpg",
    "/images/villa-vessela/attraction/bolinao-floating-restaurant.jpg",
    "/images/villa-vessela/attraction/tara-falls-bolinao.jpg",
    "/images/villa-vessela/attraction/bolinao-falls.jpg",
    "/images/villa-vessela/attraction/hundred-islands-view.jpg",
    "/images/villa-vessela/attraction/tanduyong-island-low-tide.jpg",
  ];

  for (const source of publishedPhotos) {
    const photo = await request.get(source);
    expect(photo.ok(), `${source} should load`).toBe(true);
    expect(photo.headers()["content-type"]).toContain("image/jpeg");
  }

  const placeholder = await request.get("/images/placeholders/gallery-generic-placeholder.svg");
  expect(placeholder.ok()).toBe(true);
  expect(placeholder.headers()["content-type"]).toContain("image/svg+xml");

  await page.route("**/_next/image?*", async (route) => {
    if (decodeURIComponent(route.request().url()).includes("/images/villa-vessela/property/villa-front-page1-cover.jpg")) {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.goto("/gallery");
  await expect(page.getByRole("button", { name: /^Open .+ image$/ })).toHaveCount(44);
  await expect(
    page.getByRole("button", { name: "Open Villa exterior image" }).first().getByRole("img"),
  ).toHaveAttribute("srcset", /q=60/);
  await expect(page.getByText(/Three future photo slots are reserved/)).toBeVisible();
  await expect(page.getByText(/Blue Kubo, Green Kubo, and parking still use clearly labelled photo placeholders/)).toBeVisible();
  await expect(page.getByText(/owner confirms one carport and space for three to four cars/).first()).toBeVisible();
  await expect(page.getByText(/Blue and Green Kubo guests share the kitchen kubo/)).toBeVisible();
  await expect(page.getByAltText(/Illustrated placeholder reserved/)).toHaveCount(3);
  await expect(page.getByText("Image unavailable", { exact: true })).toHaveCount(1);
});

test("gallery lightbox traps focus, supports arrows, and restores its trigger", async ({ page }) => {
  await page.goto("/gallery");

  const exteriorTrigger = page.getByRole("button", { name: "Open Villa exterior image" }).first();
  await exteriorTrigger.click();

  const dialog = page.getByRole("dialog", { name: "Villa exterior" });
  const closeButton = dialog.getByRole("button", { name: "Close gallery" });
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(dialog.getByText("Image 1 of 44")).toBeVisible();
  await expect(dialog.getByRole("img", { name: /Front view of Villa Vessela with flowers/ })).toHaveClass(
    /object-contain/,
  );

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", { name: "Villa exterior" }).getByText("Image 2 of 44")).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Villa exterior" }).getByRole("img", { name: /coral-colored/ })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog", { name: "Villa exterior" }).getByText("Image 1 of 44")).toBeVisible();

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
  if (configuredAirbnbUrl) {
    await expect(page.getByRole("link", { name: "View all reviews on Airbnb" })).toHaveAttribute(
      "href",
      configuredAirbnbUrl,
    );
  } else {
    await expect(page.getByRole("button", { name: /View all reviews on Airbnb/ })).toBeDisabled();
  }
});

test("location exposes opt-in zoomable maps and copies only the confirmed address", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: testOrigin,
  });
  await page.goto("/location");

  const address = "Tondol, Purok 2, Anda, Pangasinan, Philippines";
  await expect(page.getByText(address, { exact: true })).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);

  if (configuredInteractiveMaps) {
    await expect(page.getByRole("button", { name: "Load Google Maps" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Load Waze" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Open Google Maps/ })).toHaveAttribute(
      "href",
      configuredGoogleMapsUrl!,
    );
    await expect(page.getByRole("link", { name: /Navigate with Waze/ })).toHaveAttribute(
      "href",
      configuredWazeUrl!,
    );

    await page.getByRole("button", { name: "Load Google Maps" }).click();
    await expect(page.locator('iframe[title="Villa Vessela location in Google Maps"]')).toHaveAttribute(
      "src",
      configuredGoogleMapsEmbedUrl!,
    );
    await expect(page.getByRole("button", { name: "Viewing Google Maps" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Zoom out in Google Maps" }).click();
    await expect(page.locator('iframe[title="Villa Vessela location in Google Maps"]')).toHaveAttribute(
      "src",
      /[?&]z=16(?:&|$)/,
    );

    await page.getByRole("button", { name: "Load Waze" }).click();
    await expect(page.locator('iframe[title="Villa Vessela location in Waze"]')).toHaveAttribute(
      "src",
      configuredWazeEmbedUrl!,
    );
    await page.getByRole("button", { name: "Zoom out in Waze" }).click();
    await expect(page.locator('iframe[title="Villa Vessela location in Waze"]')).toHaveAttribute(
      "src",
      /[?&]zoom=16(?:&|$)/,
    );
    await page.getByRole("button", { name: "Zoom in on Waze" }).click();
    await expect(page.locator('iframe[title="Villa Vessela location in Waze"]')).toHaveAttribute(
      "src",
      /[?&]zoom=17(?:&|$)/,
    );
    await expect(page.locator("iframe")).toHaveCount(1);
  } else {
    await expect(
      page.getByRole("button", { name: /Open interactive maps: map configuration unavailable/ }),
    ).toBeDisabled();
    await expect(page.getByText(/Interactive maps are temporarily unavailable/)).toBeVisible();
  }

  await page.getByRole("button", { name: "Copy address" }).click();
  await expect(page.getByRole("button", { name: "Address copied" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("confirmed text address");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
});

test("configured Waze navigation dispatches its exact analytics category without cancelling the anchor", async ({
  page,
}) => {
  test.skip(!configuredInteractiveMaps, "The complete owner-approved map configuration is required.");

  const linkEvents: Record<string, unknown>[] = [];

  await page.addInitScript(() => {
    localStorage.setItem("vv_analytics_preference", "allowed");
  });
  await page.route("**/api/analytics/link-click", async (route) => {
    linkEvents.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({ status: 201 });
  });
  await page.goto("/location");
  await expect(page.getByRole("button", { name: "Analytics settings" })).toBeVisible();

  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('a[href^="https://www.waze.com/"], a[href^="https://waze.com/"]')
      ) {
        // The component's anchor handler has already run by the time this document-level
        // bubble listener executes. Cancelling only the external test navigation keeps
        // the browser test local without replacing the anchor's production behavior.
        event.preventDefault();
      }
    });
  });

  const wazeLink = page.getByRole("link", { name: /Navigate with Waze/ });
  await expect(wazeLink).toHaveAttribute("href", configuredWazeUrl!);
  await wazeLink.click();

  await expect.poll(() => linkEvents.length).toBe(1);
  expect(linkEvents[0]).toMatchObject({
    destinationUrl: configuredWazeUrl,
    linkType: "waze",
    sourcePage: "/location",
  });
  await expect(page).toHaveURL(/\/location$/);
});

test("contact channels expose only approved destinations and accurate inquiry mode", async ({
  page,
}) => {
  await page.goto("/contact");

  const totalChannelCount = 5 + Math.max(1, configuredCaretakerPhones.length);
  const activeChannelCount =
    configuredCaretakerPhones.length +
    Number(Boolean(configuredAirbnbUrl)) +
    Number(Boolean(configuredContactEmail)) +
    Number(Boolean(configuredFacebookUrl)) +
    Number(Boolean(configuredMessengerUrl)) +
    Number(Boolean(configuredWhatsAppUrl));
  const pendingChannelCount = totalChannelCount - activeChannelCount;
  await expect(page.getByRole("button", { name: /destination awaiting confirmation/ })).toHaveCount(
    pendingChannelCount,
  );
  for (const button of await page.getByRole("button", { name: /destination awaiting confirmation/ }).all()) {
    await expect(button).toBeDisabled();
  }
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: activeChannelCount
        ? pendingChannelCount
          ? "Approved contacts and pending channels"
          : "Approved contact channels"
        : "No incomplete link is active",
    }),
  ).toBeVisible();

  const caretakerLinks = page.locator('a[href^="tel:"]');
  if (configuredCaretakerPhones.length) {
    await expect(caretakerLinks).toHaveCount(configuredCaretakerPhones.length);
    await expect(page.getByText("Nida — Caretaker", { exact: true })).toBeVisible();
    expect((await caretakerLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).sort()).toEqual(
      [...configuredCaretakerPhones].sort(),
    );
  } else {
    await expect(caretakerLinks).toHaveCount(0);
  }
  await expect(page.getByText("Evelyn — Caretaker", { exact: true })).toHaveCount(0);

  if (configuredAirbnbUrl) {
    await expect(page.locator(`a[href="${configuredAirbnbUrl}"]`)).toHaveCount(2);
    await expect(page.getByText("View listing on Airbnb", { exact: true })).toBeVisible();
  }

  if (configuredFacebookUrl) {
    await expect(page.locator(`a[href="${configuredFacebookUrl}"]`)).toHaveCount(1);
    await expect(page.getByText("Visit Facebook page", { exact: true })).toBeVisible();
  }

  if (configuredMessengerUrl) {
    await expect(page.locator(`a[href="${configuredMessengerUrl}"]`)).toHaveCount(1);
    await expect(page.getByText("Open Messenger", { exact: true })).toBeVisible();
  }

  if (configuredWhatsAppUrl) {
    await expect(page.locator(`a[href="${configuredWhatsAppUrl}"]`)).toHaveCount(1);
    await expect(page.getByText("Open WhatsApp", { exact: true })).toBeVisible();
    await expect(page.getByText("Owner-approved WhatsApp contact", { exact: true })).toBeVisible();
  }

  if (configuredContactEmail) {
    await expect(page.locator(`a[href="${configuredContactEmail}"]`)).toHaveCount(1);
    await expect(
      page.getByText(configuredContactEmail.replace(/^mailto:/, ""), { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Owner-approved public email", { exact: true })).toBeVisible();
  }

  const form = page.getByRole("form");
  if (!inquiryVisible) {
    await expect(form).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/inquir/i);
  } else if (inquiryEnabled) {
    expect(await form.getAttribute("action")).toBeNull();
    await expect(form.locator("fieldset")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Send inquiry" })).toBeEnabled();
    await expect(form.getByRole("link", { name: "Privacy notice" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(form).toContainText("sends no automatic reply or operator notification");
  } else {
    expect(await form.getAttribute("action")).toBeNull();
    await expect(form.locator("fieldset")).toHaveAttribute("disabled", "");
    const disabledFields = form.locator("input, textarea");
    await expect(disabledFields).toHaveCount(8);
    for (const field of await disabledFields.all()) {
      await expect(field).toBeDisabled();
    }
    await expect(
      page.getByRole("button", { name: "Inquiry submission unavailable" }),
    ).toBeDisabled();
  }
  if (inquiryVisible) {
    await expect(form.locator('input[type="password"], input[autocomplete="cc-number"]')).toHaveCount(0);
    await expect(page.getByText(/Never send payment-card details/)).toBeVisible();
  }
});

test("Phase 5 routes expose only configured external destinations", async ({ page }) => {
  for (const route of phaseFiveRoutes) {
    await page.goto(route.path);
    const externalLinks = page.locator('a[href^="http"], a[href^="tel:"], a[href^="mailto:"]');
    const destinations = await externalLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );

    const allowedDestinations = [configuredAirbnbUrl];
    if (route.path === "/location") {
      allowedDestinations.push(configuredGoogleMapsUrl, configuredWazeUrl);
    }
    if (route.path === "/contact") {
      allowedDestinations.push(
        configuredFacebookUrl,
        configuredContactEmail,
        configuredMessengerUrl,
        configuredWhatsAppUrl,
        ...configuredCaretakerPhones,
      );
    }

    const activeAllowedDestinations = allowedDestinations.filter(
      (destination): destination is string => Boolean(destination),
    );
    expect(destinations.every((destination) => activeAllowedDestinations.includes(destination))).toBe(true);

    for (const destination of activeAllowedDestinations) {
      expect(destinations).toContain(destination);
    }

    if (configuredAirbnbUrl) {
      await expect(page.getByRole("link", { name: "Book on Airbnb" })).toHaveAttribute(
        "href",
        configuredAirbnbUrl,
      );
    } else {
      await expect(page.getByRole("button", { name: /Book on Airbnb/ })).toBeDisabled();
    }
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
