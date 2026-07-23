import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

    const expectedUrl =
      route.path === "/"
        ? "http://localhost:3000"
        : new URL(route.path, "http://localhost:3000").toString();
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
  expect(await robots.text()).toContain("Disallow: /");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();
  for (const route of publicRoutes) {
    expect(sitemapText).toContain(
      new URL(route.path, "http://localhost:3000").toString(),
    );
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
  await expect(page.getByText(/random visitor ID/)).toBeVisible();
  await expect(page.getByText(/does not intentionally collect or store a visitor name/)).toBeVisible();
  await expect(page.getByText(/No automatic analytics or inquiry deletion schedule/)).toBeVisible();
  await expect(page.locator('a[href^="http"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
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
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

  const asset = await request.get("/logo/web-app-icon-192.png");
  expect(asset.headers()["cache-control"]).toContain("max-age=86400");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
