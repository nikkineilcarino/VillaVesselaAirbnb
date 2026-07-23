export function isContactInquiryEnabled() {
  return process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
}

