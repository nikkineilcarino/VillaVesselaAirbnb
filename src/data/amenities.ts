export type AmenityPreview = {
  description: string;
  icon: "air" | "beach" | "garden" | "kitchen" | "parking" | "shower";
  title: string;
};

export const amenityPreviews = [
  {
    description: "The sandy beach is less than 100 metres away—about one minute on foot.",
    icon: "beach",
    title: "Beach access",
  },
  {
    description: "Air-conditioned spaces are reported on both the upstairs and downstairs levels.",
    icon: "air",
    title: "Air-conditioned comfort",
  },
  {
    description:
      "Prepare meals in the main kitchen. Supplied material also mentions a separate frying kubo; guest-use details await confirmation.",
    icon: "kitchen",
    title: "Self-catering kitchen",
  },
  {
    description: "Enjoy balconies, patio space, a backyard, and the surrounding tropical garden.",
    icon: "garden",
    title: "Private outdoor spaces",
  },
  {
    description: "Vehicles can park free of charge inside the property's gated compound.",
    icon: "parking",
    title: "Secure parking",
  },
  {
    description: "The confirmed main bathroom includes a hot-water shower.",
    icon: "shower",
    title: "Hot-water shower",
  },
] as const satisfies readonly AmenityPreview[];

export const connectivityNote =
  "The property relies on mobile-network connectivity rather than conventional fixed Wi-Fi. Guests should use a Philippine SIM and personal hotspot; signal and speed may vary, especially during busy periods.";

export type AmenityAvailability = "confirm" | "supplied";

export type AmenityItem = {
  availability: AmenityAvailability;
  detail?: string;
  name: string;
};

export type AmenityGroup = {
  items: readonly AmenityItem[];
  title: string;
};

export const amenityGroups = [
  {
    title: "Beach and outdoors",
    items: [
      { availability: "supplied", name: "Beach access under 100 metres" },
      { availability: "supplied", name: "Beach view" },
      { availability: "supplied", name: "Tropical garden and backyard" },
      { availability: "supplied", name: "Private patio or balconies" },
      { availability: "supplied", name: "Free beach entrance" },
      { availability: "supplied", name: "Free secure parking" },
    ],
  },
  {
    title: "Comfort",
    items: [
      { availability: "supplied", name: "Air conditioning upstairs and downstairs" },
      { availability: "supplied", name: "Television" },
      { availability: "supplied", name: "Hot-water shower in the main bathroom" },
      {
        availability: "confirm",
        detail: "The supplied guide says potable water is provided, but the current arrangement still needs owner confirmation.",
        name: "Potable drinking water",
      },
      {
        availability: "confirm",
        detail: "A washer appears in the supplied Airbnb information; current guest access has not been confirmed.",
        name: "Washer",
      },
    ],
  },
  {
    title: "Kitchen and dining",
    items: [
      { availability: "supplied", name: "Main self-catering kitchen" },
      { availability: "supplied", name: "Separate dining area" },
      { availability: "supplied", name: "Refrigerator and microwave" },
      { availability: "supplied", name: "Three rice cookers and three water kettles" },
      { availability: "supplied", name: "Three frying pans" },
      { availability: "supplied", name: "Plates, glasses, and cutlery" },
      {
        availability: "confirm",
        detail: "The supplied information mentions a separate kitchen kubo for frying; guest access and current arrangements need confirmation.",
        name: "Separate frying kubo",
      },
    ],
  },
] as const satisfies readonly AmenityGroup[];

export const optionalServiceNotes = [
  "Cooking",
  "Shopping",
  "Babysitting",
  "Serving",
  "Additional cleaning",
] as const;
