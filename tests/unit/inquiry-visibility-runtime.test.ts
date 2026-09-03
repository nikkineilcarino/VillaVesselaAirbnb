import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createProtectedCsvExport: vi.fn(),
  createServerSupabaseClient: vi.fn(),
  getAdminAccess: vi.fn(),
  getAdminInquiries: vi.fn(),
  getInquiryOperationalStatus: vi.fn(),
  inquiryVisible: vi.fn(),
  logoutAdmin: vi.fn(),
  notFound: vi.fn(),
  redirect: vi.fn(),
  requireAdmin: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/admin", () => ({
  getAdminAccess: mocks.getAdminAccess,
  requireAdmin: mocks.requireAdmin,
}));
vi.mock("@/app/admin/(protected)/actions", () => ({
  logoutAdmin: mocks.logoutAdmin,
}));
vi.mock("@/lib/config/features", () => ({
  isContactInquiryVisible: mocks.inquiryVisible,
}));
vi.mock("@/lib/csv/export", () => ({
  createProtectedCsvExport: mocks.createProtectedCsvExport,
}));
vi.mock("@/lib/inquiries/admin", () => ({
  getAdminInquiries: mocks.getAdminInquiries,
}));
vi.mock("@/lib/inquiries/status", () => ({
  getInquiryOperationalStatus: mocks.getInquiryOperationalStatus,
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mocks.createServerSupabaseClient,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
  redirect: mocks.redirect,
}));

import {
  deleteInquiry,
  updateInquiryStatus,
} from "@/app/admin/(protected)/inquiries/actions";
import InquiryPage, {
  generateMetadata as generateInquiryMetadata,
} from "@/app/admin/(protected)/inquiries/page";
import { GET as getAdminExport } from "@/app/admin/exports/[type]/route";
import { AdminHeader } from "@/components/admin/AdminHeader";

const inquiryId = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.inquiryVisible.mockReturnValue(false);
  mocks.notFound.mockImplementation(() => {
    throw new Error("NEXT_NOT_FOUND");
  });
  mocks.getAdminAccess.mockResolvedValue({ status: "authorized" });
});

describe("hidden administrator inquiry runtime boundary", () => {
  it("omits inquiry navigation from the authorized administrator header", () => {
    const markup = renderToStaticMarkup(
      createElement(AdminHeader, {
        displayName: "Approved administrator",
        showInquiries: false,
      }),
    );

    expect(markup).not.toContain("/admin/inquiries");
    expect(markup).not.toContain(">Inquiries<");
  });

  it("returns not found for an approved direct inquiry page before any row query", async () => {
    await expect(
      InquiryPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.getAdminInquiries).not.toHaveBeenCalled();
    expect(mocks.getInquiryOperationalStatus).not.toHaveBeenCalled();
  });

  it("uses generic administrator metadata while the inquiry page is hidden", () => {
    const metadata = generateInquiryMetadata();

    expect(metadata).toEqual({ title: "Administrator" });
    expect(JSON.stringify(metadata)).not.toMatch(/inquir/i);
  });

  it.each([
    ["status update", updateInquiryStatus],
    ["exact deletion", deleteInquiry],
  ])("rejects a direct %s action before authorization or storage", async (_, action) => {
    await expect(action(inquiryId, new FormData())).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.requireAdmin).not.toHaveBeenCalled();
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
  });

  it("returns a protected 404 for an approved direct inquiry export request", async () => {
    const response = await getAdminExport(
      new Request("https://villa.example/admin/exports/inquiries?start=2026-08-01&end=2026-08-31"),
      { params: Promise.resolve({ type: "inquiries" }) },
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mocks.createServerSupabaseClient).not.toHaveBeenCalled();
    expect(mocks.createProtectedCsvExport).not.toHaveBeenCalled();
  });
});
