import type { MetadataRoute } from "next";

import { logoAssets } from "@/components/branding/logoAssets";
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
        src: logoAssets.webAppIcon192,
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: logoAssets.webAppIcon512,
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
