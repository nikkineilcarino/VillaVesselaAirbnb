import { DisabledContactInquiryForm } from "@/components/forms/DisabledContactInquiryForm";
import { EnabledContactInquiryForm } from "@/components/forms/EnabledContactInquiryForm";

export function ContactInquiryForm({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <EnabledContactInquiryForm />
  ) : (
    <DisabledContactInquiryForm />
  );
}

