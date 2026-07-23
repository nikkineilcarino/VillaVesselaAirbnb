import Link from "next/link";
import type { ReactNode } from "react";

import { StructuredData } from "@/components/seo/StructuredData";
import { Container } from "@/components/ui/Container";
import { createBreadcrumbStructuredData } from "@/lib/seo/structuredData";

export type PageHeroProps = {
  actions?: ReactNode;
  currentPage: string;
  currentPath: `/${string}`;
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHero({
  actions,
  currentPage,
  currentPath,
  description,
  eyebrow,
  title,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-dark py-16 text-white sm:py-20 lg:py-24">
      <StructuredData
        data={createBreadcrumbStructuredData(currentPage, currentPath)}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_16%,rgba(114,184,197,0.25),transparent_32%),radial-gradient(circle_at_90%_84%,rgba(199,154,68,0.2),transparent_28%)]"
      />
      <Container size="wide">
        <nav aria-label="Breadcrumb" className="text-sm text-white/75">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="rounded-sm underline-offset-4 hover:underline" href="/" prefetch={false}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">
              {currentPage}
            </li>
          </ol>
        </nav>

        <div className="mt-10 max-w-4xl">
          <p className="text-sm font-bold tracking-[0.18em] text-white/90 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
            {description}
          </p>
          {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
