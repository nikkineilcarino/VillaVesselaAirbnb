"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="grid min-h-screen place-items-center py-16" id="main-content">
      <Container size="narrow">
        <div className="text-center" role="alert">
          <p className="text-sm font-semibold tracking-[0.18em] text-danger uppercase">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            We could not load this page.
          </h1>
          <p className="mx-auto mt-4 max-w-prose leading-7 text-foreground/75">
            Please try again. No sensitive error details are displayed here.
          </p>
          <Button className="mt-8" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </main>
  );
}
