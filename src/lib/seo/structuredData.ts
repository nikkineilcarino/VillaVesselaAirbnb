import { reviewSummary } from "@/data/reviews";
import { siteConfig } from "@/data/site";
import { getAbsoluteSiteUrl } from "@/lib/seo/siteUrl";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function createBreadcrumbStructuredData(
  currentPage: string,
  currentPath: `/${string}`,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: getAbsoluteSiteUrl("/"),
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: getAbsoluteSiteUrl(currentPath),
        name: currentPage,
        position: 2,
      },
    ],
  };
}

export function createPropertyStructuredData() {
  return {
    "@context": "https://schema.org",
    "@id": `${getAbsoluteSiteUrl("/")}#property`,
    "@type": "LodgingBusiness",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PH",
      addressLocality: "Anda",
      addressRegion: "Pangasinan",
      streetAddress: "Purok 2, Tondol",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      bestRating: 5,
      ratingCount: reviewSummary.count,
      ratingValue: reviewSummary.rating,
      worstRating: 1,
    },
    amenityFeature: [
      "Air conditioning",
      "Beach access",
      "Kitchen",
      "Microwave",
      "Patio or balcony",
      "Secure parking",
      "Television",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    containsPlace: {
      "@type": "Accommodation",
      numberOfBathroomsTotal: 1,
      numberOfBedrooms: 2,
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: 10,
        value: 10,
      },
    },
    description: siteConfig.description,
    name: siteConfig.shortName,
    url: getAbsoluteSiteUrl("/"),
  };
}
