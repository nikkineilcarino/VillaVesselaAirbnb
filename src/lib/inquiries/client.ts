const INQUIRY_CLIENT_KEY = "vv_inquiry_client_id";
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let memoryClientId: string | null = null;

function generateUuid() {
  try {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
    const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  } catch {
    return null;
  }
}

export function getInquiryClientId() {
  try {
    const existing = sessionStorage.getItem(INQUIRY_CLIENT_KEY);
    if (existing && uuidPattern.test(existing)) {
      memoryClientId = existing;
      return existing;
    }
  } catch {
    // The in-memory fallback keeps the form usable when storage is unavailable.
  }

  if (memoryClientId && uuidPattern.test(memoryClientId)) {
    return memoryClientId;
  }

  const generated = generateUuid();
  if (!generated) {
    return null;
  }

  memoryClientId = generated;
  try {
    sessionStorage.setItem(INQUIRY_CLIENT_KEY, generated);
  } catch {
    // No identifier is logged or persisted when storage is unavailable.
  }

  return generated;
}

