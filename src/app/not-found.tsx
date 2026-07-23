import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center py-16" id="main-content">
      <Container size="narrow">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-secondary uppercase">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            This page could not be found.
          </h1>
          <p className="mx-auto mt-4 max-w-prose leading-7 text-foreground/75">
            The address may have changed, or the page may not exist yet.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            href="/"
            prefetch={false}
          >
            Return home
          </Link>
        </div>
      </Container>
    </main>
  );
}
