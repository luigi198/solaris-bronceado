import type { Post } from "@/lib/contracts/blog";
import { ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { parseFrontMatter } from "./frontMatter";
import { POST_RULES } from "./rules";
import { slugify } from "./slug";
import { validatePost, type PostInput, type SaveIntent } from "./validation";

/**
 * Imports an externally written article (Markdown with front matter + cover
 * image bytes) as a draft. Used by the `blog:draft` CLI so an AI-assisted
 * workflow can prepare posts for human review without touching the admin UI.
 */

export interface DraftArticle {
  /** Markdown with a front matter block (title, description, coverAlt, …). */
  markdown: string;
  cover: Buffer;
}

/** The parts of ImageService this use case needs. */
export interface CoverImages {
  upload(bytes: Buffer): Promise<{ url: string; width: number; height: number }>;
  removeImages(urls: readonly string[]): Promise<void>;
}

/** The parts of PostService this use case needs. */
export interface DraftPosts {
  create(input: PostInput, intent: SaveIntent): Promise<Post>;
}

/** Field errors that exist only because the cover is not uploaded yet. */
const COVER_PENDING_FIELDS: ReadonlySet<string> = new Set(["coverImage"]);

function toInput(markdown: string): { input: PostInput; coverAlt: string } {
  const { fields, body } = parseFrontMatter(markdown);
  const title = fields.title?.trim() ?? "";
  return {
    coverAlt: fields.coverAlt?.trim() ?? "",
    input: {
      title,
      slug: fields.slug ? slugify(fields.slug) : slugify(title),
      description: fields.description?.trim() ?? "",
      seoTitle: fields.seoTitle?.trim() || null,
      contentMarkdown: body.trim(),
      coverImage: null,
    },
  };
}

/**
 * Generated drafts must already meet the publish rules, so review is about
 * content, not fixing SEO fields. Checked before uploading so a bad article
 * never leaves an orphan image in the bucket.
 */
function assertPublishReady(input: PostInput, coverAlt: string, imageBaseUrl: string | null): void {
  const errors: Record<string, string> = {};
  for (const [field, message] of Object.entries(validatePost(input, "publish", imageBaseUrl))) {
    if (!COVER_PENDING_FIELDS.has(field)) errors[field] = message;
  }
  const { min, max } = POST_RULES.imageAlt;
  if (coverAlt.length < min || coverAlt.length > max) {
    errors.coverAlt = `coverAlt debe tener entre ${min} y ${max} caracteres.`;
  }
  if (Object.keys(errors).length > 0) throw new ValidationError("Article not publish-ready", errors);
}

export async function importDraft(
  article: DraftArticle,
  deps: { posts: DraftPosts; images: CoverImages; imageBaseUrl: string | null },
): Promise<Post> {
  const { input, coverAlt } = toInput(article.markdown);
  assertPublishReady(input, coverAlt, deps.imageBaseUrl);

  const cover = await deps.images.upload(article.cover);
  try {
    const post = await deps.posts.create({ ...input, coverImage: { ...cover, alt: coverAlt } }, "draft");
    logger.info("blog.draft.imported", { postId: post.id, slug: post.slug });
    return post;
  } catch (err) {
    // Roll back the upload; a cleanup failure must not mask the real error.
    await deps.images.removeImages([cover.url]).catch((cleanupErr: unknown) => {
      logger.error("blog.draft.cover_cleanup_failed", { url: cover.url, err: cleanupErr });
    });
    throw err;
  }
}
