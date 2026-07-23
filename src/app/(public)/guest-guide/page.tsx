import {
  Backpack,
  Check,
  Clock3,
  Compass,
  HelpCircle,
  MapPinned,
  ScrollText,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import { attractionPlanningNote, nearbyAttractions } from "@/data/attractions";
import { frequentlyAskedQuestions } from "@/data/faqs";
import { feeRecords, publicFeeMessage } from "@/data/fees";
import {
  arrivalSchedule,
  internetGuidance,
  packingGroups,
  selfCateringGuidance,
  shoppingGuide,
  waterGuidance,
} from "@/data/guestGuide";
import { houseRuleGroups } from "@/data/houseRules";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Plan a Villa Vessela stay with arrival times, packing suggestions, self-catering guidance, house rules, fee confirmations, FAQs, and nearby attractions.",
  path: "/guest-guide",
  title: "Guest Guide",
});

const guideSections = [
  { href: "#arrival", label: "Arrival" },
  { href: "#packing", label: "What to bring" },
  { href: "#self-catering", label: "Self-catering" },
  { href: "#house-rules", label: "House rules" },
  { href: "#fees", label: "Fees" },
  { href: "#attractions", label: "Attractions" },
  { href: "#faqs", label: "FAQs" },
] as const;

export default function GuestGuidePage() {
  return (
    <main id="main-content">
      <PageHero
        actions={
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary transition-colors hover:bg-surface-muted"
            href="#arrival"
          >
            Start planning
          </a>
        }
        currentPage="Guest Guide"
        currentPath="/guest-guide"
        description="Practical preparation, property care, local planning, and clear answers for a smoother coastal stay. Confirm changeable arrangements before travelling."
        eyebrow="Before your stay"
        title="A practical guide to Villa Vessela and Tondol"
      />

      <nav aria-label="Guest guide sections" className="border-b border-border bg-surface">
        <Container size="wide">
          <ul className="flex gap-2 overflow-x-auto py-4">
            {guideSections.map((section) => (
              <li className="shrink-0" key={section.href}>
                <a
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-primary hover:bg-surface-muted"
                  href={section.href}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <section aria-labelledby="arrival" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Use these supplied times unless a different arrangement is explicitly approved."
            eyebrow="Arrival and departure"
            id="arrival"
            title="Know the schedule before setting out"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {arrivalSchedule.map((item) => (
              <article className="rounded-card border border-border bg-surface p-7 shadow-soft" key={item.label}>
                <Clock3 aria-hidden="true" className="text-secondary" size={29} />
                <h3 className="mt-5 text-xl font-semibold">{item.label}</h3>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="packing" className="scroll-mt-24 bg-surface-muted py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Pack for sun, sand, insects, self-catering, and optional water activities."
            eyebrow="Packing checklist"
            id="packing"
            title="Bring the essentials for a coastal stay"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {packingGroups.map((group) => (
              <article className="rounded-card border border-border bg-surface p-6 shadow-soft" key={group.title}>
                <Backpack aria-hidden="true" className="text-secondary" size={27} />
                <h3 className="mt-5 text-xl font-semibold">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li className="flex gap-3 text-sm leading-6 text-foreground/75" key={item}>
                      <Check aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="self-catering" className="scroll-mt-24 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2" size="wide">
          <div>
            <PageSectionHeading
              description="The villa is primarily self-catering. Bring supplies and confirm any optional help before relying on it."
              eyebrow="Food and supplies"
              id="self-catering"
              title="Plan meals and shopping ahead"
            />
            <ul className="mt-8 space-y-4">
              {selfCateringGuidance.map((item) => (
                <li className="flex gap-3 text-sm leading-7 text-foreground/75" key={item}>
                  <UtensilsCrossed aria-hidden="true" className="mt-1 shrink-0 text-secondary" size={19} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <ShoppingBasket aria-hidden="true" className="text-secondary" size={27} />
              <h2 className="text-2xl font-semibold">Where to shop</h2>
            </div>
            <div className="mt-6 space-y-4">
              {shoppingGuide.map((entry) => (
                <article className="rounded-card border border-border bg-surface p-5 shadow-soft" key={entry.place}>
                  <h3 className="font-semibold">{entry.place}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/75">{entry.description}</p>
                </article>
              ))}
            </div>
          </div>

          <DisclosureNote title="Water and pressure">
            <p>{waterGuidance}</p>
          </DisclosureNote>
          <DisclosureNote title="Internet and mobile signal">
            <p>{internetGuidance}</p>
          </DisclosureNote>
        </Container>
      </section>

      <section aria-labelledby="house-rules" className="scroll-mt-24 bg-primary-dark py-20 text-white sm:py-24">
        <Container size="wide">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.18em] text-white/90 uppercase">House rules</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl" id="house-rules">
              Care for the villa, neighbours, and coast
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              These supplied rules support a safe and considerate stay. Current booking terms still take precedence where the host provides an approved update.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {houseRuleGroups.map((group) => (
              <article className="rounded-card border border-white/15 bg-white/8 p-6" key={group.title}>
                <ScrollText aria-hidden="true" className="text-accent" size={27} />
                <h3 className="mt-5 text-xl font-semibold">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.rules.map((rule) => (
                    <li className="flex gap-3 text-sm leading-6 text-white/75" key={rule}>
                      <Check aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={17} />
                      {rule}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="fees" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Potential replacement, damage, inclusion, and optional-service charges are centralized, but no amount is presented as current until the owner resolves the fee schedule."
            eyebrow="Fees and charges"
            id="fees"
            title="Every listed amount still requires confirmation"
          />
          <DisclosureNote className="mt-8" title="Public fee safeguard">
            <p>{publicFeeMessage}</p>
          </DisclosureNote>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {feeRecords.map((fee) => (
              <article className="rounded-card border border-border bg-surface p-5 shadow-soft" key={fee.key}>
                <h3 className="font-semibold">{fee.label}</h3>
                <p className="mt-2 inline-flex items-center gap-2 text-sm leading-6 text-foreground/75">
                  <HelpCircle aria-hidden="true" className="shrink-0 text-warning" size={18} />
                  Please confirm with the host
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="attractions" className="scroll-mt-24 bg-surface-muted py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            align="center"
            description={attractionPlanningNote}
            eyebrow="Nearby attractions"
            id="attractions"
            title="Explore the coast, islands, and local flavours"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {nearbyAttractions.map((attraction) => (
              <article className="rounded-card border border-border bg-surface p-6 shadow-soft" key={attraction.title}>
                {attraction.category === "food" ? (
                  <UtensilsCrossed aria-hidden="true" className="text-secondary" size={27} />
                ) : attraction.category === "local culture" ? (
                  <MapPinned aria-hidden="true" className="text-secondary" size={27} />
                ) : (
                  <Compass aria-hidden="true" className="text-secondary" size={27} />
                )}
                <p className="mt-5 text-xs font-bold tracking-wider text-secondary uppercase">
                  {attraction.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{attraction.title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/75">{attraction.description}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-foreground/75">
            Bring aqua shoes, sun protection, and personal snorkelling or swimming gear where appropriate. Always check current conditions locally.
          </p>
        </Container>
      </section>

      <section aria-labelledby="faqs" className="scroll-mt-24 py-20 sm:py-24">
        <Container size="narrow">
          <PageSectionHeading
            description="Answers use the supplied project information and say when the host still needs to confirm a detail."
            eyebrow="Frequently asked questions"
            id="faqs"
            title="Useful answers before you book"
          />
          <div className="mt-10 space-y-3">
            {frequentlyAskedQuestions.map((item) => (
              <details className="group rounded-card border border-border bg-surface p-5 shadow-soft" key={item.question}>
                <summary className="cursor-pointer pr-6 font-semibold leading-6 text-primary marker:text-secondary">
                  {item.question}
                </summary>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-7 text-foreground/75">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-[1.75rem] bg-primary px-6 py-9 text-center text-white sm:px-10">
            <h2 className="text-2xl font-semibold">Want to review the villa itself?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">
              Return to the room and amenity details. The external booking destination remains disabled until verified.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-semibold text-primary hover:bg-surface-muted"
                href="/accommodation"
                prefetch={false}
              >
                Accommodation
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 py-3 font-semibold text-white hover:bg-white/10"
                href="/amenities"
                prefetch={false}
              >
                Amenities
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
