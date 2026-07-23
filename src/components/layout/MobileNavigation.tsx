"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { TrackedExternalLink } from "@/components/analytics/TrackedExternalLink";
import { VillaLogo } from "@/components/branding/VillaLogo";
import { Button } from "@/components/ui/Button";
import { primaryBookingAction, publicNavigation } from "@/data/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocus = useRef(false);

  const closeMenu = useCallback((restoreFocus = true) => {
    shouldRestoreFocus.current = restoreFocus;
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (shouldRestoreFocus.current) {
        triggerRef.current?.focus();
        shouldRestoreFocus.current = false;
      }
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstControl = panel?.querySelector<HTMLElement>("[data-menu-autofocus]");
    firstControl?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const controls = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'),
      );
      const first = controls[0];
      const last = controls.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <div className="xl:hidden">
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label="Open site menu"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 font-semibold text-primary transition-colors hover:bg-surface-muted"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <Menu aria-hidden="true" size={20} strokeWidth={1.8} />
        <span className="hidden sm:inline">Menu</span>
      </button>

      {isOpen ? (
        <>
          <button
            aria-hidden="true"
            className="fixed inset-0 z-40 cursor-default bg-primary-dark/45"
            onClick={() => closeMenu()}
            tabIndex={-1}
            type="button"
          />
          <div
            aria-label="Site navigation"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-y-auto bg-background shadow-2xl"
            id="mobile-navigation-panel"
            ref={panelRef}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <VillaLogo className="w-16" format="mark" />
              <button
                aria-label="Close site menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-primary transition-colors hover:bg-surface-muted"
                data-menu-autofocus
                onClick={() => closeMenu()}
                type="button"
              >
                <X aria-hidden="true" size={22} strokeWidth={1.8} />
              </button>
            </div>

            <nav aria-label="Mobile primary" className="flex-1 px-5 py-6">
              <ul className="space-y-1.5">
                {publicNavigation.map((item) => (
                  <li key={item.label}>
                    {item.status === "available" ? (
                      <Link
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="flex min-h-12 items-center rounded-xl bg-surface-muted px-4 text-base font-semibold text-primary"
                        href={item.href}
                        onClick={() => closeMenu(false)}
                        prefetch={false}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-semibold text-foreground/55"
                      >
                        {item.label}
                        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-secondary uppercase">
                          Soon
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border p-5">
              {primaryBookingAction.href ? (
                <TrackedExternalLink
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
                  href={primaryBookingAction.href}
                  linkType="airbnb"
                  onClick={() => closeMenu(false)}
                >
                  {primaryBookingAction.label}
                </TrackedExternalLink>
              ) : (
                <Button
                  aria-label={`${primaryBookingAction.label}: ${primaryBookingAction.unavailableReason}`}
                  className="w-full"
                  disabled
                  size="large"
                  title={primaryBookingAction.unavailableReason}
                >
                  {primaryBookingAction.label}
                </Button>
              )}
              <p className="mt-3 text-center text-xs leading-5 text-foreground/60">
                {primaryBookingAction.href
                  ? "Opens the approved Airbnb listing"
                  : "Listing link awaiting confirmation"}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
