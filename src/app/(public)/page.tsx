import type { Metadata } from "next";

import { AboutPreview } from "@/components/home/AboutPreview";
import { AccommodationPreview } from "@/components/home/AccommodationPreview";
import { AmenitiesPreview } from "@/components/home/AmenitiesPreview";
import { AttractionsPreview } from "@/components/home/AttractionsPreview";
import { BookingCTA } from "@/components/home/BookingCTA";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { HeroSection } from "@/components/home/HeroSection";
import { LocationPreview } from "@/components/home/LocationPreview";
import { PropertyHighlights } from "@/components/home/PropertyHighlights";
import { ReviewsPreview } from "@/components/home/ReviewsPreview";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  siteMetadataDescription,
  socialImageMetadata,
} from "@/lib/seo/metadata";
import { createPropertyStructuredData } from "@/lib/seo/structuredData";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: siteMetadataDescription,
  openGraph: {
    description: siteMetadataDescription,
    images: [socialImageMetadata],
    locale: "en_PH",
    siteName: "Villa Vessela",
    title: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
    type: "website",
    url: "/",
  },
  title: {
    absolute: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
  },
  twitter: {
    card: "summary_large_image",
    description: siteMetadataDescription,
    images: [socialImageMetadata.url],
    title: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
  },
};

export default function HomePage() {
  return (
    <main id="main-content">
      <StructuredData data={createPropertyStructuredData()} />
      <HeroSection />
      <TrustIndicators />
      <PropertyHighlights />
      <AboutPreview />
      <AccommodationPreview />
      <AmenitiesPreview />
      <GalleryPreview />
      <ReviewsPreview />
      <LocationPreview />
      <AttractionsPreview />
      <BookingCTA />
    </main>
  );
}
