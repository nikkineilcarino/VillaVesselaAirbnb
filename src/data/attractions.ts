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
  image?: {
    alt: string;
    height: number;
    src: string;
    width: number;
  };
  title: string;
};

const attractionImageRoot = "/images/villa-vessela/attraction";

export const nearbyAttractions = [
  {
    category: "day trip",
    description:
      "Explore Hundred Islands National Park from Alaminos through local providers, subject to current schedules, weather, sea conditions, and fees.",
    image: {
      alt: "Green islands and turquoise coves in Hundred Islands National Park",
      height: 1105,
      src: `${attractionImageRoot}/hundred-islands-view.jpg`,
      width: 1474,
    },
    title: "Hundred Islands",
  },
  {
    category: "day trip",
    description:
      "Silaki Island is associated with giant-clam conservation in Bolinao. Confirm whether visitor activities are operating and arrange any trip through an authorized local provider, subject to sea and weather conditions.",
    image: {
      alt: "Local boats and a covered floating platform on blue water near Silaki Island",
      height: 1829,
      src: `${attractionImageRoot}/silaki-island-giant-clams.jpg`,
      width: 1463,
    },
    title: "Silaki Island and giant-clam conservation",
  },
  {
    category: "food",
    description:
      "A supplied photograph shows floating dining structures in Bolinao. Confirm the current operator, route, opening hours, menu, price, and reservation requirements before visiting.",
    image: {
      alt: "Bamboo floating dining huts on a blue-green river in Bolinao",
      height: 1105,
      src: `${attractionImageRoot}/bolinao-floating-restaurant.jpg`,
      width: 1474,
    },
    title: "Bolinao floating restaurant",
  },
  {
    category: "day trip",
    description:
      "The supplied source identifies this destination as Tara Falls. Confirm current access, weather, water conditions, safety guidance, opening status, and fees locally before setting out.",
    image: {
      alt: "Turquoise pool below a small waterfall framed by hanging roots and greenery",
      height: 1105,
      src: `${attractionImageRoot}/tara-falls-bolinao.jpg`,
      width: 1474,
    },
    title: "Tara Falls",
  },
  {
    category: "day trip",
    description:
      "The supplied source identifies this destination only as Bolinao Falls. Confirm which falls, current access, capacity, water conditions, safety guidance, and fees locally before visiting.",
    image: {
      alt: "Wide tiered waterfall flowing into a blue-green rocky pool in Bolinao",
      height: 1829,
      src: `${attractionImageRoot}/bolinao-falls.jpg`,
      width: 1463,
    },
    title: "Bolinao Falls",
  },
  {
    category: "activity",
    description:
      "The supplied source describes a walk toward Tanduyong Island during low tide. Verify the tide window, route, weather, guide needs, and suitable footwear locally; do not attempt an uncertain crossing.",
    image: {
      alt: "Shallow clear water leading toward low green Tanduyong Island under a blue sky",
      height: 1105,
      src: `${attractionImageRoot}/tanduyong-island-low-tide.jpg`,
      width: 1474,
    },
    title: "Tanduyong Island low-tide walk",
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
