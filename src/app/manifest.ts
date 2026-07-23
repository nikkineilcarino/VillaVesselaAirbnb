import type { MetadataRoute } from "next";

import { siteMetadataDescription } from "@/lib/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#fbfaf5",
    description: siteMetadataDescription,
    display: "standalone",
    icons: [
      {
        purpose: "any",
        sizes: "192x192",
        src: "/logo/web-app-icon-192.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/logo/web-app-icon-512.png",
        type: "image/png",
      },
    ],
    lang: "en",
    name: "Villa Vessela",
    short_name: "Villa Vessela",
    start_url: "/",
    theme_color: "#0e5673",
  };
}
