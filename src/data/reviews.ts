export const reviewSummary = {
  categories: [
    { label: "Cleanliness", value: 4.8 },
    { label: "Accuracy", value: 4.6 },
    { label: "Check-in", value: 5.0 },
    { label: "Communication", value: 5.0 },
    { label: "Location", value: 4.7 },
    { label: "Value", value: 4.7 },
  ],
  count: 21,
  rating: 4.76,
  source: "Airbnb listing",
} as const;

export type ReviewPreview = {
  date: string;
  name: string;
  quote: string;
  rating: number;
};

export const reviewPreviews = [
  {
    date: "April 2026",
    name: "Dyesebel",
    quote:
      "Vessela responded quickly to our questions, and the caretaker was kind and considerate. They also shared helpful recommendations about places to visit near the villa. The stay offered excellent value.",
    rating: 5,
  },
  {
    date: "May 2026",
    name: "Helda",
    quote: "A clean and comfortable place to stay.",
    rating: 5,
  },
  {
    date: "March 2026",
    name: "Rosalie",
    quote:
      "The house was clean, the air-conditioning kept the rooms comfortable, and the caretaker was accommodating.",
    rating: 5,
  },
] as const satisfies readonly ReviewPreview[];

export const messengerReviewPlaceholders = [
  { id: "messenger-review-1", label: "Approved Messenger review pending" },
  { id: "messenger-review-2", label: "Approved Messenger review pending" },
  { id: "messenger-review-3", label: "Approved Messenger review pending" },
] as const;

export const reviewPublicationNote =
  "The rating, category scores, and excerpts are based on supplied Airbnb listing information. They are not live-synced, and Airbnb does not endorse this independent website.";
