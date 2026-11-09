import type { PostImage } from "@/lib/contracts/blog";
import type { FieldErrors } from "@/lib/errors";
import { POST_RULES } from "./rules";
import { isValidSlug, SLUG_MAX_LENGTH } from "./slug";

export type SaveIntent = "draft" | "publish";

/** Normalized editor input (already trimmed; empty optionals are null). */
export interface PostInput {
  title: string;
  slug: string;
  description: string;
  seoTitle: string | null;
  contentMarkdown: string;
  coverImage: PostImage | null;
}

type Errors = Record<string, string>;

function checkLength(errors: Errors, field: string, value: string, min: number, max: number, label: string): void {
  if (value.length < min) errors[field] = `${label} debe tener al menos ${min} caracteres.`;
  else if (value.length > max) errors[field] = `${label} no puede superar ${max} caracteres.`;
}

function checkCover(errors: Errors, cover: PostImage | null, imageBaseUrl: string | null, intent: SaveIntent): void {
  if (!cover) {
    if (intent === "publish") errors.coverImage = "Agrega una imagen de portada antes de publicar.";
    return;
  }
  if (!imageBaseUrl || !cover.url.startsWith(`${imageBaseUrl}/`)) {
    errors.coverImage = "La portada debe subirse desde este panel.";
  }
  const { min, max } = POST_RULES.imageAlt;
  checkLength(errors, "coverAlt", cover.alt, min, max, "El texto alternativo");
}

/**
 * Business rules for a post. Drafts only need a title; publishing enforces the
 * SEO requirements (description length, cover image, minimum content).
 */
export function validatePost(input: PostInput, intent: SaveIntent, imageBaseUrl: string | null): FieldErrors {
  const errors: Errors = {};
  const rules = POST_RULES;

  checkLength(errors, "title", input.title, rules.title.min, rules.title.max, "El título");

  if (!isValidSlug(input.slug)) {
    errors.slug = `Usa solo minúsculas, números y guiones (máx. ${SLUG_MAX_LENGTH}).`;
  }
  if (input.seoTitle && input.seoTitle.length > rules.seoTitle.max) {
    errors.seoTitle = `El título SEO no puede superar ${rules.seoTitle.max} caracteres.`;
  }

  const descMin = intent === "publish" ? rules.description.publishMin : 0;
  const descMax = intent === "publish" ? rules.description.max : rules.description.draftMax;
  checkLength(errors, "description", input.description, descMin, descMax, "La descripción");

  const contentMin = intent === "publish" ? rules.content.publishMin : 0;
  checkLength(errors, "contentMarkdown", input.contentMarkdown, contentMin, rules.content.max, "El contenido");

  checkCover(errors, input.coverImage, imageBaseUrl, intent);
  return errors;
}
