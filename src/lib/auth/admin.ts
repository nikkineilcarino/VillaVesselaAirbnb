import "server-only";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type AdminProfile = Pick<
  Database["public"]["Tables"]["admin_profiles"]["Row"],
  "display_name" | "role" | "user_id"
>;

export type AdminAccess =
  | { status: "authorized"; profile: AdminProfile }
  | { status: "unauthenticated" | "unauthorized" | "unavailable" | "unconfigured" };

/**
 * Performs the authoritative server check for administrator access. Identity
 * comes from Supabase Auth; authorization comes from the protected profile row.
 */
export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { status: "unconfigured" };
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { status: "unauthenticated" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("display_name, role, user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return { status: "unavailable" };
    }

    if (!profile) {
      return { status: "unauthorized" };
    }

    return { profile, status: "authorized" };
  } catch {
    return { status: "unavailable" };
  }
}

export async function requireAdmin() {
  const access = await getAdminAccess();

  if (access.status === "authorized") {
    return access.profile;
  }

  if (access.status === "unavailable" || access.status === "unconfigured") {
    redirect("/admin/login?notice=unavailable");
  }

  if (access.status === "unauthorized") {
    redirect("/admin/login?notice=denied");
  }

  redirect("/admin/login");
}
