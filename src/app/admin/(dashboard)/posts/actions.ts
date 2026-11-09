"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppError, NotFoundError, ValidationError } from "@/lib/errors";
import { requireAdmin } from "@/lib/http/adminAuth";
import { MAX_UPLOAD_BYTES } from "@/lib/images/processImage";
import { logger } from "@/lib/logger";
import { getImageService, getPostService } from "@/lib/server/container";
import { parsePostForm } from "./parsePostForm";
import type { SaveState, UploadResult } from "./types";

/**
 * Every public URL that can show post data. Invalidated lazily on next visit.
 * Dynamic routes must be addressed by their file path *including* the route
 * group: Next's cache tags are "/(site)/blog/[slug]/page", so "/blog/[slug]"
 * would silently match nothing.
 */
function revalidateBlog(): void {
  revalidatePath("/blog");
  revalidatePath("/(site)/blog/[slug]", "page");
  revalidatePath("/(site)/blog/pagina/[page]", "page");
  revalidatePath("/blog/sitemap.xml");
}

function toErrorState(err: unknown, operation: string): SaveState {
  if (err instanceof ValidationError) {
    return { kind: "error", message: "Revisa los campos marcados.", fieldErrors: err.fieldErrors };
  }
  if (err instanceof NotFoundError) {
    return { kind: "error", message: "Este artículo ya no existe.", fieldErrors: {} };
  }
  logger.error("admin.post.action_failed", { operation, recoverable: err instanceof AppError && err.recoverable, err });
  return { kind: "error", message: "No se pudo guardar por un problema del servidor. Intenta de nuevo.", fieldErrors: {} };
}

export async function createPostAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  let id: string;
  try {
    const { input, intent } = parsePostForm(formData);
    id = (await (await getPostService()).create(input, intent)).id;
    revalidateBlog();
  } catch (err) {
    return toErrorState(err, "create");
  }
  redirect(`/admin/posts/${id}`);
}

export async function updatePostAction(id: string, _prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  try {
    const { input, intent } = parsePostForm(formData);
    const post = await (await getPostService()).update(id, input, intent);
    revalidateBlog();
    return {
      kind: "saved",
      message: post.status === "published" ? "Cambios publicados." : "Borrador guardado.",
      status: post.status,
      slug: post.slug,
    };
  } catch (err) {
    return toErrorState(err, "update");
  }
}

export async function unpublishPostAction(id: string): Promise<SaveState> {
  await requireAdmin();
  try {
    const post = await (await getPostService()).unpublish(id);
    revalidateBlog();
    return { kind: "saved", message: "El artículo volvió a borrador.", status: post.status, slug: post.slug };
  } catch (err) {
    return toErrorState(err, "unpublish");
  }
}

export async function deletePostAction(id: string): Promise<SaveState> {
  await requireAdmin();
  try {
    await (await getPostService()).delete(id);
    revalidateBlog();
  } catch (err) {
    return toErrorState(err, "delete");
  }
  redirect("/admin");
}

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Selecciona una imagen." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "La imagen no puede superar 4 MB." };
  try {
    const image = await getImageService().upload(Buffer.from(await file.arrayBuffer()));
    return { ok: true, ...image };
  } catch (err) {
    if (err instanceof ValidationError) {
      return { ok: false, error: err.fieldErrors.file ?? "Imagen no válida." };
    }
    logger.error("admin.image.upload_failed", { bytes: file.size, err });
    return { ok: false, error: "No se pudo subir la imagen. Intenta de nuevo." };
  }
}
