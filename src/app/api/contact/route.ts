import { isContactInquiryEnabled } from "@/lib/config/features";
import { handleInquiryRequest } from "@/lib/inquiries/handler";
import {
  allowInquiryRequest,
  allowInquirySubmission,
} from "@/lib/inquiries/rateLimit";
import { reportInquiryFailureOnce } from "@/lib/inquiries/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service";
import type { ValidatedInquiry } from "@/types/inquiries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function storeInquiry(inquiry: ValidatedInquiry) {
  let supabase: ReturnType<typeof createServiceRoleSupabaseClient>;

  try {
    supabase = createServiceRoleSupabaseClient();
  } catch {
    reportInquiryFailureOnce("storage-unavailable");
    return false;
  }

  if (!supabase) {
    reportInquiryFailureOnce("storage-unavailable");
    return false;
  }

  try {
    const { error } = await supabase.from("contact_inquiries").insert({
      consent: inquiry.consent,
      email: inquiry.email,
      message: inquiry.message,
      name: inquiry.name,
      number_of_guests: inquiry.numberOfGuests,
      phone: inquiry.phone,
      preferred_check_in: inquiry.preferredCheckIn,
      preferred_check_out: inquiry.preferredCheckOut,
      status: "new",
    });

    if (error) {
      reportInquiryFailureOnce("insert-failed");
      return false;
    }

    return true;
  } catch {
    reportInquiryFailureOnce("insert-failed");
    return false;
  }
}

export async function POST(request: Request) {
  return handleInquiryRequest(request, {
    allowRequest: allowInquiryRequest,
    allowSubmission: allowInquirySubmission,
    enabled: isContactInquiryEnabled(),
    store: storeInquiry,
  });
}

