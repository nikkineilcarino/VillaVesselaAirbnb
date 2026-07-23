import type { ExternalLinkType } from "@/types/analytics";

export type PublicDestinationEnvironment = {
  airbnbUrl?: null | string;
  contactEmail?: null | string;
  contactPhone?: null | string;
  facebookUrl?: null | string;
  googleMapsEmbedUrl?: null | string;
  googleMapsUrl?: null | string;
  messengerUrl?: null | string;
  whatsappNumber?: null | string;
};

export type PublicDestinationConfig = {
  airbnb: null | string;
  email: null | string;
  facebook: null | string;
  googleMaps: null | string;
  googleMapsEmbed: null | string;
  messenger: null | string;
  phone: null | string;
  whatsapp: null | string;
};

function normalizeHttpsUrl(value: null | string | undefined) {
  const candidate = value?.trim();

  if (!candidate || candidate.length > 2048) {
    return null;
  }

  try {
    const url = new URL(candidate);

    if (url.protocol !== "https:" || url.username || url.password) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function normalizeEmail(value: null | string | undefined) {
  const candidate = value?.trim().toLowerCase();

  if (
    !candidate ||
    candidate.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)
  ) {
    return null;
  }

  return `mailto:${candidate}`;
}

function normalizeInternationalDigits(value: null | string | undefined) {
  const candidate = value?.trim();

  if (!candidate || !/^\+?[\d\s().-]+$/.test(candidate)) {
    return null;
  }

  const digits = candidate.replace(/\D/g, "");

  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function createPublicDestinationConfig(
  environment: PublicDestinationEnvironment,
): PublicDestinationConfig {
  const phoneDigits = normalizeInternationalDigits(environment.contactPhone);
  const whatsappDigits = normalizeInternationalDigits(environment.whatsappNumber);

  return {
    airbnb: normalizeHttpsUrl(environment.airbnbUrl),
    email: normalizeEmail(environment.contactEmail),
    facebook: normalizeHttpsUrl(environment.facebookUrl),
    googleMaps: normalizeHttpsUrl(environment.googleMapsUrl),
    googleMapsEmbed: normalizeHttpsUrl(environment.googleMapsEmbedUrl),
    messenger: normalizeHttpsUrl(environment.messengerUrl),
    phone: phoneDigits ? `tel:+${phoneDigits}` : null,
    whatsapp: whatsappDigits ? `https://wa.me/${whatsappDigits}` : null,
  };
}

export const publicDestinations = createPublicDestinationConfig({
  airbnbUrl: process.env.NEXT_PUBLIC_AIRBNB_URL,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  googleMapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

export function getApprovedExternalDestination(linkType: ExternalLinkType) {
  if (linkType === "google_maps") return publicDestinations.googleMaps;
  if (linkType === "other") return null;

  return publicDestinations[linkType];
}

export function isApprovedExternalDestination(linkType: ExternalLinkType, destination: string) {
  return getApprovedExternalDestination(linkType) === destination;
}
