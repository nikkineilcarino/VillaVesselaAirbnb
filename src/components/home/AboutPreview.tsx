import { Flower2, Home, ShieldCheck, Waves } from "lucide-react";

import { SampaguitaDivider } from "@/components/branding/SampaguitaDivider";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

import { SectionHeading } from "./SectionHeading";

const qualities = [
  { icon: Home, text: "Free-standing holiday home" },
  { icon: Waves, text: "About one minute to the beach" },
  { icon: ShieldCheck, text: "Private gated compound" },
  { icon: Flower2, text: "Sea, balcony, and garden outlooks" },
] as const;

export function AboutPreview() {
  return (
    <section
      aria-labelledby="about-title"
      className="bg-surface-muted py-20 sm:py-24"
      id="about"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]" size="wide">
        <div>
          <SectionHeading
            description={siteConfig.description}
            eyebrow="About Villa Vessela"
            id="about-title"
            title="A quiet tropical base for families and groups"
          />
          <div className="mt-7 space-y-5 text-base leading-8 text-foreground/72">
            <p>
              The villa overlooks the powdery white sand beach and offers a peaceful
              setting away from heavy traffic and city pollution. Its spacious front
              yard is framed by a tropical garden, with one carport and room for three
              to four cars inside the compound.
            </p>
            <p>
              The villa has complete household utilities for day-to-day stay needs.
              Internet access remains mobile-network based rather than fixed Wi-Fi, and
              signal and speed may vary.
            </p>
            <p>
              The compound may suit family stays, small group outings, reunions, and
              celebrations, subject to host approval, capacity limits, charges, and
              property rules.
            </p>
          </div>
          <SampaguitaDivider className="mt-9" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {qualities.map(({ icon: Icon, text }) => (
            <div
              className="rounded-card border border-border bg-surface p-6 shadow-soft"
              key={text}
            >
              <Icon aria-hidden="true" className="text-secondary" size={29} strokeWidth={1.6} />
              <p className="mt-5 font-semibold leading-6">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
