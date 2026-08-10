import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  dispatchLinkClick,
  dispatchPageView,
} from "@/lib/analytics/dispatch";
import {
  ANALYTICS_SESSION_INACTIVITY_MS,
  ANALYTICS_SESSION_STORAGE_KEY,
  ANALYTICS_VISITOR_COOKIE,
  clearAnonymousAnalyticsIdentity,
  getAnonymousAnalyticsIdentity,
  isUuid,
  resolveSession,
} from "@/lib/analytics/identifiers";
import {
  classifyBrowser,
  classifyDevice,
  normalizePublicPath,
  normalizeReferrer,
} from "@/lib/analytics/normalization";
import { FixedWindowRateLimiter } from "@/lib/analytics/rateLimit";
import {
  ANALYTICS_PREFERENCE_STORAGE_KEY,
  parseAnalyticsPreference,
} from "@/lib/analytics/preference";
import {
  isSameOriginAnalyticsRequest,
  readBoundedAnalyticsJson,
} from "@/lib/analytics/request";
import {
  createPublicDestinationConfig,
  isApprovedExternalDestination,
} from "@/lib/config/publicDestinations";
import {
  parseLinkClickPayloadWithApproval,
  parsePageViewPayload,
} from "@/lib/validation/analytics";
import { trackablePublicPaths } from "@/types/analytics";

