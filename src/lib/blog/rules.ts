/** Content limits shared by server-side validation and the editor's counters. */
export const POST_RULES = {
  title: { min: 5, max: 110 },
  seoTitle: { max: 60 },
  /** SEO rule from CLAUDE.md: unique description of 120–160 characters. */
  description: { publishMin: 120, max: 160, draftMax: 300 },
  content: { publishMin: 300, max: 100_000 },
  imageAlt: { min: 3, max: 150 },
} as const;

export const POSTS_PER_PAGE = 12;
const WORDS_PER_MINUTE = 200;

/** Single source for word counting: reading time and JSON-LD wordCount must agree. O(n). */
export function countWords(markdown: string): number {
  return markdown.split(/\s+/).filter(Boolean).length;
}

export function readingTimeMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
