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
import {
  isContactInquiryEnabled,
  isContactInquiryVisible,
} from "@/lib/config/features";
import { INQUIRY_PRIVACY_NOTICE_VERSION } from "@/lib/inquiries/constants";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Understand Villa Vessela's optional analytics choice, minimized data, browser storage, administrator access, retention, and privacy safeguards.",
  path: "/privacy",
  title: "Privacy",
});

export const dynamic = "force-dynamic";

function getInformationCards(
  inquiryEnabled: boolean,
  inquiryVisible: boolean,
) {
  return [
    {
      icon: ChartNoAxesCombined,
      title: "Anonymous website analytics",
      content: (
        <>
          <p>
            Analytics is optional. The site waits for an explicit Allow analytics choice
            before it creates analytics identifiers or sends a page-view or approved
            external-link event.
          </p>
          <p>
            When allowed, an event can include a random visitor ID, a separate session ID,
            the public page path, an origin-only referrer when available, coarse device and
            browser categories, and a timestamp. An approved external-link click can also
            include the link type, configured destination, and source page.
          </p>
          <p>
            The application does not intentionally collect or store a visitor name, raw IP
            address, exact location, full referrer path, search terms, device fingerprint,
            or a claim about who clicked a link.
          </p>
        </>
      ),
    },
    ...(inquiryVisible
      ? [
          {
            icon: FileText,
            title: "Website inquiries",
            content: (
              <>
                {inquiryEnabled ? (
                  <>
                    <p>
                      Website inquiry collection is active. If you choose to submit, the
                      form collects your name, at least one email or phone/messaging
                      contact, your message and consent, plus any guest count or preferred
                      dates you choose to provide.
                    </p>
                    <p>
                      The stored record also includes a random submission identifier used
                      to prevent duplicate retry records, the applicable privacy-notice
                      version, its review status, and its submission time. A separate random
                      form-session identifier supports rate limiting and is not stored with
                      the inquiry.
                    </p>
                    <p>
                      Villa Vessela uses the record to review and respond to the request. An
                      inquiry is not an availability confirmation, booking, payment, or
                      promise of a response time. The website sends no automatic reply and
                      no email, SMS, or push notification to the operator.
                    </p>
                  </>
                ) : (
                  <p>
                    Website inquiry collection is currently disabled. The preview form
                    cannot be submitted, so it creates no new inquiry record. Previously
                    collected records, if any, remain subject to the access, retention, and
                    deletion practices below. Guests can instead choose an owner-approved
                    channel on the Contact page.
                  </p>
                )}
                <p>
                  The form never asks for payment-card information. Do not send
                  payment-card, banking, password, government-ID, or medical details
                  through the website or an external contact channel.
                </p>
              </>
            ),
          },
        ]
      : []),
    {
      icon: UserRoundCheck,
      title: "Administrator access",
      content: inquiryVisible ? (
        <>
          <p>
            Only an authenticated account with a separately approved administrator profile
            may read stored analytics or inquiry records. An approved administrator may
            update an inquiry&apos;s review status, export a bounded inquiry CSV, or delete one
            exact inquiry after confirmation. Database Row Level Security remains
            authoritative for administrator reads and status changes.
          </p>
          <p>
            The protected inquiry page is the operator&apos;s inbox and is checked daily while
            collection is active. Administrator routes are excluded from public analytics
            and do not create public page-view or link-click events.
          </p>
        </>
      ) : (
        <p>
          Only an authenticated account with a separately approved administrator profile
          may read stored analytics. Administrator routes are excluded from public
          analytics and do not create public page-view or link-click events. Database Row
          Level Security remains authoritative for administrator reads.
        </p>
      ),
    },
  ] as const;
}

