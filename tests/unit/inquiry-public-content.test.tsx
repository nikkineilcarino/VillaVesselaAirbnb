import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import PrivacyPage, {
  dynamic as privacyRenderingMode,
} from "@/app/(public)/privacy/page";
import ContactPage from "@/app/(public)/contact/page";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";

const originalInquiryFlag = process.env.CONTACT_INQUIRY_ENABLED;
const originalInquiryVisibility = process.env.CONTACT_INQUIRY_VISIBLE;

afterEach(() => {
  if (originalInquiryFlag === undefined) {
    delete process.env.CONTACT_INQUIRY_ENABLED;
  } else {
    process.env.CONTACT_INQUIRY_ENABLED = originalInquiryFlag;
  }

  if (originalInquiryVisibility === undefined) {
    delete process.env.CONTACT_INQUIRY_VISIBLE;
  } else {
    process.env.CONTACT_INQUIRY_VISIBLE = originalInquiryVisibility;
  }
});

describe("public inquiry truth", () => {
  it("hides unfinished inquiry surfaces from public Contact and Privacy pages", () => {
    process.env.CONTACT_INQUIRY_ENABLED = "false";
    process.env.CONTACT_INQUIRY_VISIBLE = "false";

    const contact = renderToStaticMarkup(<ContactPage />);
    const privacy = renderToStaticMarkup(<PrivacyPage />);

    expect(privacyRenderingMode).toBe("force-dynamic");
    expect(contact).not.toMatch(/inquir/i);
    expect(privacy).not.toMatch(/inquir/i);
  });

  it("renders a non-submitting fallback and disabled Privacy wording after publication", () => {
    process.env.CONTACT_INQUIRY_ENABLED = "false";
    process.env.CONTACT_INQUIRY_VISIBLE = "true";

    const form = renderToStaticMarkup(<ContactInquiryForm enabled={false} />);
    const privacy = renderToStaticMarkup(PrivacyPage());

    expect(privacyRenderingMode).toBe("force-dynamic");
    expect(form).toContain("<fieldset");
    expect(form).toContain("disabled");
    expect(form).toContain(
      "Nothing entered in this disabled preview is submitted or stored.",
    );
    expect(form).toContain('href="/privacy"');
    expect(privacy).toContain("Website inquiry collection is currently disabled.");
    expect(privacy).toContain("creates no new inquiry record");
    expect(privacy).toContain("Previously collected records, if any");
    expect(privacy).toContain(
      "may be enabled only after its daily active-table retention process is operational",
    );
    expect(privacy).not.toContain("Website inquiry collection is active.");
  });

  it("renders just-in-time consent and complete enabled Privacy disclosures", () => {
    process.env.CONTACT_INQUIRY_ENABLED = "true";
    process.env.CONTACT_INQUIRY_VISIBLE = "false";

    const form = renderToStaticMarkup(<ContactInquiryForm enabled />);
    const privacy = renderToStaticMarkup(PrivacyPage());

    expect(form).toContain(
      "I consent to Villa Vessela storing these submitted details",
    );
    expect(form).toContain('href="/privacy"');
    expect(form).toContain("after they are more than 365 days old");
    expect(form).toContain("not a booking or payment");
    expect(form).toContain("sends no automatic reply or operator notification");
    expect(privacy).toContain("Website inquiry collection is active.");
    expect(privacy).toContain(
      '<time dateTime="2026-08-31">31 August 2026</time>',
    );
    expect(privacy).toContain("random submission identifier");
    expect(privacy).toContain("not an availability confirmation, booking, payment");
    expect(privacy).toContain("sends no automatic reply");
    expect(privacy).toContain("checked daily while collection is active");
    expect(privacy).toContain("strictly older than 365 days");
    expect(privacy).toContain("delete one exact inquiry");
    expect(privacy).toContain("downloaded file is a separate copy");
    expect(privacy).toContain("does not instantly remove provider backup copies");
    expect(privacy).toContain("not a claim of legal compliance");
  });
});
