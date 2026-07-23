export type HouseRuleGroup = {
  rules: readonly string[];
  title: string;
};

export const houseRuleGroups = [
  {
    title: "Smoking and fire",
    rules: [
      "No smoking inside the villa or on balconies.",
      "Smoke only in approved outdoor areas.",
      "No bonfires in the compound or on the beach under local rules.",
    ],
  },
  {
    title: "Noise and gatherings",
    rules: [
      "Videoke must stop by 10:00 PM.",
      "Birthdays, reunions, celebrations, and other gatherings require prior host approval and remain subject to capacity limits, charges, and property rules.",
    ],
  },
  {
    title: "Children and pets",
    rules: [
      "Children must be supervised, especially around the beach and outdoor areas.",
      "Pets require prior owner approval; only small, trained pets may be considered.",
      "Current pet conditions and any related charge must be confirmed before booking.",
    ],
  },
  {
    title: "Care for the property",
    rules: [
      "Leave the kitchen clean after use.",
      "Do not pick or damage garden flowers.",
      "Conserve water and follow on-site property and beach safety instructions.",
      "Guests may be charged for lost items, soiled linen, or property damage; confirm the current fee schedule with the host.",
    ],
  },
  {
    title: "Before checkout",
    rules: [
      "Return all keys before checkout.",
      "Return air-conditioning and television remote controls.",
      "Complete checkout before 11:00 AM unless a different arrangement has been approved.",
    ],
  },
] as const satisfies readonly HouseRuleGroup[];
