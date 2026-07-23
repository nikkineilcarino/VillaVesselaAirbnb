"use client";

/**
 * Creates the browser Supabase client only when both public values are configured.
 * RLS remains the authorization boundary; the public anon key is never privileged.
 */

import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabasePublicConfig,
  supabaseAuthCookieOptions,
} from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return null;
  }

  return createBrowserClient<Database>(config.url, config.anonKey, {
    cookieOptions: supabaseAuthCookieOptions,
  });
}
