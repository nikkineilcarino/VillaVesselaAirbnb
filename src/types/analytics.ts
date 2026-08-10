export const analyticsBrowserTypes = [
  "chrome",
  "safari",
  "firefox",
  "edge",
  "other",
  "unknown",
] as const;

export const analyticsDeviceTypes = ["mobile", "tablet", "desktop", "unknown"] as const;

export const externalLinkTypes = [
  "airbnb",
  "facebook",
  "messenger",
  "google_maps",
  "waze",
  "whatsapp",
  "phone",
  "email",
  "other",
] as const;

export const trackablePublicPaths = [
  "/",
  "/accommodation",
  "/amenities",
  "/contact",
  "/gallery",
  "/guest-guide",
  "/location",
  "/privacy",
  "/reviews",
] as const;

export type AnalyticsBrowserType = (typeof analyticsBrowserTypes)[number];
export type AnalyticsDeviceType = (typeof analyticsDeviceTypes)[number];
export type ExternalLinkType = (typeof externalLinkTypes)[number];
export type TrackablePublicPath = (typeof trackablePublicPaths)[number];

export type AnonymousAnalyticsIdentity = {
  anonymousVisitorId: string;
  sessionId: string;
};

export type PageViewPayload = AnonymousAnalyticsIdentity & {
  browserType: AnalyticsBrowserType;
  deviceType: AnalyticsDeviceType;
  path: TrackablePublicPath;
  referrer: string | null;
};

export type LinkClickPayload = AnonymousAnalyticsIdentity & {
  destinationUrl: string;
  linkType: ExternalLinkType;
  sourcePage: TrackablePublicPath;
};
