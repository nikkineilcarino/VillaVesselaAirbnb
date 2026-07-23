import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { VillaLogo } from "@/components/branding/VillaLogo";
import { getAdminAccess } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: "Secure administrator access for the Villa Vessela website.",
  title: "Administrator sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

function getNotice(value: string | string[] | undefined) {
  const notice = Array.isArray(value) ? value[0] : value;

  if (notice === "signed-out") {
    return "You have signed out securely.";
  }

  if (notice === "denied") {
    return "Unable to continue with this account.";
  }

  if (notice === "unavailable") {
    return "Administrator access is unavailable right now. Please try again later.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [access, resolvedSearchParams] = await Promise.all([
    getAdminAccess(),
    searchParams,
  ]);

  if (access.status === "authorized") {
    redirect("/admin/dashboard");
  }

  const isConfigured = access.status !== "unconfigured";
  const notice = getNotice(resolvedSearchParams.notice);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12 sm:px-8" id="main-content">
      <section
        aria-labelledby="admin-login-heading"
        className="w-full max-w-md rounded-[1.75rem] border border-border bg-surface p-6 shadow-soft sm:p-9"
      >
        <VillaLogo className="mx-auto w-48" priority />
        <div className="mt-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-secondary uppercase">
            Private administration
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight" id="admin-login-heading">
            Administrator sign in
          </h1>
          <p className="mt-3 leading-7 text-foreground/70">
            Authorized Villa Vessela administrators only. Public visitors do not need an account.
          </p>
        </div>

        {notice ? (
          <p className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm leading-6" role="status">
            {notice}
          </p>
        ) : null}

        <AdminLoginForm isConfigured={isConfigured} />

        <p className="mt-6 text-center text-xs leading-5 text-foreground/70">
          There is no public registration or default administrator password.
        </p>
      </section>
    </main>
  );
}
