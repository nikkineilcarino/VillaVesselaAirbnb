import type { MetadataRoute } from "next";

import {
  getSiteUrl,
  isPublicIndexableSiteUrl,
} from "@/lib/seo/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (!isPublicIndexableSiteUrl(siteUrl)) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }

  return {
    host: siteUrl.origin,
    rules: {
      allow: "/",
      disallow: ["/admin/", "/api/"],
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
