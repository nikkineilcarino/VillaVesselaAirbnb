import "server-only";

/**
 * Creates the privileged server-only Supabase client for validated API handlers.
 * Never import this module into a Client Component or log its configuration.
 */

import { createClient } from "@supabase/supabase-js";

import { getSupabaseProjectUrl } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createServiceRoleSupabaseClient() {
  const supabaseUrl = getSupabaseProjectUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
