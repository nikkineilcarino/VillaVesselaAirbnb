import Link from "next/link";

import { SampaguitaDivider } from "@/components/branding/SampaguitaDivider";
import { VillaLogo } from "@/components/branding/VillaLogo";
import { Container } from "@/components/ui/Container";
import { primaryBookingAction, publicNavigation } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <Container className="py-14 sm:py-16" size="wide">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <VillaLogo className="w-[17rem] max-w-full" tone="light" />
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75">
              A peaceful, family-friendly villa near the sandy shores of Tondol
              Beach in Anda, Pangasinan.
            </p>
            <SampaguitaDivider className="mt-7 text-accent" />
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.16em] text-white uppercase">
              Explore
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
              {publicNavigation.map((item) => (
                <li key={item.label}>
                  {item.status === "available" ? (
                    <Link
                      className="rounded-sm text-white/80 hover:text-white"
                      href={item.href}
                      prefetch={false}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-disabled="true" className="text-white/50">
                      {item.label}
                      <span className="sr-only"> (coming soon)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-[0.16em] text-white uppercase">
              Visit
            </h2>
            <address className="mt-5 text-sm leading-6 text-white/75 not-italic">
              Tondol, Purok 2
              <br />
              Anda, Pangasinan
              <br />
              Philippines
            </address>
            <p className="mt-5 text-sm leading-6 text-white/60">
              {primaryBookingAction.href
                ? "Only configured, owner-approved public destinations are active."
                : `${primaryBookingAction.unavailableReason}. No unverified contact details are published.`}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs leading-5 text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Villa Vessela. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              className="rounded-sm underline underline-offset-4 hover:text-white"
              href="/privacy"
              prefetch={false}
            >
              Privacy
            </Link>
            <p>Independent property website. Airbnb does not endorse this website.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
