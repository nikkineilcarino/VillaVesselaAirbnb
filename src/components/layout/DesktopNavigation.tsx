"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { publicNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden xl:block">
      <ul className="flex items-center gap-0.5">
        {publicNavigation.map((item) => {
          const isActive = item.href === pathname;

          return (
            <li key={item.label}>
              {item.status === "available" ? (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-3 text-[0.78rem] font-semibold transition-colors",
                    isActive
                      ? "bg-surface-muted text-primary"
                      : "text-foreground/75 hover:bg-surface-muted hover:text-primary",
                  )}
                  href={item.href}
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full px-3 text-[0.78rem] font-semibold text-foreground/45"
                  title={`${item.label} page is coming in a later phase`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
