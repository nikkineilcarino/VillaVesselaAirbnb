export function isContactInquiryEnabled() {
  return process.env.CONTACT_INQUIRY_ENABLED?.trim().toLowerCase() === "true";
}

export function isContactInquiryVisible() {
  return (
    isContactInquiryEnabled() ||
    process.env.CONTACT_INQUIRY_VISIBLE?.trim().toLowerCase() === "true"
  );
}
