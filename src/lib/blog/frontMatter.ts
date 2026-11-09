/**
 * Parses the small YAML-like front matter block AI tools emit at the top of a
 * Markdown article, so a whole generated post can be pasted in one go:
 *
 *   ---
 *   title: Cómo cuidar tu bronceado
 *   description: "..."
 *   ---
 *   ## Body…
 *
 * Only flat `key: value` lines are supported — enough for our known fields,
 * without pulling in a YAML dependency.
 */

export const FRONT_MATTER_KEYS = ["title", "slug", "description", "seoTitle", "coverAlt"] as const;
export type FrontMatterKey = (typeof FRONT_MATTER_KEYS)[number];
export type FrontMatter = Partial<Record<FrontMatterKey, string>>;

export interface ParsedMarkdown {
  fields: FrontMatter;
  body: string;
}

const BLOCK = /^﻿?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const LINE = /^([A-Za-z_]+)\s*:\s*(.*)$/;
const KEY_ALIASES: Readonly<Record<string, FrontMatterKey>> = {
  title: "title",
  slug: "slug",
  description: "description",
  excerpt: "description",
  seotitle: "seoTitle",
  seo_title: "seoTitle",
  metatitle: "seoTitle",
  meta_title: "seoTitle",
  metadescription: "description",
  meta_description: "description",
  coveralt: "coverAlt",
  cover_alt: "coverAlt",
};

function unquote(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote) && trimmed.length >= 2) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontMatter(markdown: string): ParsedMarkdown {
  const match = BLOCK.exec(markdown);
  if (!match) return { fields: {}, body: markdown };

  const fields: FrontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = LINE.exec(line.trim());
    if (!pair) continue;
    const key = KEY_ALIASES[pair[1].toLowerCase()];
    const value = unquote(pair[2]);
    if (key && value) fields[key] = value;
  }
  return { fields, body: markdown.slice(match[0].length).replace(/^\s+/, "") };
}
