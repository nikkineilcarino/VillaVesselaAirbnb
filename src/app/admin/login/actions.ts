"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { adminLoginSchema } from "@/lib/validation/auth";

export type AdminLoginState = {
  message: string;
  status: "error" | "idle";
};

const genericLoginError = "Unable to sign in with those details.";
const unavailableError = "Administrator sign-in is unavailable right now. Please try again later.";

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { message: genericLoginError, status: "error" };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { message: unavailableError, status: "error" };
  }

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    if (signInError) {
      return { message: genericLoginError, status: "error" };
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.auth.signOut({ scope: "local" });
      return { message: genericLoginError, status: "error" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut({ scope: "local" });
      return { message: genericLoginError, status: "error" };
    }
  } catch {
    return { message: unavailableError, status: "error" };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/dashboard");
}
