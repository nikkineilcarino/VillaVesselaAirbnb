import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { InquiryListFilters } from "@/lib/inquiries/filters";
import type { Database } from "@/types/database";

const INQUIRIES_PER_PAGE = 20;
export type AdminInquiry = Pick<
  Database["public"]["Tables"]["contact_inquiries"]["Row"],
  | "created_at"
  | "email"
  | "id"
  | "message"
  | "name"
  | "number_of_guests"
  | "phone"
  | "preferred_check_in"
  | "preferred_check_out"
  | "status"
>;

export type InquiryListResult =
  | {
      data: {
        inquiries: AdminInquiry[];
        page: number;
        total: number;
        totalPages: number;
      };
      status: "ready";
    }
  | { status: "unavailable" };

export async function getAdminInquiries(
  filters: InquiryListFilters,
): Promise<InquiryListResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "unavailable" };
  }

  const from = (filters.page - 1) * INQUIRIES_PER_PAGE;
  const to = from + INQUIRIES_PER_PAGE - 1;

  try {
    let query = supabase
      .from("contact_inquiries")
      .select(
        "created_at, email, id, message, name, number_of_guests, phone, preferred_check_in, preferred_check_out, status",
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { count, data, error } = await query.range(from, to);
    if (error) {
      return { status: "unavailable" };
    }

    const total = count ?? 0;
    return {
      data: {
        inquiries: data ?? [],
        page: filters.page,
        total,
        totalPages: Math.max(1, Math.ceil(total / INQUIRIES_PER_PAGE)),
      },
      status: "ready",
    };
  } catch {
    return { status: "unavailable" };
  }
}

export const inquiryAdminConstants = {
  perPage: INQUIRIES_PER_PAGE,
} as const;
