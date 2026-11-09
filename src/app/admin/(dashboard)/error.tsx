"use client";

import Link from "next/link";
import { ui } from "../_components/ui";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={ui.card} role="alert">
      <h1 className="text-xl font-bold text-brand-navy mb-2">Algo salió mal</h1>
      <p className="text-slate-600 mb-1">
        No se pudo completar la operación. Si el problema continúa, revisa la conexión a la base de datos.
      </p>
      {error.digest && <p className="text-xs text-slate-500 mb-4">Referencia: {error.digest}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={reset} className={ui.buttonPrimary}>
          Reintentar
        </button>
        <Link href="/admin" className={ui.buttonSecondary}>
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}
