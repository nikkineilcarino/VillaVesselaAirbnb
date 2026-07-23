import { publicDestinations } from "@/lib/config/publicDestinations";

export const locationPreview = {
  address: "Tondol, Purok 2, Anda, Pangasinan, Philippines",
  directions:
    "From Anda town, continue approximately eight kilometres toward Tondol. When facing the beach, turn right and continue for approximately 150 metres.",
  mapEmbedUrl: publicDestinations.googleMapsEmbed,
  mapUrl: publicDestinations.googleMaps,
  workingListingName: "Beachfront Tondol Beach Villa Vessela",
} as const;
