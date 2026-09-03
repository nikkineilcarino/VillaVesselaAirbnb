import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { configuredAirbnbUrl } from "./configured-destinations";

const testOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
).origin;
const isPublicHttpsOrigin =
  testOrigin.startsWith("https://") &&
  !testOrigin.endsWith(".invalid");
const inquiryEnabled =
  process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
const inquiryVisible =
  inquiryEnabled ||
  process.env.CONTACT_INQUIRY_VISIBLE?.trim().toLowerCase() === "true";

function absoluteTestUrl(path: string) {
  return path === "/" ? testOrigin : new URL(path, `${testOrigin}/`).toString();
}

const publicRoutes = [
  { label: "Home", path: "/", title: "Villa Vessela — Beachfront stay in Tondol, Pangasinan" },
  { label: "Accommodation", path: "/accommodation", title: "Accommodation | Villa Vessela" },
  { label: "Amenities", path: "/amenities", title: "Amenities | Villa Vessela" },
  { label: "Contact", path: "/contact", title: "Contact | Villa Vessela" },
  { label: "Gallery", path: "/gallery", title: "Gallery | Villa Vessela" },
  { label: "Guest Guide", path: "/guest-guide", title: "Guest Guide | Villa Vessela" },
  { label: "Location", path: "/location", title: "Location | Villa Vessela" },
  { label: "Privacy", path: "/privacy", title: "Privacy | Villa Vessela" },
  { label: "Reviews", path: "/reviews", title: "Reviews | Villa Vessela" },
] as const;

test("every public route has aligned canonical, social, title, description, and JSON-LD metadata", async ({
  page,
}) => {
  const descriptions = new Set<string>();

  for (const route of publicRoutes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("h1")).toHaveCount(1);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length, `${route.path} description`).toBeGreaterThan(60);
    descriptions.add(description ?? "");

    const expectedUrl = absoluteTestUrl(route.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expectedUrl,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      expectedUrl,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/opengraph-image/,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      /Villa Vessela floral photo wall/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const graphs = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(graphs.length, `${route.path} JSON-LD`).toBeGreaterThan(0);
    const parsed = graphs.map((graph) => JSON.parse(graph) as Record<string, unknown>);

    if (route.path === "/") {
      expect(parsed.some((graph) => graph["@type"] === "LodgingBusiness")).toBe(true);
      expect(graphs.join(" ")).not.toMatch(
        /placeholder|latitude|longitude|telephone|hasMap/,
      );
    } else {
      expect(parsed.some((graph) => graph["@type"] === "BreadcrumbList")).toBe(true);
      await expect(
        page.getByRole("navigation", { name: "Breadcrumb" }),
      ).toContainText(`Home/${route.label}`);
    }
  }

  expect(descriptions.size).toBe(publicRoutes.length);
});

test("robots, sitemap, manifest, social image, and web app icons are valid local outputs", async ({
  page,
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  if (isPublicHttpsOrigin) {
    expect(robotsText).toMatch(/^Allow: \/$/m);
    expect(robotsText).toMatch(/^Disallow: \/admin\/$/m);
    expect(robotsText).toMatch(/^Disallow: \/api\/$/m);
    expect(robotsText).toContain(`Host: ${testOrigin}`);
    expect(robotsText).toContain(`Sitemap: ${testOrigin}/sitemap.xml`);
    expect(robotsText).not.toMatch(/^Disallow: \/$/m);
  } else {
    expect(robotsText).toMatch(/^Disallow: \/$/m);
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();
  for (const route of publicRoutes) {
    expect(sitemapText).toContain(absoluteTestUrl(route.path));
  }
  expect(sitemapText).not.toMatch(/\/admin|\/api/);

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = (await manifestResponse.json()) as {
    icons: { sizes: string; src: string; type: string }[];
    name: string;
  };
  expect(manifest.name).toBe("Villa Vessela");
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual(["192x192", "512x512"]);

  const socialImage = await request.get("/opengraph-image");
  expect(socialImage.ok()).toBe(true);
  expect(socialImage.headers()["content-type"]).toContain("image/png");
  expect((await socialImage.body()).byteLength).toBeGreaterThan(10_000);
  await page.goto("/");
  const socialDimensions = await page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  }, absoluteTestUrl("/opengraph-image"));
  expect(socialDimensions).toEqual([1200, 630]);

  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok(), icon.src).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }

  await page.goto("/");
  const dimensions = await page.evaluate(async () => {
    const results: [number, number][] = [];
    for (const src of [
      "/logo/apple-touch-icon.png",
      "/logo/web-app-icon-192.png",
      "/logo/web-app-icon-512.png",
    ]) {
      const image = new Image();
      image.src = src;
      await image.decode();
      results.push([image.naturalWidth, image.naturalHeight]);
    }
    return results;
  });
  expect(dimensions).toEqual([
    [180, 180],
    [192, 192],
    [512, 512],
  ]);
});

test("privacy page is public, accurate, responsive, keyboard-visible, and Axe-clean", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  const response = await page.goto("/privacy");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A clear account of the website's data practices",
    }),
  ).toBeVisible();
  await expect(page.getByText(/waits for an explicit Allow analytics choice/)).toBeVisible();
  await expect(page.getByText(/random visitor ID/)).toBeVisible();
  await expect(page.getByText(/does not intentionally collect or store a visitor name/)).toBeVisible();
  await expect(page.getByText(/Administrator routes are excluded from public analytics/)).toBeVisible();
  await expect(page.getByText(/vv_analytics_preference/)).toBeVisible();
  await expect(page.getByText(/Choosing Decline stops future analytics/)).toBeVisible();
  await expect(page.getByText(/older than 365 days/).first()).toBeVisible();
  await expect(page.getByText(/deletes eligible analytics records daily/)).toBeVisible();
  await expect(page.getByText(/database project is paused/)).toBeVisible();
  if (inquiryVisible) {
    await expect(
      inquiryEnabled
        ? page.getByText(/Website inquiry collection is active/)
        : page.getByText(/Inquiry collection is disabled/).first(),
    ).toBeVisible();
  } else {
    await expect(page.locator("main")).not.toContainText(/inquir/i);
  }
  await expect(page.getByRole("link", { name: "Contact page" })).toHaveAttribute(
    "href",
    "/contact",
  );
  const externalDestinations = await page
    .locator('a[href^="http"], a[href^="mailto:"], a[href^="tel:"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(externalDestinations).toEqual(configuredAirbnbUrl ? [configuredAirbnbUrl] : []);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);

  await page.keyboard.press("Home");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveCSS(
    "outline-width",
    "3px",
  );
  expect(
    await page
      .getByRole("link", { name: "Skip to main content" })
      .evaluate((element) => getComputedStyle(element).boxShadow),
  ).not.toBe("none");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("global security headers and static asset caching are present without breaking reduced motion", async ({
  page,
  request,
}) => {
  const response = await request.get("/privacy");
  const headers = response.headers();
  const csp = headers["content-security-policy"] ?? "";

  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain(
    "frame-src 'self' https://www.google.com https://embed.waze.com",
  );
  expect(csp).not.toContain("frame-src *");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

  const asset = await request.get("/logo/web-app-icon-192.png");
  const testHostname = new URL(
    process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
  ).hostname;
  expect(asset.headers()["cache-control"]).toContain(
    ["127.0.0.1", "localhost"].includes(testHostname) ? "no-store" : "max-age=86400",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
