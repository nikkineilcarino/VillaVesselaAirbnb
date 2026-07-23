export type SupabasePublicConfig = {
  anonKey: string;
  url: string;
};

export const supabaseAuthCookieOptions = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

export function getSupabaseProjectUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    return null;
  }

  try {
    const parsedUrl = new URL(value);
    const isLocal = parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";

    if (parsedUrl.protocol !== "https:" && !(isLocal && parsedUrl.protocol === "http:")) {
      return null;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Returns the browser-safe Supabase values only when both are present and the
 * endpoint uses HTTPS (or the documented local development hosts).
 */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = getSupabaseProjectUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
}
