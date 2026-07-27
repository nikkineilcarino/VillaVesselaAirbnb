import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

export const siteMetadataDescription =
  "Stay at Villa Vessela, a peaceful family-friendly beachfront villa in Tondol, Anda, Pangasinan, with beach access, private parking, a tropical garden, and standard accommodation for up to 10 guests.";

export const socialImageMetadata = {
  alt: "Villa Vessela floral photo wall at Tondol Beach with the property name and coastal-stay message",
  height: 630,
  url: "/opengraph-image",
  width: 1200,
} as const;

export const publicSeoPaths = [
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

type PageMetadataInput = {
  description: string;
  path: `/${string}` | "/";
  title: string;
};

export function createPageMetadata({
  description,
  path,
  title,
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} | ${siteConfig.shortName}`;

  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      description,
      images: [socialImageMetadata],
      locale: "en_PH",
      siteName: siteConfig.shortName,
      title: socialTitle,
      type: "website",
      url: path,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [socialImageMetadata.url],
      title: socialTitle,
    },
  };
}
