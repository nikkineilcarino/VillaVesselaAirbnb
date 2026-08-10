import {
  expect,
  test,
  type Page,
  type Request as PlaywrightRequest,
} from "@playwright/test";

import { configuredContactEmail } from "./configured-destinations";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const analyticsFeatureEnabled =
  process.env.ANALYTICS_ENABLED?.trim().toLowerCase() === "true";

async function allowAnalytics(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Help us improve Villa Vessela" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Allow analytics" }).click();
}

test("feature-disabled mode removes legacy IDs and sends no analytics", async ({
  context,
  page,
}) => {
  test.skip(analyticsFeatureEnabled, "Run with ANALYTICS_ENABLED=false.");

  let analyticsRequests = 0;

  await page.addInitScript(() => {
    if (window.top !== window) {
      return;
    }

    localStorage.setItem("vv_analytics_preference", "allowed");
    document.cookie =
      "vv_visitor_id=11111111-1111-4111-8111-111111111111; Path=/; SameSite=Lax";
    sessionStorage.setItem(
      "vv_analytics_session",
      JSON.stringify({
        id: "22222222-2222-4222-8222-222222222222",
        lastActivityAt: Date.now(),
      }),
    );
  });
  await page.route("**/api/analytics/**", async (route) => {
    analyticsRequests += 1;
    await route.fulfill({ status: 204 });
  });

  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(() => ({
        cookie: document.cookie,
        preference: localStorage.getItem("vv_analytics_preference"),
        session: sessionStorage.getItem("vv_analytics_session"),
      })),
    )
    .toEqual({
      cookie: "",
      preference: "allowed",
      session: null,
    });
  await page.waitForTimeout(200);

  expect(analyticsRequests).toBe(0);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  await expect(page.getByRole("button", { name: "Analytics settings" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Allow analytics" })).toHaveCount(0);
});

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
  await expect(
    page.getByRole("heading", { name: "Help us improve Villa Vessela" }),
  ).toBeVisible();
  await page.waitForTimeout(300);
  expect(events).toHaveLength(0);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  expect(
    await page.evaluate(() => sessionStorage.getItem("vv_analytics_session")),
  ).toBeNull();

  await allowAnalytics(page);
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
  await allowAnalytics(page);
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

test("declining clears legacy IDs and re-allowing tracks only the current route", async ({
  context,
  page,
}) => {
  const pageViews: PlaywrightRequest[] = [];
  const linkClicks: PlaywrightRequest[] = [];

  await page.route("**/api/analytics/page-view", async (route) => {
    pageViews.push(route.request());
    await route.fulfill({ status: 202 });
  });
  await page.route("**/api/analytics/link-click", async (route) => {
    linkClicks.push(route.request());
    await route.fulfill({ status: 202 });
  });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Help us improve Villa Vessela" }),
  ).toBeVisible();
  await page.evaluate(() => {
    document.cookie =
      "vv_visitor_id=11111111-1111-4111-8111-111111111111; Path=/; SameSite=Lax";
    sessionStorage.setItem(
      "vv_analytics_session",
      JSON.stringify({
        id: "22222222-2222-4222-8222-222222222222",
        lastActivityAt: Date.now(),
      }),
    );
  });

  await page.getByRole("button", { name: "Decline" }).click();

  expect(
    await page.evaluate(() => localStorage.getItem("vv_analytics_preference")),
  ).toBe("declined");
  expect(
    await page.evaluate(() => sessionStorage.getItem("vv_analytics_session")),
  ).toBeNull();
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  expect(pageViews).toHaveLength(0);
  expect(linkClicks).toHaveLength(0);

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  expect(pageViews).toHaveLength(0);

  if (configuredContactEmail) {
    const emailLink = page.getByRole("link", { name: "Send an email" });
    await expect(emailLink).toHaveAttribute("href", configuredContactEmail);
    await emailLink.evaluate((element) => {
      element.setAttribute("href", "#native-link-after-decline");
    });
    await emailLink.click();
    await expect(page).toHaveURL(/#native-link-after-decline$/);
    expect(linkClicks).toHaveLength(0);
  }

  await page.getByRole("button", { name: "Analytics settings" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => pageViews.length).toBe(1);
  expect(pageViews[0]?.postDataJSON().path).toBe("/contact");
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id")
      ?.value,
  ).toMatch(uuidPattern);

  await page.getByRole("button", { name: "Analytics settings" }).click();
  await page.getByRole("button", { name: "Decline" }).click();
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  expect(
    await page.evaluate(() => sessionStorage.getItem("vv_analytics_session")),
  ).toBeNull();
});

test("a failed decline write cannot resume stale allowed analytics after reload", async ({
  context,
  page,
}) => {
  const pageViews: PlaywrightRequest[] = [];

  await page.addInitScript(() => {
    if (window.top !== window) {
      return;
    }

    if (window.sessionStorage.getItem("vv_test_preference_seeded") !== "true") {
      window.localStorage.setItem("vv_analytics_preference", "allowed");
      window.sessionStorage.setItem("vv_test_preference_seeded", "true");
    }

    const originalSetItem = Storage.prototype.setItem;

    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (key === "vv_analytics_preference") {
        throw new DOMException("Storage is blocked", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.route("**/api/analytics/page-view", async (route) => {
    pageViews.push(route.request());
    await route.fulfill({ status: 202 });
  });

  await page.goto("/");
  await expect.poll(() => pageViews.length).toBe(1);
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeDefined();

  await page.getByRole("button", { name: "Analytics settings" }).click();
  await page.getByRole("button", { name: "Decline" }).click();
  await expect(
    page.getByText(
      "Analytics is off for this visit, but your browser could not remember the choice.",
    ),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("vv_analytics_preference")),
  ).toBeNull();
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  expect(
    await page.evaluate(() => sessionStorage.getItem("vv_analytics_session")),
  ).toBeNull();

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Amenities" })
    .click();
  await expect(page).toHaveURL(/\/amenities$/);
  await page.waitForTimeout(300);
  expect(pageViews).toHaveLength(1);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Help us improve Villa Vessela" }),
  ).toBeVisible();
  await page.waitForTimeout(300);
  expect(pageViews).toHaveLength(1);
  expect(
    await page.evaluate(() => localStorage.getItem("vv_analytics_preference")),
  ).toBeNull();
  expect(
    (await context.cookies()).find((cookie) => cookie.name === "vv_visitor_id"),
  ).toBeUndefined();
  expect(
    await page.evaluate(() => sessionStorage.getItem("vv_analytics_session")),
  ).toBeNull();
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
  await expect(page.getByRole("button", { name: "Analytics settings" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Allow analytics" })).toHaveCount(0);
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
  await allowAnalytics(page);
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
