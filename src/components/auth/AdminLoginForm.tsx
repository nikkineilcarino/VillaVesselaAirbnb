"use client";

import { LockKeyhole } from "lucide-react";
import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/login/actions";
import type { AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/Button";

type AdminLoginFormProps = {
  isConfigured: boolean;
};

const initialAdminLoginState: AdminLoginState = {
  message: "",
  status: "idle",
};

export function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialAdminLoginState);
  const isDisabled = !isConfigured || isPending;

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label className="text-sm font-semibold" htmlFor="admin-email">
          Email address
        </label>
        <input
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base disabled:cursor-not-allowed disabled:bg-surface-muted"
          disabled={!isConfigured}
          id="admin-email"
          inputMode="email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>

      <div>
        <label className="text-sm font-semibold" htmlFor="admin-password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-base disabled:cursor-not-allowed disabled:bg-surface-muted"
          disabled={!isConfigured}
          id="admin-password"
          maxLength={256}
          name="password"
          required
          type="password"
        />
      </div>

      <div aria-live="polite" className="min-h-6">
        {state.status === "error" ? (
          <p className="text-sm leading-6 text-danger" role="alert">
            {state.message}
          </p>
        ) : null}
        {!isConfigured ? (
          <p className="text-sm leading-6 text-warning" role="status">
            Administrator sign-in has not been configured for this environment.
          </p>
        ) : null}
      </div>

      <Button className="w-full gap-2" disabled={isDisabled} size="large" type="submit">
        <LockKeyhole aria-hidden="true" size={18} strokeWidth={2} />
        {isPending ? "Signing in…" : "Sign in securely"}
      </Button>
    </form>
  );
}
