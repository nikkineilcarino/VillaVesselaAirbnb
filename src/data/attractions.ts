export const attractionPreviews = [
  {
    description:
      "Explore the celebrated island group from Alaminos through local tour providers, subject to schedules and conditions.",
    icon: "islands",
    title: "Hundred Islands",
  },
  {
    description:
      "Nearby island and sandbar trips may be available depending on tides, weather, and local operators.",
    icon: "sandbar",
    title: "Cory Island & Panacalan Sandbar",
  },
  {
    description:
      "This local island may be reachable on foot during low tide. Guests should verify conditions and bring aqua shoes.",
    icon: "footprints",
    title: "Toothbrush Island",
  },
  {
    description:
      "Discover traditional salt-making on the way to Tondol Beach and ask locally about current visits.",
    icon: "salt",
    title: "Traditional salt-making",
  },
] as const;

export type NearbyAttraction = {
  category: "activity" | "day trip" | "food" | "local culture";
  description: string;
  title: string;
};

export const nearbyAttractions = [
  {
    category: "day trip",
    description:
      "Explore the celebrated island group from Alaminos through local providers, subject to schedules, weather, and sea conditions.",
    title: "Hundred Islands",
  },
  {
    category: "day trip",
    description:
      "A nearby island excursion may be available through local providers. Confirm current access, timing, and price before setting out.",
    title: "Cory Island",
  },
  {
    category: "day trip",
    description:
      "Sandbar access depends on tides, weather, schedules, and local arrangements. Conditions should be checked on the day.",
    title: "Panacalan Sandbar",
  },
  {
    category: "day trip",
    description:
      "This local island may be reachable on foot during low tide. Verify conditions locally and wear suitable aqua shoes.",
    title: "Toothbrush Island",
  },
  {
    category: "local culture",
    description:
      "Traditional salt-making can be found on the way to Tondol Beach. Ask locally whether visits are currently possible.",
    title: "Traditional salt-making",
  },
  {
    category: "activity",
    description:
      "Enjoy the nearby sandy shore while following local guidance and checking current tide and swimming conditions.",
    title: "Tondol Beach",
  },
  {
    category: "activity",
    description:
      "Bring personal snorkelling equipment and check visibility, currents, weather, and suitable access points before entering the water.",
    title: "Snorkelling",
  },
  {
    category: "activity",
    description:
      "Swimming conditions can change. Check local advice, supervise children, and use appropriate sun and water protection.",
    title: "Swimming",
  },
  {
    category: "food",
    description:
      "Look for binongey, a local sticky-rice delicacy, and confirm current sellers or availability during the stay.",
    title: "Binongey",
  },
  {
    category: "food",
    description:
      "Anda and nearby Alaminos are known for local longganisa. Ask current local sellers for availability and preparation guidance.",
    title: "Anda or Alaminos longganisa",
  },
] as const satisfies readonly NearbyAttraction[];

export const attractionPlanningNote =
  "Tour arrangements may be available, but availability and prices depend on weather, tides, local providers, and schedules. Verify current details before committing to a trip.";
