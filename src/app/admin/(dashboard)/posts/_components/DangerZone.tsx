"use client";

import { useState, useTransition } from "react";
import type { PostStatus } from "@/lib/contracts/blog";
import { ui } from "../../../_components/ui";
import { deletePostAction, unpublishPostAction } from "../actions";
import type { SaveState } from "../types";

interface Props {
  postId: string;
  isPublished: boolean;
  /**
   * Reports the new status to the editor instead of refreshing the route, so
   * unsaved edits in the form are kept.
   */
  onStatusChange: (status: PostStatus) => void;
}

/** Unpublish / delete. Deleting needs a second click instead of a blocking browser dialog. */
export function DangerZone({ postId, isPublished, onStatusChange }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Delete redirects to the post list on success, so only failures return here.
  function run(action: () => Promise<SaveState>): void {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.kind === "idle") return;
      setMessage(result.message);
      if (result.kind === "saved") onStatusChange(result.status);
    });
  }

  return (
    <section aria-labelledby="danger-heading" className={`${ui.card} mt-10 border-red-200`}>
      <h2 id="danger-heading" className="text-base font-bold text-red-800 mb-3">
        Zona de riesgo
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {isPublished && (
          <button type="button" disabled={pending} className={ui.buttonSecondary} onClick={() => run(() => unpublishPostAction(postId))}>
            Despublicar (volver a borrador)
          </button>
        )}
        {confirming ? (
          <>
            <button type="button" disabled={pending} className={ui.buttonDanger} onClick={() => run(() => deletePostAction(postId))}>
              Sí, eliminar definitivamente
            </button>
            <button type="button" disabled={pending} className={ui.buttonSecondary} onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button type="button" disabled={pending} className={ui.buttonDanger} onClick={() => setConfirming(true)}>
            Eliminar artículo
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-2 text-sm text-slate-700">
        {pending ? "Procesando…" : message}
      </p>
    </section>
  );
}
