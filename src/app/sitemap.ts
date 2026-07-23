import type { MetadataRoute } from "next";

import { publicSeoPaths } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";

const phaseElevenUpdatedAt = new Date("2026-07-23T00:00:00+08:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicSeoPaths.map((path) => ({
    changeFrequency: path === "/" ? "weekly" : "monthly",
    lastModified: phaseElevenUpdatedAt,
    priority: path === "/" ? 1 : path === "/privacy" ? 0.4 : 0.7,
    url: new URL(path, siteUrl).toString(),
  }));
}
