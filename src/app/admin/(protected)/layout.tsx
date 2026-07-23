import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const profile = await requireAdmin();

  return (
    <>
      <AdminHeader displayName={profile.display_name} />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-14" id="main-content">
        {children}
      </main>
    </>
  );
}
