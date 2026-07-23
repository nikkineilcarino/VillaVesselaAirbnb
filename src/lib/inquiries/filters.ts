import {
  inquiryStatuses,
  type InquiryStatus,
} from "@/types/inquiries";

const MAXIMUM_PAGE = 10_000;

export type InquiryStatusFilter = "all" | InquiryStatus;

export type InquiryListFilters = {
  page: number;
  status: InquiryStatusFilter;
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function resolveInquiryListFilters(
  searchParams: SearchParams,
):
  | { filters: InquiryListFilters; success: true }
  | { message: string; success: false } {
  const rawStatus = firstValue(searchParams.status) ?? "all";
  const rawPage = firstValue(searchParams.page) ?? "1";

  if (
    rawStatus !== "all" &&
    !inquiryStatuses.includes(rawStatus as InquiryStatus)
  ) {
    return { message: "Choose one of the available inquiry statuses.", success: false };
  }

  if (!/^\d{1,5}$/.test(rawPage)) {
    return { message: "Choose a valid inquiry page.", success: false };
  }

  const page = Number(rawPage);
  if (!Number.isSafeInteger(page) || page < 1 || page > MAXIMUM_PAGE) {
    return { message: "Choose a valid inquiry page.", success: false };
  }

  return {
    filters: {
      page,
      status: rawStatus as InquiryStatusFilter,
    },
    success: true,
  };
}

export const inquiryFilterConstants = {
  maximumPage: MAXIMUM_PAGE,
} as const;

