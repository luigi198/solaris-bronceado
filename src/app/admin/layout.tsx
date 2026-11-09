import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Solaris" },
  description: "Panel privado de administración del blog de Solaris Bronceado.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-full flex-1 bg-slate-50 text-slate-900">{children}</div>;
}
