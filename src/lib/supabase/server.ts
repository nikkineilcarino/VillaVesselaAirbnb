import "server-only";

/**
 * Creates a request-scoped, cookie-aware Supabase server client.
 * It uses the public anon key and therefore cannot bypass RLS.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getSupabasePublicConfig,
  supabaseAuthCookieOptions,
} from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function createServerSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookieOptions: supabaseAuthCookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. The request proxy owns refreshes;
          // Server Actions can write through this same request-scoped adapter.
        }
      },
    },
  });
}
