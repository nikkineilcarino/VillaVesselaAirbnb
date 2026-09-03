import { DisabledContactInquiryForm } from "@/components/forms/DisabledContactInquiryForm";
import { EnabledContactInquiryForm } from "@/components/forms/EnabledContactInquiryForm";
import { INQUIRY_PRIVACY_NOTICE_VERSION } from "@/lib/inquiries/constants";

export function ContactInquiryForm({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <EnabledContactInquiryForm
      privacyNoticeVersion={INQUIRY_PRIVACY_NOTICE_VERSION}
    />
  ) : (
    <DisabledContactInquiryForm />
  );
}
