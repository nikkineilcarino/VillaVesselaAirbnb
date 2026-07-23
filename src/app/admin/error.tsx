"use client";

import { Button } from "@/components/ui/Button";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16" id="main-content">
      <div className="max-w-lg text-center" role="alert">
        <p className="text-sm font-semibold tracking-[0.18em] text-danger uppercase">
          Administrator area unavailable
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">We could not load this page.</h1>
        <p className="mt-4 leading-7 text-foreground/70">
          Please try again. No account, configuration, or technical error details are displayed.
        </p>
        <Button className="mt-8" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
