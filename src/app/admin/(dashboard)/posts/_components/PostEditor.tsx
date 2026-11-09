"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { parseFrontMatter } from "@/lib/blog/frontMatter";
import { POST_RULES } from "@/lib/blog/rules";
import { slugify } from "@/lib/blog/slug";
import { SITE_URL } from "@/lib/constants";
import type { PostStatus } from "@/lib/contracts/blog";
import { ui } from "../../../_components/ui";
import { createPostAction, updatePostAction } from "../actions";
import type { EditorValues, SaveState } from "../types";
import { CoverImageField } from "./CoverImageField";
import { DangerZone } from "./DangerZone";
import { MarkdownField } from "./MarkdownField";
import { TextField } from "./TextField";

const IDLE: SaveState = { kind: "idle" };

interface Props {
  /** Absent when creating a new post. */
  postId?: string;
  initial: EditorValues;
  initialStatus: PostStatus | null;
}

export function PostEditor({ postId, initial, initialStatus }: Props) {
  const action = postId ? updatePostAction.bind(null, postId) : createPostAction;
  const [state, formAction, pending] = useActionState(action, IDLE);
  const [values, setValues] = useState(initial);
  // New posts derive the slug from the title until the slug is edited by hand.
  const [slugLocked, setSlugLocked] = useState(Boolean(postId));

  // Status changes from saves (useActionState) and from the danger zone. Synced
  // during render when a new save result arrives, per React's guidance for
  // deriving state from changing inputs.
  const [status, setStatus] = useState(initialStatus);
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.kind === "saved") setStatus(state.status);
  }
  const liveSlug = state.kind === "saved" ? state.slug : initial.slug;
  const errors = state.kind === "error" ? state.fieldErrors : {};
  const set = (field: keyof EditorValues) => (value: string) => setValues((v) => ({ ...v, [field]: value }));

  function setTitle(title: string): void {
    setValues((v) => ({ ...v, title, slug: slugLocked ? v.slug : slugify(title) }));
  }

  function importFrontMatter(): void {
    const { fields, body } = parseFrontMatter(values.contentMarkdown);
    setValues((v) => ({
      ...v,
      title: fields.title ?? v.title,
      slug: fields.slug ? slugify(fields.slug) : slugLocked ? v.slug : slugify(fields.title ?? v.title),
      description: fields.description ?? v.description,
      seoTitle: fields.seoTitle ?? v.seoTitle,
      contentMarkdown: body,
    }));
  }

  return (
    <>
    <form action={formAction} className="space-y-6" noValidate>
      <div className={`${ui.card} space-y-5`}>
        <TextField name="title" label="Título (H1)" value={values.title} onChange={setTitle} error={errors.title} counter={{ max: POST_RULES.title.max }} />
        <TextField
          name="slug"
          label="Slug (URL)"
          value={values.slug}
          onChange={(v) => {
            setSlugLocked(true);
            set("slug")(v);
          }}
          error={errors.slug}
          hint={`${SITE_URL.replace("https://", "")}/blog/${values.slug || "…"}${postId && status === "published" ? " — si lo cambias, la URL anterior redirige a la nueva." : ""}`}
        />
        <TextField
          name="description"
          label="Meta descripción"
          value={values.description}
          onChange={set("description")}
          error={errors.description}
          hint="Aparece en Google bajo el título. Resume el artículo y su beneficio."
          counter={{ min: POST_RULES.description.publishMin, max: POST_RULES.description.max }}
          multiline
        />
        <TextField
          name="seoTitle"
          label="Título SEO (opcional)"
          value={values.seoTitle}
          onChange={set("seoTitle")}
          error={errors.seoTitle}
          hint="Reemplaza al título en la pestaña y en Google. Déjalo vacío para usar el título."
          counter={{ max: POST_RULES.seoTitle.max }}
        />
      </div>

      <div className={ui.card}>
        <CoverImageField
          url={values.coverUrl}
          alt={values.coverAlt}
          onUrlChange={set("coverUrl")}
          onAltChange={set("coverAlt")}
          error={errors.coverImage}
          altError={errors.coverAlt}
        />
      </div>

      <div className={ui.card}>
        <MarkdownField
          value={values.contentMarkdown}
          onChange={set("contentMarkdown")}
          onImportFrontMatter={importFrontMatter}
          error={errors.contentMarkdown}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <button type="submit" name="intent" value="publish" disabled={pending} className={ui.buttonPrimary}>
          {status === "published" ? "Guardar y publicar" : "Publicar"}
        </button>
        {status !== "published" && (
          <button type="submit" name="intent" value="draft" disabled={pending} className={ui.buttonSecondary}>
            Guardar borrador
          </button>
        )}
        <p role="status" aria-live="polite" className={`text-sm ${state.kind === "error" ? "text-red-700" : "text-slate-700"}`}>
          {pending ? "Guardando…" : state.kind === "idle" ? "" : state.message}
          {errors.form ? ` ${errors.form}` : ""}
        </p>
        {status === "published" && liveSlug && (
          <Link href={`/blog/${liveSlug}`} target="_blank" className={`${ui.link} text-sm ml-auto`}>
            Ver publicado
          </Link>
        )}
      </div>
    </form>
    {postId && <DangerZone postId={postId} isPublished={status === "published"} onStatusChange={setStatus} />}
    </>
  );
}
