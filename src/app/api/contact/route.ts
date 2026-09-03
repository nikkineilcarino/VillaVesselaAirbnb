import { isContactInquiryEnabled } from "@/lib/config/features";
import { INQUIRY_PRIVACY_NOTICE_VERSION } from "@/lib/inquiries/constants";
import { handleInquiryRequest } from "@/lib/inquiries/handler";
import {
  allowInquiryRequest,
  allowInquirySubmission,
} from "@/lib/inquiries/rateLimit";
import { reportInquiryFailureOnce } from "@/lib/inquiries/server";
import { getSiteUrl } from "@/lib/seo/siteUrl";
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
    return "unavailable" as const;
  }

  if (!supabase) {
    reportInquiryFailureOnce("storage-unavailable");
    return "unavailable" as const;
  }

  try {
    const { data, error } = await supabase
      .rpc("store_contact_inquiry", {
        p_email: inquiry.email,
        p_message: inquiry.message,
        p_name: inquiry.name,
        p_number_of_guests: inquiry.numberOfGuests,
        p_phone: inquiry.phone,
        p_preferred_check_in: inquiry.preferredCheckIn,
        p_preferred_check_out: inquiry.preferredCheckOut,
        p_privacy_notice_version: INQUIRY_PRIVACY_NOTICE_VERSION,
        p_submission_id: inquiry.submissionId,
      });

    if (
      error ||
      (data !== "created" && data !== "duplicate" && data !== "conflict")
    ) {
      reportInquiryFailureOnce("insert-failed");
      return "unavailable" as const;
    }

    return data;
  } catch {
    reportInquiryFailureOnce("insert-failed");
    return "unavailable" as const;
  }
}

export async function POST(request: Request) {
  return handleInquiryRequest(request, {
    allowRequest: allowInquiryRequest,
    allowSubmission: allowInquirySubmission,
    enabled: isContactInquiryEnabled(),
    expectedOrigin: getSiteUrl().origin,
    store: storeInquiry,
  });
}
