import { z } from "zod";

import { normalizePublicPath, normalizeReferrer } from "@/lib/analytics/normalization";
import { isApprovedExternalDestination } from "@/lib/config/publicDestinations";
import {
  analyticsBrowserTypes,
  analyticsDeviceTypes,
  externalLinkTypes,
  type LinkClickPayload,
  type PageViewPayload,
} from "@/types/analytics";

const analyticsIdentityShape = {
  anonymousVisitorId: z.uuid(),
  sessionId: z.uuid(),
} as const;

const pageViewRequestSchema = z.strictObject({
  ...analyticsIdentityShape,
  browserType: z.enum(analyticsBrowserTypes),
  deviceType: z.enum(analyticsDeviceTypes),
  path: z.string().min(1).max(128),
  referrer: z.string().max(2048).nullable(),
});

const linkClickRequestSchema = z.strictObject({
  ...analyticsIdentityShape,
  destinationUrl: z.string().min(1).max(2048),
  linkType: z.enum(externalLinkTypes),
  sourcePage: z.string().min(1).max(128),
});

export function parsePageViewPayload(input: unknown): PageViewPayload | null {
  const parsed = pageViewRequestSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const path = normalizePublicPath(parsed.data.path);

  if (!path) {
    return null;
  }

  return {
    anonymousVisitorId: parsed.data.anonymousVisitorId,
    browserType: parsed.data.browserType,
    deviceType: parsed.data.deviceType,
    path,
    referrer: normalizeReferrer(parsed.data.referrer),
    sessionId: parsed.data.sessionId,
  };
}

export function parseLinkClickPayload(input: unknown): LinkClickPayload | null {
  return parseLinkClickPayloadWithApproval(input, isApprovedExternalDestination);
}

export function parseLinkClickPayloadWithApproval(
  input: unknown,
  isApproved: (linkType: LinkClickPayload["linkType"], destination: string) => boolean,
): LinkClickPayload | null {
  const parsed = linkClickRequestSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  const sourcePage = normalizePublicPath(parsed.data.sourcePage);

  if (
    !sourcePage ||
    !isApproved(parsed.data.linkType, parsed.data.destinationUrl)
  ) {
    return null;
  }

  return {
    anonymousVisitorId: parsed.data.anonymousVisitorId,
    destinationUrl: parsed.data.destinationUrl,
    linkType: parsed.data.linkType,
    sessionId: parsed.data.sessionId,
    sourcePage,
  };
}
