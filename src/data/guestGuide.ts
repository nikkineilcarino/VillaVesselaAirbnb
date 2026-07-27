import { siteConfig } from "./site";

export const arrivalSchedule = [
  { label: "Check-in", value: siteConfig.checkIn },
  { label: "Checkout", value: siteConfig.checkOut },
] as const;

export const packingGroups = [
  {
    title: "Sun and shore",
    items: ["Sun protection and lotion", "Hat", "Rash guard", "Suitable swimming clothing"],
  },
  {
    title: "Water activities",
    items: ["Aqua shoes or slippers", "Beach towels", "Snorkelling gear", "Swimming gear"],
  },
  {
    title: "Everyday essentials",
    items: ["Insect repellent", "Food", "Condiments", "Drinks"],
  },
  {
    title: "Optional downtime",
    items: ["Cards", "Chess", "Children's beach toys"],
  },
] as const;

export const selfCateringGuidance = [
  "The accommodation is primarily self-catering, so guests should bring food, condiments, and drinks.",
  "Use the main kitchen for meal preparation and leave it clean and tidy after use.",
  "The separate kitchen kubo is shared by guests staying in the Blue and Green kubos and is used for fish and heavier frying. Main-villa-only guests should confirm access before arrival.",
  "Cooking, shopping, babysitting, serving, and additional cleaning may be available for extra fees, subject to current availability and owner confirmation.",
] as const;

export const shoppingGuide = [
  {
    description: "Mainly sari-sari stores for basic day-to-day items.",
    place: "Tondol",
  },
  {
    description:
      "Groceries, a wet market, fruit and vegetable sellers, a convenience store, banks, and ATMs are reported.",
    place: "Anda town",
  },
  {
    description:
      "Larger supermarkets, pharmacies, restaurants, banks, and fast-food establishments are available farther away.",
    place: "Alaminos",
  },
] as const;

export const waterGuidance =
  "The supplied guide says potable drinking water is provided, but the current arrangement should be confirmed with the host. Conserve water because local municipal infrastructure may be limited, and do not expect consistently strong pressure.";

export const internetGuidance =
  "Use a Philippine SIM and personal hotspot for mobile-network connectivity. Available networks may support everyday online use, but signal, speed, and service are not guaranteed and may vary during busy periods.";
