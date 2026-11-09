import type { Metadata } from "next";
import Link from "next/link";

// Next adds `noindex` to 404 responses itself; this replaces the English
// default title and gives visitors a way back in.
export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o cambió de dirección. Visita el inicio o el blog de Solaris Bronceado.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange-dark">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-brand-navy md:text-4xl">Página no encontrada</h1>
      <p className="mt-4 max-w-md text-slate-700">La página que buscas no existe o cambió de dirección.</p>
      <nav aria-label="Enlaces útiles" className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-brand-navy px-6 font-semibold text-white hover:bg-brand-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          Ir al inicio
        </Link>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center rounded-full border border-brand-navy px-6 font-semibold text-brand-navy hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          Leer el blog
        </Link>
      </nav>
    </main>
  );
}
