export type FeeStatus = "owner-confirmation-required";

export type FeeRecord = {
  key:
    | "additional-cleaning"
    | "babysitting-service"
    | "beach-cottage"
    | "cooking-service"
    | "damaged-screen-door"
    | "extra-guest"
    | "lost-key"
    | "lost-remote"
    | "pet-cleaning"
    | "shopping-service"
    | "soiled-linen";
  label: string;
  sourceDraftAmountsPhp: readonly number[];
  status: FeeStatus;
};

/**
 * Draft amounts are retained for owner reconciliation only. Phase 4 deliberately
 * renders no amount because the final public fee schedule is not approved.
 */
export const feeRecords = [
  { key: "soiled-linen", label: "Soiled linen", sourceDraftAmountsPhp: [500], status: "owner-confirmation-required" },
  { key: "lost-key", label: "Lost key", sourceDraftAmountsPhp: [500, 1000], status: "owner-confirmation-required" },
  { key: "lost-remote", label: "Lost or damaged remote control", sourceDraftAmountsPhp: [1500], status: "owner-confirmation-required" },
  { key: "damaged-screen-door", label: "Damaged screen door", sourceDraftAmountsPhp: [1000], status: "owner-confirmation-required" },
  { key: "extra-guest", label: "Additional guest", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "beach-cottage", label: "Beach cottage", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "pet-cleaning", label: "Pet or pet cleaning", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "cooking-service", label: "Cooking service", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "shopping-service", label: "Shopping service", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "babysitting-service", label: "Babysitting service", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
  { key: "additional-cleaning", label: "Additional cleaning", sourceDraftAmountsPhp: [], status: "owner-confirmation-required" },
] as const satisfies readonly FeeRecord[];

export const publicFeeMessage =
  "Please confirm the current fee with the host. No amount is published until the owner approves a consistent fee schedule.";
