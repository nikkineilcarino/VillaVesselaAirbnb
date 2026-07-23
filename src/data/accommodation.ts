export const propertyStats = [
  { detail: "Standard capacity", value: "10 guests" },
  { detail: "Private sleeping spaces", value: "2 bedrooms" },
  { detail: "Supplied listing count", value: "5 beds" },
  { detail: "Confirmed; other external facilities are reported", value: "1 main bathroom" },
] as const;

export const accommodationFeatures = [
  "Approximately 700-square-metre gated tropical compound",
  "Sea and garden views from private balconies",
  "Air conditioning upstairs and downstairs",
  "Separate lounge, dining area, and main kitchen",
  "Free secure parking inside the compound",
  "A separate frying kubo is mentioned; guest-use details await confirmation",
] as const;

export const expandedCapacityNote =
  "Up to 13 guests may be considered only with prior host approval and additional charges.";

export const bathroomNote =
  "One main bathroom is confirmed; additional external toilets and a shower have been reported and await final arrangement confirmation.";

export type AccommodationGroup = {
  items: readonly string[];
  title: string;
};

export const accommodationGroups = [
  {
    title: "Shared indoor spaces",
    items: [
      "Separate lounge and dining area",
      "Main self-catering kitchen",
      "Air conditioning upstairs and downstairs",
      "Television, refrigerator, and microwave",
    ],
  },
  {
    title: "Outdoor setting",
    items: [
      "Approximately 700-square-metre gated compound",
      "Private patio or balconies with sea and garden views",
      "Tropical garden and backyard space",
      "Free secure parking inside the compound",
    ],
  },
  {
    title: "Sleeping and washing",
    items: [
      "Two bedrooms and five beds in the supplied listing",
      "One confirmed main bathroom with a hot-water shower",
      "Additional external toilets and a shower are reported",
      "The exact bed and external-facility arrangement awaits confirmation",
    ],
  },
] as const satisfies readonly AccommodationGroup[];

export const accommodationInclusionNotes = [
  {
    detail:
      "Two structures behind the villa are referred to as the Blue Kubo and Green Kubo. Their inclusion in a standard booking has not been confirmed.",
    title: "Blue and Green Kubos",
  },
  {
    detail:
      "A separate kitchen kubo for fish and heavier frying is mentioned in the supplied information. Guests should confirm access and current use arrangements before arrival.",
    title: "Frying kubo",
  },
  {
    detail:
      "A beach cottage may be available for an additional charge, but availability, inclusion, and price remain unconfirmed.",
    title: "Beach cottage",
  },
] as const;
