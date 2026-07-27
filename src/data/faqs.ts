import { bathroomNote, expandedCapacityNote } from "./accommodation";
import { connectivityNote } from "./amenities";
import { attractionPlanningNote } from "./attractions";
import { internetGuidance, waterGuidance } from "./guestGuide";
import { primaryBookingAction } from "./navigation";
import { siteConfig } from "./site";

export type FrequentlyAskedQuestion = {
  answer: string;
  question: string;
};

export const frequentlyAskedQuestions = [
  {
    question: "How far is the beach?",
    answer: "The sandy beach is less than 100 metres away—approximately one minute on foot.",
  },
  {
    question: "How many guests can stay?",
    answer: "The confirmed standard capacity is 10 guests across the entire villa.",
  },
  {
    question: "Can more than 10 guests be accepted?",
    answer: expandedCapacityNote,
  },
  {
    question: "What bathroom facilities are available?",
    answer: bathroomNote,
  },
  {
    question: "Is Wi-Fi available?",
    answer: connectivityNote,
  },
  {
    question: "Is mobile data reliable?",
    answer: internetGuidance,
  },
  {
    question: "Is parking free?",
    answer: "Yes. The owner confirms one carport and space for three to four cars inside the gated compound.",
  },
  {
    question: "Are pets allowed?",
    answer: "Pets require prior owner approval. Only small, trained pets may be considered, and current conditions or charges must be confirmed before booking.",
  },
  {
    question: "Is the kitchen available?",
    answer: "A main self-catering kitchen and separate dining area are included in the supplied property information. Guests should bring food, condiments, and drinks and leave the kitchen clean.",
  },
  {
    question: "Where should guests fry fish?",
    answer: "The separate kitchen kubo is shared by guests staying in the Blue and Green kubos and is used for fish and heavier frying. Guests booking only the main villa should confirm whether access is included.",
  },
  {
    question: "Are cooking and shopping services available?",
    answer: "Cooking, shopping, babysitting, serving, and additional cleaning may be available, subject to current availability and unconfirmed extra fees. Please confirm with the host.",
  },
  {
    question: "What are the check-in and checkout times?",
    answer: `Check-in is ${siteConfig.checkIn.toLowerCase()}, and checkout is ${siteConfig.checkOut.toLowerCase()}.`,
  },
  {
    question: "Is the property suitable for birthdays or reunions?",
    answer: "Small gatherings may be considered only with prior host approval and remain subject to capacity limits, charges, quiet hours, and property rules.",
  },
  {
    question: "Can tours be arranged?",
    answer: attractionPlanningNote,
  },
  {
    question: "Is videoke allowed?",
    answer: "Videoke must stop by 10:00 PM. Any gathering still requires prior approval and must follow the property rules.",
  },
  {
    question: "Is smoking allowed?",
    answer: "Smoking is not allowed inside the villa or on balconies. Use only approved outdoor smoking areas.",
  },
  {
    question: "Is drinking water provided?",
    answer: waterGuidance,
  },
  {
    question: "How can guests book?",
    answer: primaryBookingAction.href
      ? "The primary channel is the approved Airbnb destination linked from this website. Communicate and complete payment through Airbnb."
      : `The intended primary channel is Airbnb. ${primaryBookingAction.unavailableReason}, so no active booking destination is published yet.`,
  },
  {
    question: "Are the Blue and Green Kubos included?",
    answer: "Guests staying in the Blue and Green kubos share the separate kitchen kubo. Their inclusion in a standard villa booking has not been confirmed, so please confirm with the host.",
  },
  {
    question: "Is the beach cottage included?",
    answer: "A beach cottage may be available for an additional charge, but availability, inclusion, and price remain unconfirmed. Please confirm with the host.",
  },
] as const satisfies readonly FrequentlyAskedQuestion[];
