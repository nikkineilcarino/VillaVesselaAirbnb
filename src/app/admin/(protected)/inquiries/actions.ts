"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/admin";
import { isContactInquiryVisible } from "@/lib/config/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { inquiryStatuses } from "@/types/inquiries";

const inquiryIdSchema = z.uuid();
const inquiryStatusSchema = z.enum(inquiryStatuses);
const inquiryDeleteConfirmationSchema = z.literal("delete");

function requireVisibleInquirySurface() {
  if (!isContactInquiryVisible()) {
    notFound();
  }
}

export async function updateInquiryStatus(
  inquiryId: string,
  formData: FormData,
) {
  requireVisibleInquirySurface();
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

export async function deleteInquiry(
  inquiryId: string,
  formData: FormData,
) {
  requireVisibleInquirySurface();
  await requireAdmin();

  const idResult = inquiryIdSchema.safeParse(inquiryId);
  const confirmationResult = inquiryDeleteConfirmationSchema.safeParse(
    formData.get("confirmation"),
  );

  if (!idResult.success || !confirmationResult.success) {
    redirect("/admin/inquiries?notice=delete-invalid");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/inquiries?notice=delete-failed");
  }

  let deleted = false;
  try {
    const { data, error } = await supabase.rpc("delete_contact_inquiry", {
      p_inquiry_id: idResult.data,
    });
    deleted = !error && data === true;
  } catch {
    deleted = false;
  }

  if (!deleted) {
    redirect("/admin/inquiries?notice=delete-failed");
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  redirect("/admin/inquiries?notice=deleted");
}
