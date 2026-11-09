"use client";

import Link from "next/link";

export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="pt-28 md:pt-36 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-4">No pudimos cargar el blog</h1>
        <p className="text-slate-600 mb-8">
          Tuvimos un problema temporal al cargar los artículos. Intenta de nuevo en unos segundos.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 rounded-full bg-brand-navy px-6 font-semibold text-white hover:bg-brand-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy/20 px-6 font-semibold text-brand-navy hover:border-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
