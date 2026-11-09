import Link from "next/link";
import { requireAdmin } from "@/lib/http/adminAuth";
import { ui } from "../_components/ui";
import { logoutAction, logoutEverywhereAction } from "./sessionActions";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Layouts don't re-run on every client navigation, so each page and Server
  // Action also calls requireAdmin(); this just avoids rendering chrome for guests.
  await requireAdmin();

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav aria-label="Panel" className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-brand-navy rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
              Panel del blog
            </Link>
            <Link href="/blog" target="_blank" className={`${ui.link} text-sm`}>
              Ver blog
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <form action={logoutEverywhereAction}>
              <button type="submit" className={ui.buttonSecondary}>
                Cerrar todas las sesiones
              </button>
            </form>
            <form action={logoutAction}>
              <button type="submit" className={ui.buttonSecondary}>
                Salir
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
