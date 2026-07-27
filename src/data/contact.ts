import { siteConfig } from "./site";

export type ContactChannel = {
  destination: null | string;
  displayValue?: string;
  id: "airbnb" | "email" | "facebook" | "messenger" | "phone" | "whatsapp";
  key: string;
  label: string;
  note: string;
};

function formatTelephoneDestination(destination: string) {
  const digits = destination.replace(/\D/g, "");

  if (/^639\d{9}$/.test(digits)) {
    return `+63 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return `+${digits}`;
}

const configuredCaretakerPhoneChannels = ([
  {
    destination: siteConfig.caretakers.nidaPhone,
    displayValue: siteConfig.caretakers.nidaPhone
      ? formatTelephoneDestination(siteConfig.caretakers.nidaPhone)
      : undefined,
    id: "phone",
    key: "caretaker-nida-phone",
    label: "Nida — Caretaker",
    note: "Owner-approved public caretaker telephone",
  },
  {
    destination: siteConfig.caretakers.evelynPhone,
    displayValue: siteConfig.caretakers.evelynPhone
      ? formatTelephoneDestination(siteConfig.caretakers.evelynPhone)
      : undefined,
    id: "phone",
    key: "caretaker-evelyn-phone",
    label: "Evelyn — Caretaker",
    note: "Owner-approved public caretaker telephone",
  },
] satisfies readonly ContactChannel[]).filter((channel) => Boolean(channel.destination));

const telephoneChannels: readonly ContactChannel[] = configuredCaretakerPhoneChannels.length
  ? configuredCaretakerPhoneChannels
  : [
      {
        destination: siteConfig.booking.contactPhone,
        id: "phone",
        key: "owner-phone",
        label: "Telephone",
        note: "Public owner number and publication permission are pending",
      },
    ];

export const contactChannels: readonly ContactChannel[] = [
  {
    destination: siteConfig.booking.airbnbUrl,
    id: "airbnb",
    key: "airbnb",
    label: "Airbnb",
    note: "Complete listing URL awaiting verification",
  },
  {
    destination: siteConfig.booking.facebookUrl,
    id: "facebook",
    key: "facebook",
    label: "Facebook",
    note: "Official page URL awaiting confirmation",
  },
  {
    destination: siteConfig.booking.messengerUrl,
    id: "messenger",
    key: "messenger",
    label: "Messenger",
    note: "Complete Messenger destination awaiting confirmation",
  },
  {
    destination: siteConfig.booking.whatsappUrl,
    id: "whatsapp",
    key: "whatsapp",
    label: "WhatsApp",
    note: "Approved country-code destination awaiting confirmation",
  },
  ...telephoneChannels,
  {
    destination: siteConfig.booking.contactEmail,
    id: "email",
    key: "email",
    label: "Email",
    note: "Public owner email and publication permission are pending",
  },
];
