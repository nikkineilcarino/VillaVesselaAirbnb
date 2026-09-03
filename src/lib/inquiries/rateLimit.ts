import { FixedWindowRateLimiter } from "@/lib/rateLimit";

const inquiryClientLimiter = new FixedWindowRateLimiter({
  limit: 3,
  maxKeys: 10_000,
  windowMs: 60 * 60_000,
});
const inquiryGlobalLimiter = new FixedWindowRateLimiter({
  limit: 60,
  maxKeys: 1,
  windowMs: 60_000,
});

export function allowInquiryRequest() {
  return inquiryGlobalLimiter.consume("all");
}

export function allowInquirySubmission(clientId: string) {
  return inquiryClientLimiter.consume(clientId);
}
