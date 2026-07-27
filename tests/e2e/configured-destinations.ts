function normalizeConfiguredHttpsUrl(value: string | undefined) {
  const candidate = value?.trim();

  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeConfiguredPhone(value: string | undefined) {
  const digits = value?.replace(/\D/g, "");
  return digits && /^[1-9]\d{7,14}$/.test(digits) ? `tel:+${digits}` : null;
}

export function normalizeConfiguredWhatsApp(value: string | undefined) {
  const digits = value?.replace(/\D/g, "");
  return digits && /^[1-9]\d{7,14}$/.test(digits) ? `https://wa.me/${digits}` : null;
}

export const configuredAirbnbUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_AIRBNB_URL,
);

export const configuredFacebookUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_FACEBOOK_URL,
);

export const configuredMessengerUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_MESSENGER_URL,
);

export const configuredGoogleMapsUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
);

export const configuredGoogleMapsEmbedUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL,
);

export const configuredWazeUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_WAZE_URL,
);

export const configuredWazeEmbedUrl = normalizeConfiguredHttpsUrl(
  process.env.NEXT_PUBLIC_WAZE_EMBED_URL,
);

export const configuredInteractiveMaps = Boolean(
  configuredGoogleMapsUrl &&
    configuredGoogleMapsEmbedUrl &&
    configuredWazeUrl &&
    configuredWazeEmbedUrl,
);

export const configuredWhatsAppUrl = normalizeConfiguredWhatsApp(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
);

export const configuredCaretakerPhones = [
  normalizeConfiguredPhone(process.env.NEXT_PUBLIC_CARETAKER_NIDA_PHONE),
  normalizeConfiguredPhone(process.env.NEXT_PUBLIC_CARETAKER_EVELYN_PHONE),
].filter((destination): destination is string => Boolean(destination));
