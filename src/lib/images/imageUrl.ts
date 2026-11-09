/**
 * Uploaded image keys embed their dimensions (`blog/<uuid>-<w>x<h>.webp`) so
 * Markdown bodies can render them with `next/image` (which needs width/height)
 * without storing a separate media record.
 */

export const IMAGE_KEY_PREFIX = "blog/";
const DIMENSIONS_IN_KEY = /-(\d{1,5})x(\d{1,5})\.webp$/;

export interface ImageDimensions {
  width: number;
  height: number;
}

export function buildImageKey(id: string, { width, height }: ImageDimensions): string {
  return `${IMAGE_KEY_PREFIX}${id}-${width}x${height}.webp`;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Our upload URL shape, anchored at `baseUrl`. Keys are UUID-based (see buildImageKey). */
function ownImageUrlPattern(baseUrl: string): RegExp {
  return new RegExp(`${escapeRegExp(`${baseUrl}/${IMAGE_KEY_PREFIX}`)}[A-Za-z0-9-]+-\\d{1,5}x\\d{1,5}\\.webp`, "g");
}

/** Every distinct upload URL of ours mentioned in `text` (any Markdown syntax). O(n) in text length. */
export function extractOwnImageUrls(text: string, baseUrl: string | null | undefined): string[] {
  if (!baseUrl) return [];
  return [...new Set(text.match(ownImageUrlPattern(baseUrl)) ?? [])];
}

/** Storage key of one of our upload URLs, or null for anything else. */
export function imageKeyFromUrl(url: string, baseUrl: string | null | undefined): string | null {
  if (!baseUrl || !parseOwnImageUrl(url, baseUrl)) return null;
  const key = url.slice(baseUrl.length + 1);
  return /^[A-Za-z0-9/._-]+$/.test(key) && !key.includes("..") ? key : null;
}

/** Null unless `url` is one of our uploads under `baseUrl`. */
export function parseOwnImageUrl(url: string, baseUrl: string | null | undefined): ImageDimensions | null {
  if (!baseUrl || !url.startsWith(`${baseUrl}/${IMAGE_KEY_PREFIX}`)) return null;
  const match = DIMENSIONS_IN_KEY.exec(url);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? { width, height } : null;
}