export default function PrivacyPage() {
  const inquiryEnabled = isContactInquiryEnabled();
  const inquiryVisible = isContactInquiryVisible();
  const informationCards = getInformationCards(
    inquiryEnabled,
    inquiryVisible,
  );

  return (
    <main id="main-content">
      <PageHero
        currentPage="Privacy"
        currentPath="/privacy"
        description="This page explains the optional analytics choice, the limited data the website can process, what it deliberately avoids, and how to make a privacy request."
        eyebrow="Privacy and data use"
        title="A clear account of the website's data practices"
      />

      <section aria-labelledby="privacy-overview" className="py-20 sm:py-24">
        <Container size="wide">
          <PageSectionHeading
            description={
              inquiryVisible
                ? "Public visitors never need an account. Core property information remains readable when analytics, inquiries, or Supabase storage are unavailable."
                : "Public visitors never need an account. Core property information remains readable when analytics or Supabase storage is unavailable."
            }
            eyebrow="Current technical behavior"
            id="privacy-overview"
            title="Purpose-limited collection with explicit boundaries"
          />

          <DisclosureNote className="mt-8" title="Your analytics choice comes first">
            <p>
              This notice documents the implemented system; it is not a claim of legal
              compliance. Public content remains available if you decline analytics, and
              declining does not disable booking, contact, map, or navigation links.
            </p>
          </DisclosureNote>

          <div
            className={`mt-10 grid gap-6 ${
              inquiryVisible ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
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
                <dt className="font-semibold">Analytics preference</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  A local-storage value named <code>vv_analytics_preference</code> remembers
                  an allowed or declined choice. It is not an analytics identifier or
                  event, and remains until you change it or clear this site&apos;s browser
                  data. Use Analytics settings to change the choice later. Choosing
                  Decline stops future analytics, expires the visitor cookie, and removes
                  analytics session storage; previously stored anonymous events remain
                  subject to the retention schedule below.
                </dd>
              </div>
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Analytics visitor cookie</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  After you allow analytics, a random UUID named <code>vv_visitor_id</code>
                  can be set with a maximum age of 365 days, SameSite=Lax, and Secure on
                  HTTPS. It is not created before that choice.
                </dd>
              </div>
              <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                <dt className="font-semibold">Analytics session storage</dt>
                <dd className="text-sm leading-6 text-foreground/75">
                  After you allow analytics, a random session UUID and last-activity time
                  can be stored in this browser tab. The logical session rotates after
                  more than 30 minutes of inactivity.
                </dd>
              </div>
              {inquiryVisible ? (
                <div className="grid gap-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-7">
                  <dt className="font-semibold">Inquiry form storage</dt>
                  <dd className="text-sm leading-6 text-foreground/75">
                    {inquiryEnabled ? (
                      <>
                        Form answers remain in the open page after an unsuccessful attempt
                        so you can correct or retry them; this application does not copy
                        those answers into local or session storage. A random form-session
                        UUID may be kept in session storage for rate limiting. A separate
                        random submission UUID stays with the open form across retries and
                        is replaced after the request is accepted.
                      </>
                    ) : (
                      <>
                        Inquiry collection is disabled. The preview does not create an
                        inquiry identifier, write form answers to browser storage, or submit
                        them to the database.
                      </>
                    )}
                  </dd>
                </div>
              ) : null}
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
                link reporting after a visitor allows it.
              </li>
              {inquiryVisible ? (
                <li>
                  {inquiryEnabled
                    ? "Submitted inquiry details are used only to review and respond to the property request."
                    : "Website inquiry collection is disabled; the preview cannot create a new inquiry record."}
                </li>
              ) : null}
              <li>
                The application contains no advertising, data-broker, or sale-of-data
                integration.
              </li>
              <li>
                Hosting and database providers may process network and stored data needed
                to operate the service.
              </li>
              {inquiryVisible ? (
                <li>
                  An approved administrator can export inquiry records to a private CSV
                  when operationally necessary. A downloaded file is a separate copy and
                  must be deleted separately when it is no longer needed or when a verified
                  request covers it.
                </li>
              ) : null}
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
            <p className="mt-4 text-base leading-7 text-foreground/80">
              Google Maps and Waze embeds remain unloaded until a visitor chooses a map
              provider. Loading either map shares normal connection information, such as
              the visitor’s IP address and browser details, with that provider. Villa
              Vessela does not request the visitor’s device location.
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
              Analytics page-view and approved link-click records become eligible for
              automatic deletion once they are older than 365 days. A database job checks
              and deletes eligible analytics records daily.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Under normal operation, an eligible record is removed by the next daily run
              — up to one scheduled run later. If the database project is paused or the
              scheduled run cannot execute, deletion can be delayed until the project is
              active and a later run succeeds.
            </p>
            {inquiryVisible ? (
              <p className="mt-4 text-base leading-7 text-white/80">
                Website inquiry collection may be enabled only after its daily active-table
                retention process is operational. While that process is active, stored
                inquiry records are checked daily and deleted once they are strictly older
                than 365 days from submission, regardless of review status. Preferred dates
                can be later than that retention period, so confirmed booking and payment
                communication must remain in the approved booking channel rather than
                relying on the inquiry row.
              </p>
            ) : null}
          </div>

          <div className="rounded-card border border-white/20 bg-white/10 p-6 sm:p-8">
            <h3 className="text-xl font-semibold">Privacy choices and requests</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/80">
              <li>Declining analytics keeps all public property content available.</li>
              <li>Use Analytics settings to change your choice at any time.</li>
              {inquiryVisible ? (
                <li>
                  {inquiryEnabled
                    ? "Submitting an inquiry does not change your separate analytics choice."
                    : "Inquiry collection is disabled; no new inquiry can be submitted."}
                </li>
              ) : null}
              <li>Analytics identifiers are random and are not intended to identify you.</li>
              {inquiryVisible ? (
                <li>
                  After verifying a request, the approved operator can delete one exact
                  inquiry from the active table before its scheduled expiry.
                </li>
              ) : null}
            </ul>
            <p className="mt-6 text-sm leading-6 text-white/80">
              For a privacy question or request about website data, use an owner-approved
              channel listed on the{" "}
              <Link
                className="rounded-sm font-semibold text-white underline underline-offset-4"
                href="/contact"
                prefetch={false}
              >
                Contact page
              </Link>
              . This notice does not embed a contact value, so the configured Contact
              route remains the source of truth.
            </p>
            {inquiryVisible ? (
              <p className="mt-4 text-sm leading-6 text-white/70">
                Active-table deletion does not instantly remove provider backup copies,
                browser autofill or history, a downloaded CSV, or information copied to an
                external booking or messaging channel. Those copies follow their own
                provider and secure-deletion lifecycles.
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <section aria-labelledby="privacy-updates" className="py-12">
        <Container size="wide">
          <h2 className="sr-only" id="privacy-updates">
            Privacy notice updates
          </h2>
          <p className="text-sm leading-6 text-foreground/70">
            Last updated{" "}
            <time dateTime={INQUIRY_PRIVACY_NOTICE_VERSION}>
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(`${INQUIRY_PRIVACY_NOTICE_VERSION}T00:00:00Z`))}
            </time>
            . Update this notice whenever collection, storage, providers, retention,
            contact channels, or guest choices change.
          </p>
        </Container>
      </section>
    </main>
  );
}
