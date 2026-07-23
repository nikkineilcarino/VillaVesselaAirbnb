import { FixedWindowRateLimiter } from "@/lib/rateLimit";

export { FixedWindowRateLimiter } from "@/lib/rateLimit";

const oneMinute = 60_000;
const pageVisitorLimiter = new FixedWindowRateLimiter({
  limit: 60,
  maxKeys: 10_000,
  windowMs: oneMinute,
});
const linkVisitorLimiter = new FixedWindowRateLimiter({
  limit: 30,
  maxKeys: 10_000,
  windowMs: oneMinute,
});
const pageGlobalLimiter = new FixedWindowRateLimiter({
  limit: 600,
  maxKeys: 1,
  windowMs: oneMinute,
});
const linkGlobalLimiter = new FixedWindowRateLimiter({
  limit: 300,
  maxKeys: 1,
  windowMs: oneMinute,
});

export function allowAnalyticsEvent(
  kind: "link-click" | "page-view",
  anonymousVisitorId: string,
) {
  const visitorLimiter = kind === "page-view" ? pageVisitorLimiter : linkVisitorLimiter;

  return visitorLimiter.allow(anonymousVisitorId);
}

export function allowAnalyticsRequest(kind: "link-click" | "page-view") {
  const globalLimiter = kind === "page-view" ? pageGlobalLimiter : linkGlobalLimiter;

  return globalLimiter.allow("all");
}
