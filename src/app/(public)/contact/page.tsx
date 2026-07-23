import {
  AtSign,
  House,
  Mail,
  MessageCircleMore,
  Phone,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import { contactChannels } from "@/data/contact";
import { isContactInquiryEnabled } from "@/lib/config/features";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Review Villa Vessela's configured booking and contact channels and, when enabled, send a validated website inquiry.",
  path: "/contact",
  title: "Contact",
});

export const dynamic = "force-dynamic";

const channelIcons = {
  airbnb: House,
  email: Mail,
  facebook: Share2,
  messenger: MessageCircleMore,
  phone: Phone,
  whatsapp: AtSign,
} as const;

export default function ContactPage() {
  const inquiryEnabled = isContactInquiryEnabled();

  return (
    <main id="main-content">
      <PageHero
        currentPage="Contact"
        currentPath="/contact"
        description="Use only a complete, owner-approved destination. Configured channels become active; missing or malformed values remain visibly inactive rather than linking to a guessed or private contact."
        eyebrow="Booking and contact"
        title="Choose a verified channel when one becomes available"
      />

      <section aria-labelledby="contact-options" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="These are the supported public channels. Each one remains inactive until its complete destination and publication permission are confirmed in configuration."
            eyebrow="Contact options"
            id="contact-options"
            title="No incomplete link is active"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contactChannels.map((channel) => {
              const Icon = channelIcons[channel.id];

              return channel.destination ? (
                <TrackedExternalLink
                  className="rounded-card border border-border bg-surface p-6 shadow-soft hover:bg-surface-muted"
                  href={channel.destination}
                  key={channel.id}
                  linkType={channel.id}
                  rel="noreferrer"
                >
                  <Icon aria-hidden="true" className="text-secondary" size={28} />
                  <h2 className="mt-5 text-xl font-semibold">{channel.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-foreground/75">Open approved destination</p>
                </TrackedExternalLink>
              ) : (
                <article className="rounded-card border border-border bg-surface p-6 shadow-soft" key={channel.id}>
                  <Icon aria-hidden="true" className="text-secondary" size={28} />
                  <h2 className="mt-5 text-xl font-semibold">{channel.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-foreground/75">{channel.note}</p>
                  <button
                    aria-label={`${channel.label}: destination awaiting confirmation`}
                    className="mt-5 min-h-11 cursor-not-allowed rounded-full border border-border bg-surface-muted px-5 text-sm font-semibold text-foreground/60"
                    disabled
                    type="button"
                  >
                    Not yet available
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-card border border-accent/35 bg-accent/10 p-6">
            <h2 className="font-semibold">Airbnb payment safety</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/75">
              Guests booking through Airbnb should communicate and complete payment through Airbnb. This website does not collect direct card payments.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="inquiry-shell" className="bg-surface-muted py-20 sm:py-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]" size="wide">
          <PageSectionHeading
            description={
              inquiryEnabled
                ? "Share only the details needed for the host to review and respond. Submission does not confirm availability or a booking."
                : "The optional form remains safely unavailable until the owner enables website inquiries. The contact options above continue to work independently."
            }
            eyebrow="Optional website inquiry"
            id="inquiry-shell"
            title={
              inquiryEnabled
                ? "Ask the host about your stay"
                : "Website inquiries are currently disabled"
            }
          />
          <ContactInquiryForm enabled={inquiryEnabled} />
        </Container>
      </section>
    </main>
  );
}