const visitorId = "11111111-1111-4111-8111-111111111111";
const sessionId = "22222222-2222-4222-8222-222222222222";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Phase 8 analytics privacy and validation", () => {
  it("allows only implemented public paths and strips a trailing slash", () => {
    expect(normalizePublicPath("/guest-guide/")).toBe("/guest-guide");
    expect(normalizePublicPath("/")).toBe("/");
    expect(normalizePublicPath("/admin/dashboard")).toBeNull();
    expect(normalizePublicPath("/contact?email=private")).toBeNull();
    expect(normalizePublicPath("//example.invalid")).toBeNull();
    expect(trackablePublicPaths).not.toContain("/admin/login");
  });

  it("reduces valid referrers to origins and rejects unsafe values", () => {
    expect(normalizeReferrer("https://search.example/path?q=sensitive#result")).toBe(
      "https://search.example",
    );
    expect(normalizeReferrer("https://name:password@example.invalid/path")).toBeNull();
    expect(normalizeReferrer("javascript:alert(1)")).toBeNull();
    expect(normalizeReferrer(null)).toBeNull();
  });

  it("classifies only coarse browser and device categories", () => {
    expect(classifyBrowser("Mozilla/5.0 Edg/125.0")).toBe("edge");
    expect(classifyBrowser("Mozilla/5.0 Chrome/125.0 Safari/537.36")).toBe("chrome");
    expect(classifyBrowser("Mozilla/5.0 Version/17.5 Safari/605.1.15")).toBe("safari");
    expect(classifyDevice("Mozilla/5.0 (iPad; CPU OS 17_0)")).toBe("tablet");
    expect(classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile")).toBe("mobile");
    expect(classifyDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
  });

  it("keeps an active random session and rotates an inactive one", () => {
    const now = 2_000_000;
    const active = resolveSession(
      JSON.stringify({ id: sessionId, lastActivityAt: now - ANALYTICS_SESSION_INACTIVITY_MS }),
      now,
    );
    const inactive = resolveSession(
      JSON.stringify({ id: sessionId, lastActivityAt: now - ANALYTICS_SESSION_INACTIVITY_MS - 1 }),
      now,
    );

    expect(active).toEqual({ id: sessionId, lastActivityAt: now });
    expect(inactive?.id).not.toBe(sessionId);
    expect(isUuid(inactive?.id ?? "")).toBe(true);
  });

  it("recognizes only an explicit stored analytics preference", () => {
    expect(parseAnalyticsPreference("allowed")).toBe("allowed");
    expect(parseAnalyticsPreference("declined")).toBe("declined");
    expect(parseAnalyticsPreference(null)).toBeNull();
    expect(parseAnalyticsPreference("true")).toBeNull();
    expect(parseAnalyticsPreference("ALLOW")).toBeNull();
    expect(ANALYTICS_PREFERENCE_STORAGE_KEY).toBe("vv_analytics_preference");
  });

  it("does not create an identity when explicit analytics consent is absent", () => {
    const cookieRead = vi.fn().mockReturnValue("");
    const sessionRead = vi.fn();
    const documentMock = {} as { cookie: string };

    Object.defineProperty(documentMock, "cookie", {
      configurable: true,
      get: cookieRead,
      set: vi.fn(),
    });
    vi.stubGlobal("document", documentMock);
    vi.stubGlobal("window", {
      localStorage: { getItem: vi.fn().mockReturnValue(null) },
      sessionStorage: { getItem: sessionRead },
    });

    expect(getAnonymousAnalyticsIdentity()).toBeNull();
    expect(cookieRead).not.toHaveBeenCalled();
    expect(sessionRead).not.toHaveBeenCalled();
  });

  it("expires the visitor cookie and removes session state during cleanup", () => {
    let cookieWrite = "";
    const sessionRemove = vi.fn();
    const documentMock = {} as { cookie: string };

    Object.defineProperty(documentMock, "cookie", {
      configurable: true,
      get: vi.fn().mockReturnValue(""),
      set: (value: string) => {
        cookieWrite = value;
      },
    });
    vi.stubGlobal("document", documentMock);
    vi.stubGlobal("window", {
      location: { protocol: "https:" },
      sessionStorage: { removeItem: sessionRemove },
    });

    clearAnonymousAnalyticsIdentity();

    expect(cookieWrite).toContain(`${ANALYTICS_VISITOR_COOKIE}=`);
    expect(cookieWrite).toContain("Max-Age=0");
    expect(cookieWrite).toContain("Path=/");
    expect(cookieWrite).toContain("Secure");
    expect(sessionRemove).toHaveBeenCalledWith(ANALYTICS_SESSION_STORAGE_KEY);
  });

  it("normalizes only safe configured public destinations", () => {
    const config = createPublicDestinationConfig({
      airbnbUrl: " https://www.airbnb.example/listing/123 ",
      caretakerNidaPhone: "+63 900 000 0002",
      contactEmail: "Host@Example.invalid",
      contactPhone: "+63 (900) 000-0000",
      facebookUrl: "https://www.facebook.com/approved-page",
      googleMapsEmbedUrl:
        "https://www.google.com/maps?q=place_id%3Aapproved&z=17&output=embed",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Approved&query_place_id=approved",
      messengerUrl: "https://www.messenger.com/t/1234567890",
      wazeEmbedUrl: "https://embed.waze.com/iframe?zoom=17&lat=16.1&lon=120.1&pin=1",
      wazeUrl: "https://www.waze.com/ul?ll=16.1%2C120.1&navigate=yes&zoom=17",
      whatsappNumber: "+63 900 000 0000",
    });

    expect(config.airbnb).toBe("https://www.airbnb.example/listing/123");
    expect(config.caretakerNidaPhone).toBe("tel:+639000000002");
    expect(config.email).toBe("mailto:host@example.invalid");
    expect(config.phone).toBe("tel:+639000000000");
    expect(config.whatsapp).toBe("https://wa.me/639000000000");
    expect(config.googleMaps).toBe(
      "https://www.google.com/maps/search/?api=1&query=Approved&query_place_id=approved",
    );
    expect(config.googleMapsEmbed).toBe(
      "https://www.google.com/maps?q=place_id%3Aapproved&z=17&output=embed",
    );
    expect(config.waze).toBe(
      "https://www.waze.com/ul?ll=16.1%2C120.1&navigate=yes&zoom=17",
    );
    expect(config.wazeEmbed).toBe(
      "https://embed.waze.com/iframe?zoom=17&lat=16.1&lon=120.1&pin=1",
    );
    expect(config.facebook).toBe("https://www.facebook.com/approved-page");
    expect(config.messenger).toBe("https://www.messenger.com/t/1234567890");
    expect(isApprovedExternalDestination("phone", "tel:+639000000002", config)).toBe(true);
    expect(isApprovedExternalDestination("phone", "tel:+639000000001", config)).toBe(false);
    expect(isApprovedExternalDestination("phone", "tel:+639000000003", config)).toBe(false);
    expect(
      isApprovedExternalDestination(
        "waze",
        "https://www.waze.com/ul?ll=16.1%2C120.1&navigate=yes&zoom=17",
        config,
      ),
    ).toBe(true);
    expect(
      isApprovedExternalDestination(
        "waze",
        "https://www.google.com/maps/search/?api=1&query=Approved&query_place_id=approved",
        config,
      ),
    ).toBe(false);
    expect(
      isApprovedExternalDestination(
        "facebook",
        "https://www.facebook.com/approved-page",
        config,
      ),
    ).toBe(true);
    expect(
      isApprovedExternalDestination(
        "messenger",
        "https://www.messenger.com/t/1234567890",
        config,
      ),
    ).toBe(true);
  });

  it("rejects arbitrary or mismatched map and iframe hosts", () => {
    const config = createPublicDestinationConfig({
      googleMapsEmbedUrl: "https://attacker.example/maps?output=embed",
      googleMapsUrl: "https://attacker.example/maps/place/villa",
      wazeEmbedUrl: "https://www.waze.com/iframe?lat=16&lon=120",
      wazeUrl: "https://embed.waze.com/iframe?lat=16&lon=120",
    });

    expect(config.googleMaps).toBeNull();
    expect(config.googleMapsEmbed).toBeNull();
    expect(config.waze).toBeNull();
    expect(config.wazeEmbed).toBeNull();
  });

  it("accepts a minimized page view and rejects extra/admin fields", () => {
    const valid = parsePageViewPayload({
      anonymousVisitorId: visitorId,
      browserType: "chrome",
      deviceType: "desktop",
      path: "/contact/",
      referrer: "https://search.example/private/path?q=value",
      sessionId,
    });

    expect(valid).toEqual({
      anonymousVisitorId: visitorId,
      browserType: "chrome",
      deviceType: "desktop",
      path: "/contact",
      referrer: "https://search.example",
      sessionId,
    });
    expect(
      parsePageViewPayload({ ...valid, exactGps: "not permitted" }),
    ).toBeNull();
    expect(parsePageViewPayload({ ...valid, path: "/admin/dashboard" })).toBeNull();
  });

  it("requires an exact configured link type and destination", () => {
    const input = {
      anonymousVisitorId: visitorId,
      destinationUrl: "https://approved.example/listing",
      linkType: "airbnb",
      sessionId,
      sourcePage: "/",
    };

    expect(
      parseLinkClickPayloadWithApproval(
        input,
        (type, destination) =>
          type === "airbnb" && destination === "https://approved.example/listing",
      ),
    ).toEqual(input);
    expect(parseLinkClickPayloadWithApproval(input, () => false)).toBeNull();
    expect(
      parseLinkClickPayloadWithApproval({ ...input, sourcePage: "/admin/login" }, () => true),
    ).toBeNull();
  });

  it("bounds JSON request media type and size before parsing", async () => {
    const valid = await readBoundedAnalyticsJson(
      new Request("https://example.invalid/api", {
        body: JSON.stringify({ value: true }),
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
      }),
    );
    const wrongType = await readBoundedAnalyticsJson(
      new Request("https://example.invalid/api", {
        body: "value=true",
        headers: { "Content-Type": "text/plain" },
        method: "POST",
      }),
    );
    const tooLarge = await readBoundedAnalyticsJson(
      new Request("https://example.invalid/api", {
        body: JSON.stringify({ value: "x".repeat(5000) }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(valid).toEqual({ data: { value: true }, status: "ok" });
    expect(wrongType.status).toBe("unsupported-media");
    expect(tooLarge.status).toBe("too-large");
  });

  it("rejects cross-origin browser analytics requests", () => {
    expect(
      isSameOriginAnalyticsRequest(
        new Request("https://villa.example/api/analytics/page-view", {
          headers: { Origin: "https://villa.example", "Sec-Fetch-Site": "same-origin" },
        }),
      ),
    ).toBe(true);
    expect(
      isSameOriginAnalyticsRequest(
        new Request("https://villa.example/api/analytics/page-view", {
          headers: { Origin: "https://attacker.example", "Sec-Fetch-Site": "cross-site" },
        }),
      ),
    ).toBe(false);
  });

  it("enforces a bounded fixed window and fails closed when key capacity is full", () => {
    const limiter = new FixedWindowRateLimiter({ limit: 2, maxKeys: 1, windowMs: 1000 });

    expect(limiter.allow("visitor-a", 0)).toBe(true);
    expect(limiter.allow("visitor-a", 1)).toBe(true);
    expect(limiter.allow("visitor-a", 2)).toBe(false);
    expect(limiter.allow("visitor-b", 2)).toBe(false);
    expect(limiter.allow("visitor-b", 1000)).toBe(true);
  });

  it("requires consent, then uses sendBeacon and never throws when delivery fails", () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const sendBeacon = vi.fn().mockReturnValue(false);
    const getItem = vi.fn().mockReturnValue(null);
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("window", { localStorage: { getItem } });

    expect(() =>
      dispatchLinkClick({
        anonymousVisitorId: visitorId,
        destinationUrl: "https://approved.example/listing",
        linkType: "airbnb",
        sessionId,
        sourcePage: "/",
      }),
    ).not.toThrow();
    expect(() =>
      dispatchPageView({
        anonymousVisitorId: visitorId,
        browserType: "chrome",
        deviceType: "desktop",
        path: "/",
        referrer: null,
        sessionId,
      }),
    ).not.toThrow();
    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    getItem.mockReturnValue("allowed");
    expect(() =>
      dispatchLinkClick({
        anonymousVisitorId: visitorId,
        destinationUrl: "https://approved.example/listing",
        linkType: "airbnb",
        sessionId,
        sourcePage: "/",
      }),
    ).not.toThrow();
    expect(sendBeacon).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ keepalive: true, method: "POST" });
  });

  it("keeps server endpoints free of raw IP and payload logging", () => {
    const root = process.cwd();
    const source = [
      join(root, "src", "app", "api", "analytics", "page-view", "route.ts"),
      join(root, "src", "app", "api", "analytics", "link-click", "route.ts"),
      join(root, "src", "lib", "analytics", "server.ts"),
    ]
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(/x-forwarded-for|request\.ip|clientIp|remoteAddress/i);
    expect(source).not.toMatch(/console\.(?:log|error)\s*\(/);
    expect(source).not.toMatch(/JSON\.stringify\s*\(\s*(?:payload|body|request)/);
    expect(source).toContain("createServiceRoleSupabaseClient");
  });
});
