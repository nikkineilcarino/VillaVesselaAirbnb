import { publicDestinations } from "@/lib/config/publicDestinations";

export type NavigationItem = {
  href: string;
  label: string;
  status: "available" | "upcoming";
};

/**
 * Public navigation is centralized so future routes become active in one place.
 * Upcoming entries must render as non-links until their route is implemented.
 */
export const publicNavigation = [
  { href: "/", label: "Home", status: "available" },
  { href: "/#about", label: "About", status: "available" },
  { href: "/accommodation", label: "Accommodation", status: "available" },
  { href: "/amenities", label: "Amenities", status: "available" },
  { href: "/gallery", label: "Gallery", status: "available" },
  { href: "/reviews", label: "Reviews", status: "available" },
  { href: "/location", label: "Location", status: "available" },
  { href: "/guest-guide", label: "Guest Guide", status: "available" },
  { href: "/contact", label: "Contact", status: "available" },
] as const satisfies readonly NavigationItem[];

export const primaryBookingAction = {
  href: publicDestinations.airbnb,
  label: "Book on Airbnb",
  unavailableReason: "Airbnb listing link awaiting confirmation",
} as const;
