import { siteConfig } from "./site";

export type ContactChannel = {
  destination: null | string;
  id: "airbnb" | "email" | "facebook" | "messenger" | "phone" | "whatsapp";
  label: string;
  note: string;
};

export const contactChannels: readonly ContactChannel[] = [
  {
    destination: siteConfig.booking.airbnbUrl,
    id: "airbnb",
    label: "Airbnb",
    note: "Complete listing URL awaiting verification",
  },
  {
    destination: siteConfig.booking.facebookUrl,
    id: "facebook",
    label: "Facebook",
    note: "Official page URL awaiting confirmation",
  },
  {
    destination: siteConfig.booking.messengerUrl,
    id: "messenger",
    label: "Messenger",
    note: "Complete Messenger destination awaiting confirmation",
  },
  {
    destination: siteConfig.booking.whatsappUrl,
    id: "whatsapp",
    label: "WhatsApp",
    note: "Approved country-code destination awaiting confirmation",
  },
  {
    destination: siteConfig.booking.contactPhone,
    id: "phone",
    label: "Telephone",
    note: "Public owner number and publication permission are pending",
  },
  {
    destination: siteConfig.booking.contactEmail,
    id: "email",
    label: "Email",
    note: "Public owner email and publication permission are pending",
  },
];
