import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Administrator",
};

type AdminRootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <div className="min-h-screen bg-surface-muted">{children}</div>;
}
