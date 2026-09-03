import "server-only";

import { isContactInquiryEnabled } from "@/lib/config/features";
import { getSupabaseProjectUrl } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type InquiryOperationalStatus = {
  collectionEnabled: boolean;
  lastInquiryAt: string | null;
  refreshedAt: string;
  reportingAvailable: boolean;
  storageConfigured: boolean;
};

function isInquiryStorageConfigured() {
  return Boolean(
    getSupabaseProjectUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function createStatus(
  status: Omit<InquiryOperationalStatus, "refreshedAt">,
): InquiryOperationalStatus {
  return { ...status, refreshedAt: new Date().toISOString() };
}

/**
 * Reports only safe configuration booleans and the newest inquiry timestamp.
 * The timestamp query uses the signed-in administrator's request-scoped client
 * and remains subject to RLS. The privileged backend secret is never used or
 * returned; only its presence is checked for write-readiness context.
 */
export async function getInquiryOperationalStatus(): Promise<InquiryOperationalStatus> {
  const collectionEnabled = isContactInquiryEnabled();
  const storageConfigured = isInquiryStorageConfigured();
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return createStatus({
      collectionEnabled,
      lastInquiryAt: null,
      reportingAvailable: false,
      storageConfigured,
    });
  }

  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    return createStatus({
      collectionEnabled,
      lastInquiryAt: error ? null : (data?.[0]?.created_at ?? null),
      reportingAvailable: !error,
      storageConfigured,
    });
  } catch {
    return createStatus({
      collectionEnabled,
      lastInquiryAt: null,
      reportingAvailable: false,
      storageConfigured,
    });
  }
}
