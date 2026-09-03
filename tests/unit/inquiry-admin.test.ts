import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { InquiryOperationalStatus } from "@/components/admin/InquiryOperationalStatus";

function source(...segments: string[]) {
  return readFileSync(join(process.cwd(), ...segments), "utf8");
}

describe("administrator inquiry deletion boundary", () => {
  it("re-authorizes and deletes only through the exact-ID database function", () => {
    const actions = source(
      "src",
      "app",
      "admin",
      "(protected)",
      "inquiries",
      "actions.ts",
    );
    const deleteAction = actions.slice(actions.indexOf("export async function deleteInquiry"));

    expect(deleteAction).toContain("await requireAdmin()");
    expect(deleteAction).toContain("inquiryIdSchema.safeParse(inquiryId)");
    expect(actions).toContain('z.literal("delete")');
    expect(deleteAction).toContain('formData.get("confirmation")');
    expect(deleteAction).toContain('.rpc("delete_contact_inquiry"');
    expect(deleteAction).toContain("p_inquiry_id: idResult.data");
    expect(deleteAction).not.toContain("createServiceRoleSupabaseClient");
    expect(deleteAction).not.toMatch(/\.from\("contact_inquiries"\)[\s\S]*?\.delete\(/);
    expect(deleteAction).toContain('redirect("/admin/inquiries?notice=deleted")');
  });

  it("requires an explicit per-record confirmation and exposes no bulk control", () => {
    const page = source(
      "src",
      "app",
      "admin",
      "(protected)",
      "inquiries",
      "page.tsx",
    );
    const button = source(
      "src",
      "components",
      "admin",
      "InquiryDeleteSubmitButton.tsx",
    );

    expect(page).toContain("deleteInquiry.bind(null, inquiry.id)");
    expect(page).toContain("<InquiryDeleteSubmitButton />");
    expect(page).toContain("Delete this inquiry");
    expect(page).not.toMatch(/delete all|bulk delete/i);
    expect(button).toContain('name="confirmation"');
    expect(button).toContain('value="delete"');
    expect(button).toContain("required");
    expect(button).not.toMatch(/inquiryId|guest|email|phone/);
  });
});

describe("administrator inquiry operational status", () => {
  it("separates feature, storage-presence, and RLS reporting signals", () => {
    const status = source("src", "lib", "inquiries", "status.ts");
    const component = source(
      "src",
      "components",
      "admin",
      "InquiryOperationalStatus.tsx",
    );

    expect(status).toContain("isContactInquiryEnabled()");
    expect(status).toContain("SUPABASE_SERVICE_ROLE_KEY?.trim()");
    expect(status).toContain("createServerSupabaseClient()");
    expect(status).not.toContain("createServiceRoleSupabaseClient");
    expect(status).toContain('.from("contact_inquiries")');
    expect(status).toContain('.select("created_at")');
    expect(component).toContain("Live submission is verified separately");
    expect(component).toContain("Check this inbox daily");
    expect(component).toContain("No email, SMS");
    expect(component).toContain("Active-table records expire after 365 days");
    expect(component).toContain("same email or phone/messaging");
    expect(component).toContain("Never reveal whether a");
    expect(component).toContain("delete only");
  });

  it("renders disabled and unhealthy states without exposing configuration values", () => {
    const disabled = renderToStaticMarkup(
      createElement(InquiryOperationalStatus, {
        status: {
          collectionEnabled: false,
          lastInquiryAt: null,
          refreshedAt: "2026-08-24T00:00:00.000Z",
          reportingAvailable: true,
          storageConfigured: true,
        },
      }),
    );
    const unavailable = renderToStaticMarkup(
      createElement(InquiryOperationalStatus, {
        status: {
          collectionEnabled: true,
          lastInquiryAt: null,
          refreshedAt: "2026-08-24T00:00:00.000Z",
          reportingAvailable: false,
          storageConfigured: false,
        },
      }),
    );

    expect(disabled).toContain("Website inquiry collection is disabled");
    expect(disabled).toContain("Public intake");
    expect(disabled).toContain("Disabled");
    expect(unavailable).toContain("Inquiry intake needs attention");
    expect(unavailable).toContain("Unconfigured");
    expect(unavailable).toContain("No email, SMS");
    expect(unavailable).not.toMatch(/sb_secret_|service_role|SUPABASE_/);
  });
});

describe("unfinished inquiry visibility boundary", () => {
  it("keeps collection and publication separate while enabled collection always reveals itself", () => {
    const features = source("src", "lib", "config", "features.ts");

    expect(features).toContain("isContactInquiryVisible");
    expect(features).toContain("isContactInquiryEnabled() ||");
    expect(features).toContain("CONTACT_INQUIRY_VISIBLE");
    expect(features).not.toContain("NEXT_PUBLIC_CONTACT_INQUIRY");
  });

  it("hides guest, administrator navigation, direct page, dashboard, and export surfaces", () => {
    const contact = source("src", "app", "(public)", "contact", "page.tsx");
    const privacy = source("src", "app", "(public)", "privacy", "page.tsx");
    const adminLayout = source("src", "app", "admin", "(protected)", "layout.tsx");
    const inquiryPage = source(
      "src",
      "app",
      "admin",
      "(protected)",
      "inquiries",
      "page.tsx",
    );
    const dashboard = source(
      "src",
      "app",
      "admin",
      "(protected)",
      "dashboard",
      "page.tsx",
    );
    const dashboardQuery = source("src", "lib", "dashboard", "query.ts");
    const actions = source(
      "src",
      "app",
      "admin",
      "(protected)",
      "inquiries",
      "actions.ts",
    );
    const exportRoute = source(
      "src",
      "app",
      "admin",
      "exports",
      "[type]",
      "route.ts",
    );

    expect(contact).toContain("inquiryVisible ? (");
    expect(privacy).toContain("inquiryVisible ? (");
    expect(adminLayout).toContain("showInquiries={isContactInquiryVisible()}");
    expect(inquiryPage).toContain("if (!isContactInquiryVisible())");
    expect(inquiryPage).toContain("notFound()");
    expect(inquiryPage).toContain("export function generateMetadata()");
    expect(inquiryPage).toContain('return { title: "Administrator" }');
    expect(inquiryPage).not.toContain("export const metadata");
    expect(dashboard).toContain("showInquiries={inquiryVisible}");
    expect(dashboard).toContain("includeInquiries: inquiryVisible");
    expect(dashboardQuery).toContain("const includeInquiries =");
    expect(dashboardQuery).toContain("const recentInquiryQuery = includeInquiries");
    expect(dashboardQuery).toContain("hasDemonstrationData: false");
    expect(actions).toContain("requireVisibleInquirySurface();");
    expect(actions).toContain("if (!isContactInquiryVisible())");
    expect(actions).toContain("notFound()");
    expect(exportRoute).toContain(
      'rawType === "inquiries" && !isContactInquiryVisible()',
    );
    expect(exportRoute).toContain("adminExportError(404)");
  });
});

describe("inquiry CI modes", () => {
  it("runs enabled, published-disabled rollback, and unfinished-hidden browser modes", () => {
    const workflow = source(".github", "workflows", "quality.yml");

    expect(workflow).toContain('CONTACT_INQUIRY_ENABLED: "true"');
    expect(workflow).toContain('CONTACT_INQUIRY_VISIBLE: "true"');
    expect(workflow).toContain("Run credential-independent browser tests");
    expect(workflow).toContain("Run inquiry-disabled browser fallback");
    expect(workflow).toContain("Run unfinished inquiry-hidden browser fallback");
    expect(workflow).toContain('CONTACT_INQUIRY_ENABLED: "false"');
    expect(workflow).toContain('CONTACT_INQUIRY_VISIBLE: "false"');
    expect(workflow).toContain("tests/e2e/inquiry-workflow.spec.ts");
    expect(workflow).toContain("tests/e2e/discovery-contact.spec.ts");
    expect(workflow).toContain("tests/e2e/seo-privacy-security.spec.ts");
    expect(workflow).not.toContain("--grep");
  });
});
