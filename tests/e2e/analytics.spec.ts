import { expect, test, type Request as PlaywrightRequest } from "@playwright/test";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("public page views use stable random visitor/session IDs and minimized fields", async ({
  context,
  page,
}) => {
  const events: Record<string, unknown>[] = [];

  await page.route("**/api/analytics/page-view", async (route) => {
    events.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({ status: 202 });
  });
  await page.setExtraHTTPHeaders({
    referer: "https://search.example/private/path?q=sensitive#result",
  });

  await page.goto("/");
  await expect.poll(() => events.length).toBe(1);

  const first = events[0]!;
  expect(first.path).toBe("/");
  expect(first.anonymousVisitorId).toMatch(uuidPattern);
  expect(first.sessionId).toMatch(uuidPattern);
  expect(first.deviceType).toBe("desktop");
  expect(first.browserType).toBe("chrome");
  expect(first.referrer).toBe("https://search.example");
  expect(first).not.toHaveProperty("ip");
  expect(first).not.toHaveProperty("userAgent");
  expect(first).not.toHaveProperty("screen");

  const visitorCookie = (await context.cookies()).find(
    (cookie) => cookie.name === "vv_visitor_id",
  );
  const storedSession = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem("vv_analytics_session") ?? "null") as {
      id?: string;
    } | null,
  );

  expect(visitorCookie?.value).toBe(first.anonymousVisitorId);
  expect(visitorCookie?.sameSite).toBe("Lax");
  expect(visitorCookie?.secure).toBe(false);
  expect((visitorCookie?.expires ?? 0) * 1000).toBeGreaterThan(
    Date.now() + 300 * 24 * 60 * 60 * 1000,
  );
  expect(storedSession?.id).toBe(first.sessionId);

  await page.setExtraHTTPHeaders({});
  await page.reload();
  await expect.poll(() => events.length).toBe(2);
  expect(events[1]?.anonymousVisitorId).toBe(first.anonymousVisitorId);
  expect(events[1]?.sessionId).toBe(first.sessionId);
});

test("route changes create one event each while same-path rerenders do not duplicate", async ({
  page,
}) => {
  const requests: PlaywrightRequest[] = [];

  await page.route("**/api/analytics/page-view", async (route) => {
    requests.push(route.request());
    await route.fulfill({ status: 202 });
  });

  await page.goto("/");
  await expect.poll(() => requests.length).toBe(1);
  await page.waitForTimeout(300);
  expect(requests).toHaveLength(1);

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Accommodation" }).click();
  await expect(page).toHaveURL(/\/accommodation$/);
  await expect.poll(() => requests.length).toBe(2);
  expect(requests.map((request) => request.postDataJSON().path)).toEqual([
    "/",
    "/accommodation",
  ]);
});

test("administrator routes never mount the public page tracker", async ({ page }) => {
  let analyticsRequests = 0;

  await page.route("**/api/analytics/page-view", async (route) => {
    analyticsRequests += 1;
    await route.fulfill({ status: 202 });
  });

  await page.goto("/admin/login");
  await expect(
    page.getByRole("heading", { level: 1, name: "Administrator sign in" }),
  ).toBeVisible();
  await page.waitForTimeout(300);
  expect(analyticsRequests).toBe(0);
  expect(await page.evaluate(() => sessionStorage.getItem("vv_analytics_session"))).toBeNull();
});

test("analytics endpoints bound requests and reject admin paths or arbitrary destinations", async ({
  request,
}) => {
  const identity = {
    anonymousVisitorId: "11111111-1111-4111-8111-111111111111",
    sessionId: "22222222-2222-4222-8222-222222222222",
  };
  const validPageView = await request.post("/api/analytics/page-view", {
    data: {
      ...identity,
      browserType: "chrome",
      deviceType: "desktop",
      path: "/contact",
      referrer: "https://search.example/private/path?q=value",
    },
  });
  const adminPath = await request.post("/api/analytics/page-view", {
    data: {
      ...identity,
      browserType: "chrome",
      deviceType: "desktop",
      path: "/admin/dashboard",
      referrer: null,
    },
  });
  const arbitraryLink = await request.post("/api/analytics/link-click", {
    data: {
      ...identity,
      destinationUrl: "https://attacker.example/redirect",
      linkType: "airbnb",
      sourcePage: "/",
    },
  });
  const wrongMedia = await request.post("/api/analytics/page-view", {
    data: "not-json",
    headers: { "Content-Type": "text/plain" },
  });
  const oversized = await request.post("/api/analytics/page-view", {
    data: { value: "x".repeat(5000) },
  });
  const crossOrigin = await request.post("/api/analytics/page-view", {
    data: {
      ...identity,
      browserType: "chrome",
      deviceType: "desktop",
      path: "/",
      referrer: null,
    },
    headers: {
      Origin: "https://attacker.example",
      "Sec-Fetch-Site": "cross-site",
    },
  });

  expect(validPageView.status()).toBe(202);
  expect(validPageView.headers()["cache-control"]).toContain("no-store");
  expect(adminPath.status()).toBe(400);
  expect(arbitraryLink.status()).toBe(400);
  expect(wrongMedia.status()).toBe(415);
  expect(oversized.status()).toBe(413);
  expect(crossOrigin.status()).toBe(403);
});

test("analytics delivery failure never interrupts public reading or internal navigation", async ({
  page,
}) => {
  await page.route("**/api/analytics/page-view", (route) => route.abort("failed"));

  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Your peaceful beachfront escape in Anda, Pangasinan",
    }),
  ).toBeVisible();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Amenities" }).click();
  await expect(page).toHaveURL(/\/amenities$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Amenities for a relaxed, self-catered stay" }),
  ).toBeVisible();
});
