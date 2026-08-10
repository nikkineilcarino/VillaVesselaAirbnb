import type {
  AnalyticsBrowserType,
  AnalyticsDeviceType,
  ExternalLinkType,
} from "@/types/analytics";

export const dashboardRangePresets = ["today", "7d", "30d", "month", "custom"] as const;

export type DashboardRangePreset = (typeof dashboardRangePresets)[number];

export type DashboardDateRange = {
  endDate: string;
  endExclusiveUtc: string;
  label: string;
  preset: DashboardRangePreset;
  startDate: string;
  startUtc: string;
  today: string;
};

export type AnalyticsOperationalState =
  | "activity"
  | "disabled"
  | "healthy-no-data"
  | "storage-unavailable";

export type DashboardOperationalStatus = {
  collectionEnabled: boolean;
  lastLinkClickAt: string | null;
  lastPageViewAt: string | null;
  refreshedAt: string;
  reportingAvailable: boolean;
  storageConfigured: boolean;
};

export type DashboardSummary = {
  airbnbClicks: number;
  clickThroughRate: number;
  estimatedUniqueVisitors: number;
  facebookClicks: number;
  googleMapsClicks: number;
  hasDemonstrationData: boolean;
  newInquiries: number;
  sessions: number;
  totalExternalLinkClicks: number;
  totalPageViews: number;
  uniqueClickingVisitors: number;
  whatsappClicks: number;
};

export type DailyAnalyticsPoint = {
  date: string;
  label: string;
  pageViews: number;
  uniqueVisitors: number;
};

export type DashboardLinkTotal = {
  label: string;
  linkType: ExternalLinkType;
  total: number;
};

export type DashboardDeviceTotal = {
  deviceType: AnalyticsDeviceType;
  label: string;
  total: number;
};

export type DashboardPageTotal = {
  path: string;
  total: number;
};

export type RecentPageActivity = {
  browser: AnalyticsBrowserType;
  device: AnalyticsDeviceType;
  occurredAt: string;
  path: string;
  referrer: string;
  visitorLabel: string;
};

export type RecentLinkActivity = {
  linkType: ExternalLinkType;
  occurredAt: string;
  sourcePage: string;
  visitorLabel: string;
};

export type RecentInquiry = {
  contactMethod: string;
  guestCount: number | null;
  name: string;
  occurredAt: string;
  preferredDates: string;
  status: "closed" | "contacted" | "new" | "reviewed" | "spam";
};

export type DashboardData = {
  daily: DailyAnalyticsPoint[];
  devices: DashboardDeviceTotal[];
  links: DashboardLinkTotal[];
  pages: DashboardPageTotal[];
  recentInquiries: RecentInquiry[];
  recentLinks: RecentLinkActivity[];
  recentPages: RecentPageActivity[];
  summary: DashboardSummary;
};
