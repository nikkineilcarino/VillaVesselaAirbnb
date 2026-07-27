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
  "Complete household utilities for day-to-day stay needs",
  "One carport and space for three to four cars inside the compound",
  "A kitchen kubo shared by guests staying in the Blue and Green kubos",
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
      "Spacious front yard and tropical garden",
      "One carport and space for three to four cars inside the compound",
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
      "Two structures behind the villa are referred to as the Blue Kubo and Green Kubo. Guests staying in these kubos share the separate kitchen kubo. Their inclusion in a standard villa booking has not been confirmed.",
    title: "Blue and Green Kubos",
  },
  {
    detail:
      "The separate kitchen kubo is shared by guests staying in the Blue and Green kubos and is used for fish and heavier frying. Guests booking only the main villa should confirm whether access is included.",
    title: "Shared kitchen kubo",
  },
  {
    detail:
      "A beach cottage may be available for an additional charge, but availability, inclusion, and price remain unconfirmed.",
    title: "Beach cottage",
  },
] as const;
