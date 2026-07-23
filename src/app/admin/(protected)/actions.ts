"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    try {
      const { data } = await supabase.auth.getClaims();

      if (data?.claims?.sub) {
        await supabase.auth.signOut();
      }
    } catch {
      // Logout remains non-revealing; the redirect discards access to protected UI.
    }
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login?notice=signed-out");
}
