export const inquiryStatuses = [
  "new",
  "reviewed",
  "contacted",
  "closed",
  "spam",
] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryFieldNames = [
  "name",
  "email",
  "phone",
  "checkIn",
  "checkOut",
  "numberOfGuests",
  "message",
  "consent",
  "form",
] as const;

export type InquiryFieldName = (typeof inquiryFieldNames)[number];
export type InquiryFieldErrors = Partial<Record<InquiryFieldName, string>>;

export type InquirySubmissionPayload = {
  checkIn: null | string;
  checkOut: null | string;
  clientId: string;
  consent: boolean;
  email: string;
  formStartedAt: number;
  message: string;
  name: string;
  numberOfGuests: number | null;
  phone: string;
  privacyNoticeVersion: string;
  submissionId: string;
  website: string;
};

export type ValidatedInquiry = {
  consent: true;
  email: string | null;
  message: string;
  name: string;
  numberOfGuests: number | null;
  phone: string | null;
  preferredCheckIn: string | null;
  preferredCheckOut: string | null;
  submissionId: string;
};
