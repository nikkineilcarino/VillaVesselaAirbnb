import type { AnonymousAnalyticsIdentity } from "@/types/analytics";

export const ANALYTICS_SESSION_INACTIVITY_MS = 30 * 60 * 1000;
export const ANALYTICS_VISITOR_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
export const ANALYTICS_VISITOR_COOKIE = "vv_visitor_id";
export const ANALYTICS_SESSION_STORAGE_KEY = "vv_analytics_session";

type StoredSession = {
  id: string;
  lastActivityAt: number;
};

let memoryVisitorId: null | string = null;
let memorySession: null | StoredSession = null;

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function createUuid() {
  try {
    return globalThis.crypto?.randomUUID?.() ?? null;
  } catch {
    return null;
  }
}

function readVisitorCookie(cookieValue: string) {
  for (const pair of cookieValue.split(";")) {
    const [name, ...rest] = pair.trim().split("=");
    const value = rest.join("=");

    if (name === ANALYTICS_VISITOR_COOKIE && isUuid(value)) {
      return value;
    }
  }

  return null;
}

export function getOrCreateVisitorId(
  cookieValue: string,
  writeCookie: (value: string) => void,
) {
  const existing = readVisitorCookie(cookieValue);

  if (existing) {
    memoryVisitorId = existing;
    return existing;
  }

  const created = memoryVisitorId ?? createUuid();

  if (!created) {
    return null;
  }

  memoryVisitorId = created;
  try {
    writeCookie(created);
  } catch {
    // A blocked cookie still falls back to this page's in-memory random ID.
  }
  return created;
}

export function resolveSession(
  serialized: null | string,
  now: number,
): StoredSession | null {
  if (serialized) {
    try {
      const parsed = JSON.parse(serialized) as Partial<StoredSession>;

      if (
        typeof parsed.id === "string" &&
        isUuid(parsed.id) &&
        typeof parsed.lastActivityAt === "number" &&
        Number.isFinite(parsed.lastActivityAt) &&
        now >= parsed.lastActivityAt &&
        now - parsed.lastActivityAt <= ANALYTICS_SESSION_INACTIVITY_MS
      ) {
        return { id: parsed.id, lastActivityAt: now };
      }
    } catch {
      // Invalid browser storage is replaced with a new random session below.
    }
  }

  const id = createUuid();
  return id ? { id, lastActivityAt: now } : null;
}

export function getAnonymousAnalyticsIdentity(): AnonymousAnalyticsIdentity | null {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return null;
  }

  let cookieValue = "";
  try {
    cookieValue = document.cookie;
  } catch {
    // Restricted browsing contexts may block cookie reads.
  }

  const visitorId = getOrCreateVisitorId(cookieValue, (created) => {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ANALYTICS_VISITOR_COOKIE}=${created}; Max-Age=${ANALYTICS_VISITOR_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  });

  if (!visitorId) {
    return null;
  }

  const now = Date.now();
  let session: StoredSession | null = null;

  try {
    session = resolveSession(sessionStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY), now);
    if (session) {
      sessionStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    session = resolveSession(memorySession ? JSON.stringify(memorySession) : null, now);
    memorySession = session;
  }

  return session
    ? { anonymousVisitorId: visitorId, sessionId: session.id }
    : null;
}
