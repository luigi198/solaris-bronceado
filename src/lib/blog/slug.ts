export const SLUG_MAX_LENGTH = 80;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Static segments under /blog that a post slug must not shadow. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set(["pagina", "sitemap.xml", "feed", "rss"]);

const COMBINING_MARKS = /[̀-ͯ]/g;

/** "¿Cómo cuidar tu bronceado?" -> "como-cuidar-tu-bronceado" */
export function slugify(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= SLUG_MAX_LENGTH) return slug;
  const cut = slug.slice(0, SLUG_MAX_LENGTH);
  const lastDash = cut.lastIndexOf("-");
  return lastDash > 0 ? cut.slice(0, lastDash) : cut;
}

export function isValidSlug(slug: string): boolean {
  return slug.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug);
}
