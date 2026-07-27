import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  createPageMetadata,
  publicSeoPaths,
  socialImageMetadata,
} from "@/lib/seo/metadata";
import {
  getSiteUrl,
  isPublicIndexableSiteUrl,
  parseCanonicalSiteUrl,
} from "@/lib/seo/siteUrl";
import {
  createBreadcrumbStructuredData,
  createPropertyStructuredData,
  serializeJsonLd,
} from "@/lib/seo/structuredData";
import { trackablePublicPaths } from "@/types/analytics";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Phase 11 SEO and privacy-safe public metadata", () => {
  it("accepts only a canonical HTTPS origin or documented local HTTP origin", () => {
    expect(parseCanonicalSiteUrl("https://villa.example/")?.toString()).toBe(
      "https://villa.example/",
    );
    expect(parseCanonicalSiteUrl("http://localhost:3000/")?.toString()).toBe(
      "http://localhost:3000/",
    );
    expect(parseCanonicalSiteUrl("http://127.0.0.1:3000/")?.toString()).toBe(
      "http://127.0.0.1:3000/",
    );
    expect(parseCanonicalSiteUrl("http://villa.example/")).toBeNull();
    expect(parseCanonicalSiteUrl("https://user:secret@villa.example/")).toBeNull();
    expect(parseCanonicalSiteUrl("https://villa.example/private")).toBeNull();
    expect(parseCanonicalSiteUrl("https://villa.example/?query=value")).toBeNull();
  });

  it("fails safely to a non-indexable local origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "javascript:alert(1)");
    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
    expect(isPublicIndexableSiteUrl()).toBe(false);
    expect(isPublicIndexableSiteUrl(new URL("https://villa.example/"))).toBe(true);
    expect(isPublicIndexableSiteUrl(new URL("https://example.invalid/"))).toBe(false);
  });

  it("keeps sitemap, analytics, canonical, Open Graph, and Twitter paths aligned", () => {
    expect([...publicSeoPaths].sort()).toEqual([...trackablePublicPaths].sort());

    const metadata = createPageMetadata({
      description: "A bounded description.",
      path: "/privacy",
      title: "Privacy",
    });

    expect(metadata.alternates?.canonical).toBe("/privacy");
    expect(metadata.openGraph).toMatchObject({
      description: "A bounded description.",
      title: "Privacy | Villa Vessela",
      url: "/privacy",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Privacy | Villa Vessela",
    });
    expect(socialImageMetadata).toMatchObject({
      height: 630,
      url: "/opengraph-image",
      width: 1200,
    });
    expect(socialImageMetadata.alt).toContain("Villa Vessela floral photo wall");
    expect(socialImageMetadata.alt).not.toMatch(/placeholder|pending/i);
  });

  it("publishes only verified property facts and no placeholder/contact/location inventions", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://villa.example/");
    const data = createPropertyStructuredData();
    const serialized = JSON.stringify(data);

    expect(data).toMatchObject({
      "@type": "LodgingBusiness",
      address: {
        addressCountry: "PH",
        addressLocality: "Anda",
        addressRegion: "Pangasinan",
        streetAddress: "Purok 2, Tondol",
      },
      aggregateRating: {
        ratingCount: 21,
        ratingValue: 4.76,
      },
      containsPlace: {
        numberOfBathroomsTotal: 1,
        numberOfBedrooms: 2,
        occupancy: { value: 10 },
      },
      name: "Villa Vessela",
    });
    expect(serialized).not.toMatch(
      /placeholder|image|telephone|email|geo|latitude|longitude|hasMap|kubo|cottage|13/,
    );
  });

  it("emits absolute two-level breadcrumbs and escapes script-breaking markup", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://villa.example/");
    expect(createBreadcrumbStructuredData("Privacy", "/privacy")).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { item: "https://villa.example/", name: "Home", position: 1 },
        {
          item: "https://villa.example/privacy",
          name: "Privacy",
          position: 2,
        },
      ],
    });
    expect(serializeJsonLd({ value: "</script><script>alert(1)</script>" })).toBe(
      '{"value":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}',
    );
  });

  it("generates bounded system routes and blocks indexing without public HTTPS configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(JSON.stringify(robots())).toContain('"disallow":"/"');

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://villa.example/");
    const productionRobots = JSON.stringify(robots());
    expect(productionRobots).toContain('"allow":"/"');
    expect(productionRobots).toContain('"/admin/"');
    expect(productionRobots).toContain('"/api/"');
    expect(productionRobots).toContain(
      '"sitemap":"https://villa.example/sitemap.xml"',
    );

    const sitemapOutput = sitemap();
    expect(sitemapOutput).toHaveLength(publicSeoPaths.length);
    expect(sitemapOutput.map((entry) => entry.url)).toEqual(
      publicSeoPaths.map((path) => new URL(path, "https://villa.example/").toString()),
    );
    expect(sitemapOutput.some((entry) => entry.url.includes("/admin"))).toBe(false);

    expect(manifest()).toMatchObject({
      background_color: "#fbfaf5",
      display: "standalone",
      name: "Villa Vessela",
      start_url: "/",
      theme_color: "#0e5673",
    });
  });

  it("defines a restrictive global header baseline and explicit static-asset caching", () => {
    const source = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

    for (const marker of [
      "Content-Security-Policy",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "Permissions-Policy",
      "Referrer-Policy",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Strict-Transport-Security",
      "stale-while-revalidate",
    ]) {
      expect(source).toContain(marker);
    }
    expect(source).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });
});
