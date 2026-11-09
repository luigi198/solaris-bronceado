"use client";

import { useRef, useState } from "react";
import { PostBody } from "@/components/blog/PostBody";
import { useImageUpload } from "@/hooks/useImageUpload";
import { POST_RULES } from "@/lib/blog/rules";
import { ui } from "../../../_components/ui";
import { uploadImageAction } from "../actions";

const ACCEPT = "image/jpeg,image/png,image/webp";
const EDITOR_ROWS = 24;

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Applies a pasted front-matter block to the other fields. */
  onImportFrontMatter: () => void;
  error?: string;
}

export function MarkdownField({ value, onChange, onImportFrontMatter, error }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { upload, pending, error: uploadError } = useImageUpload(uploadImageAction);
  const hasFrontMatter = value.trimStart().startsWith("---");

  function insertAtCursor(snippet: string): void {
    const el = textarea.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(`${value.slice(0, start)}${snippet}${value.slice(end)}`);
  }

  const tabClass = (active: boolean) =>
    `${active ? ui.buttonPrimary : ui.buttonSecondary} rounded-b-none`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div role="tablist" aria-label="Contenido" className="flex gap-1">
          <button type="button" role="tab" aria-selected={tab === "write"} className={tabClass(tab === "write")} onClick={() => setTab("write")}>
            Escribir
          </button>
          <button type="button" role="tab" aria-selected={tab === "preview"} className={tabClass(tab === "preview")} onClick={() => setTab("preview")}>
            Vista previa
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pb-1">
          {hasFrontMatter && (
            <button type="button" className={ui.buttonSecondary} onClick={onImportFrontMatter}>
              Usar metadatos del encabezado
            </button>
          )}
          <label className={`${ui.buttonSecondary} cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange`}>
            {pending ? "Subiendo…" : "Insertar imagen"}
            <input
              type="file"
              accept={ACCEPT}
              className="sr-only"
              disabled={pending}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file, (img) => insertAtCursor(`\n\n![Describe la imagen](${img.url})\n\n`));
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {/* The textarea stays mounted (hidden in preview) so it is always submitted. */}
      <textarea
        ref={textarea}
        id="contentMarkdown"
        name="contentMarkdown"
        aria-label="Contenido en Markdown"
        aria-invalid={error ? true : undefined}
        rows={EDITOR_ROWS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        hidden={tab !== "write"}
        placeholder={"Pega aquí el artículo en Markdown.\n\n## Primera sección\nTexto…"}
        className={`${ui.input} rounded-tl-none font-mono text-sm leading-relaxed`}
      />
      {tab === "preview" && (
        <div className="rounded-lg rounded-tl-none border border-slate-300 bg-white p-4 md:p-8">
          {value ? <PostBody markdown={value} /> : <p className="text-slate-600">Nada que mostrar todavía.</p>}
        </div>
      )}

      <p className={ui.hint}>
        Markdown: <code>## Sección</code>, <code>**negrita**</code>, listas, tablas y enlaces. El HTML se ignora.{" "}
        {value.length.toLocaleString("es-CR")} / {POST_RULES.content.max.toLocaleString("es-CR")} caracteres.
      </p>
      {(uploadError || error) && (
        <p className={ui.error} role="alert">
          {uploadError ?? error}
        </p>
      )}
    </div>
  );
}
