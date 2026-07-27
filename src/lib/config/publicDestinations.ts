import type { ExternalLinkType } from "@/types/analytics";

export type PublicDestinationEnvironment = {
  airbnbUrl?: null | string;
  caretakerEvelynPhone?: null | string;
  caretakerNidaPhone?: null | string;
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
  caretakerEvelynPhone: null | string;
  caretakerNidaPhone: null | string;
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
  const caretakerEvelynPhoneDigits = normalizeInternationalDigits(
    environment.caretakerEvelynPhone,
  );
  const caretakerNidaPhoneDigits = normalizeInternationalDigits(
    environment.caretakerNidaPhone,
  );
  const phoneDigits = normalizeInternationalDigits(environment.contactPhone);
  const whatsappDigits = normalizeInternationalDigits(environment.whatsappNumber);

  return {
    airbnb: normalizeHttpsUrl(environment.airbnbUrl),
    caretakerEvelynPhone: caretakerEvelynPhoneDigits
      ? `tel:+${caretakerEvelynPhoneDigits}`
      : null,
    caretakerNidaPhone: caretakerNidaPhoneDigits
      ? `tel:+${caretakerNidaPhoneDigits}`
      : null,
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
  caretakerEvelynPhone: process.env.NEXT_PUBLIC_CARETAKER_EVELYN_PHONE,
  caretakerNidaPhone: process.env.NEXT_PUBLIC_CARETAKER_NIDA_PHONE,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  googleMapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

export function getApprovedExternalDestinations(
  linkType: ExternalLinkType,
  config: PublicDestinationConfig = publicDestinations,
) {
  if (linkType === "google_maps") return config.googleMaps ? [config.googleMaps] : [];
  if (linkType === "other") return [];
  if (linkType === "phone") {
    return [config.phone, config.caretakerNidaPhone, config.caretakerEvelynPhone].filter(
      (destination): destination is string => Boolean(destination),
    );
  }

  const destination = config[linkType];
  return destination ? [destination] : [];
}

export function getApprovedExternalDestination(linkType: ExternalLinkType) {
  return getApprovedExternalDestinations(linkType)[0] ?? null;
}

export function isApprovedExternalDestination(
  linkType: ExternalLinkType,
  destination: string,
  config: PublicDestinationConfig = publicDestinations,
) {
  return getApprovedExternalDestinations(linkType, config).includes(destination);
}
