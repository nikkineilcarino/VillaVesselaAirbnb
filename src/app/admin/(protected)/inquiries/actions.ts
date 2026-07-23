"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inquiryStatuses } from "@/types/inquiries";

const inquiryIdSchema = z.uuid();
const inquiryStatusSchema = z.enum(inquiryStatuses);

export async function updateInquiryStatus(
  inquiryId: string,
  formData: FormData,
) {
  await requireAdmin();

  const idResult = inquiryIdSchema.safeParse(inquiryId);
  const statusResult = inquiryStatusSchema.safeParse(formData.get("status"));

  if (!idResult.success || !statusResult.success) {
    redirect("/admin/inquiries?notice=invalid");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/inquiries?notice=failed");
  }

  let updated = false;
  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .update({ status: statusResult.data })
      .eq("id", idResult.data)
      .select("id")
      .maybeSingle();
    updated = !error && Boolean(data);
  } catch {
    updated = false;
  }

  if (!updated) {
    redirect("/admin/inquiries?notice=failed");
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  redirect("/admin/inquiries?notice=updated");
}

