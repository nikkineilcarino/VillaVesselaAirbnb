import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { logoAssets } from "@/components/branding/logoAssets";
import { SkipLink } from "@/components/ui/SkipLink";
import {
  siteMetadataDescription,
  socialImageMetadata,
} from "@/lib/seo/metadata";
import {
  getSiteUrl,
  isPublicIndexableSiteUrl,
} from "@/lib/seo/siteUrl";

import "./globals.css";

const siteUrl = getSiteUrl();
const isIndexable = isPublicIndexableSiteUrl(siteUrl);

export const metadata: Metadata = {
  applicationName: "Villa Vessela",
  description: siteMetadataDescription,
  icons: {
    apple: [
      {
        sizes: "180x180",
        type: "image/png",
        url: logoAssets.appleTouchIcon,
      },
    ],
    icon: [
      { type: "image/svg+xml", url: logoAssets.favicon },
      {
        sizes: "any",
        type: "image/svg+xml",
        url: logoAssets.mark.dark,
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  metadataBase: siteUrl,
  openGraph: {
    description: siteMetadataDescription,
    images: [socialImageMetadata],
    locale: "en_PH",
    siteName: "Villa Vessela",
    title: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
    type: "website",
    url: "/",
  },
  referrer: "strict-origin-when-cross-origin",
  robots: isIndexable
    ? {
        follow: true,
        googleBot: {
          follow: true,
          index: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
        index: true,
      }
    : {
        follow: false,
        index: false,
        noarchive: true,
      },
  title: {
    default: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
    template: "%s | Villa Vessela",
  },
  twitter: {
    card: "summary_large_image",
    description: siteMetadataDescription,
    images: [socialImageMetadata.url],
    title: "Villa Vessela — Beachfront stay in Tondol, Pangasinan",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0e5673",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        {children}
      </body>
    </html>
  );
}
