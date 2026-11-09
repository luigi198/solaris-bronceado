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

/** Null unless `url` is one of our uploads under `baseUrl`. */
export function parseOwnImageUrl(url: string, baseUrl: string | null | undefined): ImageDimensions | null {
  if (!baseUrl || !url.startsWith(`${baseUrl}/${IMAGE_KEY_PREFIX}`)) return null;
  const match = DIMENSIONS_IN_KEY.exec(url);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? { width, height } : null;
}
