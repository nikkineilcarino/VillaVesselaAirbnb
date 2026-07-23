import {
  ChartNoAxesCombined,
  Cookie,
  Database,
  ExternalLink,
  FileText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DisclosureNote } from "@/components/public/DisclosureNote";
import { PageHero } from "@/components/public/PageHero";
import { PageSectionHeading } from "@/components/public/PageSectionHeading";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Understand Villa Vessela's current analytics, browser storage, optional inquiry, administrator, retention, and privacy safeguards.",
  path: "/privacy",
  title: "Privacy",
});

const informationCards = [
  {
    icon: ChartNoAxesCombined,
    title: "Anonymous website analytics",
    content: (
      <>
        <p>
          When analytics is enabled, the site records a random visitor ID, a separate
          session ID, the public page path, an origin-only referrer when available,
          coarse device and browser categories, and a timestamp. Approved external-link
          clicks can also record the link type, configured destination, and source page.
        </p>
        <p>
          The application does not intentionally collect or store a visitor name, raw IP
          address, exact location, full referrer path, search terms, device fingerprint,
          or a claim about who clicked a link.
        </p>
      </>
    ),
  },
  {
    icon: FileText,
    title: "Optional property inquiries",
    content: (
      <>
        <p>
          Website inquiries are disabled by default. If enabled, a guest may voluntarily
          provide a name, email or phone/messaging number, preferred dates, guest count,
          message, consent, and submission time. An inquiry is not a booking or payment.
        </p>
        <p>
          The form never asks for payment-card information. Its random session-scoped
          rate-limit identifier is not stored with the inquiry.
        </p>
      </>
    ),
  },
  {
    icon: UserRoundCheck,
    title: "Administrator access",
    content: (
      <p>
        Only an authenticated account with a separately approved administrator profile
        may read analytics or inquiries. Row Level Security remains authoritative for
        reads and permits only the inquiry status field to be changed through the
        administrator workflow.
      </p>
    ),
  },
] as const;

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        currentPage="Privacy"
        currentPath="/privacy"
        description="This page describes the data the current website design can process, what it deliberately avoids, and which operational decisions must still be approved before production."
        eyebrow="Privacy and data use"
        title="A clear account of the website's data practices"
      />

      <section aria-labelledby="privacy-overview" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description="Public visitors never need an account. Core property information remains readable when analytics, inquiries, or Supabase storage are unavailable."
            eyebrow="Current technical behavior"
            id="privacy-overview"
            title="Purpose-limited collection with explicit boundaries"
          />

          <DisclosureNote className="mt-8" title="Operational approval is still required">
            <p>
              This notice documents the implemented system; it is not a claim of legal
              compliance. A production retention/deletion schedule, privacy-request
              channel, and any legally required consent control must be approved before
              production collection is treated as ready.
            </p>
          </DisclosureNote>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {informationCards.map(({ content, icon: Icon, title }) => (
              <article
                className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8"
                key={title}
              >
                <Icon aria-hidden="true" className="text-secondary" size={28} />
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <div className="mt-3 space-y-4 text-sm leading-7 text-foreground/80">
                  {content}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="browser-storage"
        className="border-y border-border bg-surface-muted/55 py-20 sm:py-24"
      >
        <Container className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr]" size="wide">
          <div>
            <Cookie aria-hidden="true" className="text-secondary" size={32} />
            <h2 className="mt-5 text-3xl font-semibold tracking-tight" id="browser-storage">
              Cookies and browser storage
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/75">
              The site contains no advertising pixel or cross-site advertising cookie.
            </p>
          </div>

          <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
            <dl className="divide-y divide-border">
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Analytics visitor cookie</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  A random UUID named <code>vv_visitor_id</code>, set only when analytics
                  runs, with a maximum age of 365 days, SameSite=Lax, and Secure on HTTPS.
                </dd>
              </div>
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Analytics session storage</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  A random session UUID and last-activity time in this browser tab. The
                  logical session rotates after more than 30 minutes of inactivity.
                </dd>
              </div>
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Inquiry form storage</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  A separate random UUID may remain in session storage for rate limiting.
                  Form answers are not placed in local storage and are retained in the
                  page only when a submission fails.
                </dd>
              </div>
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Administrator cookies</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  Supabase authentication cookies support approved administrator sessions.
                  They use SameSite=Lax and Secure in production and are not used for
                  public visitor accounts.
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section aria-labelledby="use-and-sharing" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2" size="wide">
          <article>
            <Database aria-hidden="true" className="text-secondary" size={30} />
            <h2 className="mt-5 text-2xl font-semibold" id="use-and-sharing">
              Use, access, and service providers
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-foreground/80">
              <li>
                Analytics is used only for aggregate traffic, device, page, and approved
                link reporting.
              </li>
              <li>
                Inquiry details are used only to review and respond to the guest’s
                property question and manage its response status.
              </li>
              <li>
                The application contains no advertising, data-broker, or sale-of-data
                integration.
              </li>
              <li>
                Hosting and database providers may process network and stored data needed
                to operate the service. Their final production configuration and terms
                must be reviewed during release.
              </li>
            </ul>
          </article>

          <article>
            <ExternalLink aria-hidden="true" className="text-secondary" size={30} />
            <h2 className="mt-5 text-2xl font-semibold">External booking and contact sites</h2>
            <p className="mt-5 text-base leading-7 text-foreground/80">
              Only complete, owner-approved destinations can become active. Choosing an
              external booking, social, map, messaging, telephone, or email link leaves
              this website, and the destination’s own privacy practices apply. The site
              does not collect payment.
            </p>
          </article>
        </Container>
      </section>

      <section
        aria-labelledby="retention-requests"
        className="border-t border-border bg-primary-dark py-20 text-white sm:py-24"
      >
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]" size="wide">
          <div>
            <ShieldCheck aria-hidden="true" className="text-accent" size={32} />
            <h2 className="mt-5 text-3xl font-semibold" id="retention-requests">
              Retention, deletion, and requests
            </h2>
            <p className="mt-5 text-base leading-7 text-white/80">
              No automatic analytics or inquiry deletion schedule has been approved or
              implemented yet. This is a launch blocker, not a promise to retain records
              indefinitely.
            </p>
          </div>

          <div className="rounded-card border border-white/20 bg-white/10 p-6 sm:p-8">
            <h3 className="text-xl font-semibold">Before production collection</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/80">
              <li>Approve and implement separate analytics and inquiry retention periods.</li>
              <li>Assign responsibility for access, correction, export, and deletion requests.</li>
              <li>Publish an owner-approved privacy contact channel and response process.</li>
              <li>Verify deletion and administrator access against the production database.</li>
            </ul>
            <p className="mt-6 text-sm leading-6 text-white/80">
              Until a privacy contact is approved, the{" "}
              <Link
                className="rounded-sm font-semibold text-white underline underline-offset-4"
                href="/contact"
                prefetch={false}
              >
                Contact page
              </Link>{" "}
              truthfully shows unavailable channels rather than exposing a private or
              guessed address.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="privacy-updates" className="py-12">
        <Container size="wide">
          <h2 className="sr-only" id="privacy-updates">
            Privacy notice updates
          </h2>
          <p className="text-sm leading-6 text-foreground/70">
            Last updated <time dateTime="2026-07-23">23 July 2026</time>. Update this
            notice whenever collection, storage, providers, retention, contact channels,
            or guest choices change.
          </p>
        </Container>
      </section>
    </main>
  );
}
