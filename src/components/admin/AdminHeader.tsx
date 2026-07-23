import { BarChart3, ExternalLink, Inbox, LogOut } from "lucide-react";
import Link from "next/link";

import { logoutAdmin } from "@/app/admin/(protected)/actions";
import { VillaLogo } from "@/components/branding/VillaLogo";
import { Button } from "@/components/ui/Button";

type AdminHeaderProps = {
  displayName: string;
};

export function AdminHeader({ displayName }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link aria-label="Villa Vessela public homepage" href="/">
            <VillaLogo className="w-36 sm:w-40" />
          </Link>
          <span aria-hidden="true" className="hidden h-8 w-px bg-border sm:block" />
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-secondary uppercase">Administrator</p>
            <p className="truncate text-sm text-foreground/65">Signed in as {displayName}</p>
          </div>
        </div>

        <nav aria-label="Administrator navigation" className="flex flex-wrap items-center gap-2">
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted"
            href="/admin/dashboard"
          >
            <BarChart3 aria-hidden="true" size={16} />
            Dashboard
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted"
            href="/admin/inquiries"
          >
            <Inbox aria-hidden="true" size={16} />
            Inquiries
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted"
            href="/"
          >
            Public site
            <ExternalLink aria-hidden="true" size={16} />
          </Link>
          <form action={logoutAdmin}>
            <Button className="gap-2" size="small" type="submit" variant="secondary">
              <LogOut aria-hidden="true" size={16} />
              Sign out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
