import { publicDestinations } from "@/lib/config/publicDestinations";

export const siteConfig = {
  address: {
    country: "Philippines",
    locality: "Anda, Pangasinan",
    street: "Tondol, Purok 2",
  },
  booking: {
    airbnbUrl: publicDestinations.airbnb,
    contactEmail: publicDestinations.email,
    contactPhone: publicDestinations.phone,
    facebookUrl: publicDestinations.facebook,
    googleMapsUrl: publicDestinations.googleMaps,
    messengerUrl: publicDestinations.messenger,
    whatsappUrl: publicDestinations.whatsapp,
  },
  caretakers: {
    nidaPhone: publicDestinations.caretakerNidaPhone,
  },
  checkIn: "After 1:00 PM",
  checkOut: "Before 11:00 AM",
  description:
    "A serene beachfront retreat overlooking the powdery white sand of Tondol Beach, with a spacious front yard and tropical garden inside a private compound in Anda, Pangasinan.",
  hero: {
    description:
      "Relax in a private tropical compound just a one-minute walk from the sandy shores of Tondol Beach.",
    eyebrow: "Beachfront Tondol Beach",
    headline: "Your peaceful beachfront escape in Anda, Pangasinan",
  },
  name: "Beachfront Tondol Beach Villa Vessela",
  shortName: "Villa Vessela",
  showCaretakerContactsPublicly: Boolean(publicDestinations.caretakerNidaPhone),
} as const;

export const trustIndicators = [
  { label: "Airbnb rating", value: "4.76 / 5" },
  { label: "Airbnb reviews", value: "21" },
  { label: "Host recognition", value: "Superhost" },
  { label: "Hosting experience", value: "11 years" },
  { label: "Beach access", value: "Under 100 m" },
  { label: "Parking", value: "Free & secure" },
] as const;
