import "server-only";
import { z } from "zod";
import { POST_RULES } from "@/lib/blog/rules";
import { slugify } from "@/lib/blog/slug";
import type { PostInput, SaveIntent } from "@/lib/blog/validation";
import { ValidationError } from "@/lib/errors";
import { parseOwnImageUrl } from "@/lib/images/imageUrl";
import { IMAGE_BASE_URL } from "@/lib/images/publicConfig";

// Generous structural caps only — the business limits live in validatePost().
const SHORT_FIELD_MAX = 1000;
const URL_MAX = 500;
const CONTENT_SLACK = 1000;

const formSchema = z.object({
  title: z.string().max(SHORT_FIELD_MAX),
  slug: z.string().max(SHORT_FIELD_MAX),
  description: z.string().max(SHORT_FIELD_MAX),
  seoTitle: z.string().max(SHORT_FIELD_MAX),
  contentMarkdown: z.string().max(POST_RULES.content.max + CONTENT_SLACK),
  coverUrl: z.string().max(URL_MAX),
  coverAlt: z.string().max(SHORT_FIELD_MAX),
  intent: z.enum(["draft", "publish"]),
});

const FIELDS = Object.keys(formSchema.shape);

export interface ParsedPostForm {
  input: PostInput;
  intent: SaveIntent;
}

/** FormData -> normalized PostInput. Throws ValidationError on malformed input. */
export function parsePostForm(formData: FormData): ParsedPostForm {
  const raw = Object.fromEntries(FIELDS.map((f) => [f, formData.get(f) ?? ""]));
  const parsed = formSchema.safeParse(raw);
  if (!parsed.success) throw new ValidationError("Malformed form", { form: "El formulario contiene datos no válidos." });
  const f = parsed.data;

  const title = f.title.trim();
  const coverUrl = f.coverUrl.trim();
  // Dimensions come from our own upload key, never from client-supplied numbers.
  const size = coverUrl ? parseOwnImageUrl(coverUrl, IMAGE_BASE_URL) : null;
  if (coverUrl && !size) {
    throw new ValidationError("Foreign cover", { coverImage: "La portada debe subirse desde este panel." });
  }

  return {
    intent: f.intent,
    input: {
      title,
      slug: f.slug.trim() || slugify(title),
      description: f.description.trim(),
      seoTitle: f.seoTitle.trim() || null,
      contentMarkdown: f.contentMarkdown.trim(),
      coverImage: size ? { url: coverUrl, alt: f.coverAlt.trim(), ...size } : null,
    },
  };
}
