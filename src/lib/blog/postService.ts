import type { Clock } from "@/lib/contracts/auth";
import type { Post, PostRepository, PostSummary } from "@/lib/contracts/blog";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { POSTS_PER_PAGE } from "./rules";
import { validatePost, type PostInput, type SaveIntent } from "./validation";

export type PublishedLookup =
  | { kind: "post"; post: Post }
  | { kind: "redirect"; slug: string }
  | { kind: "missing" };

export interface PublishedListing {
  posts: PostSummary[];
  page: number;
  totalPages: number;
}

const SLUG_TAKEN_MESSAGE = "Ya existe un artículo con este slug.";

export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly clock: Clock,
    private readonly imageBaseUrl: string | null,
  ) {}

  async create(input: PostInput, intent: SaveIntent): Promise<Post> {
    this.assertValid(input, intent);
    await this.assertSlugFree(input.slug);
    const now = new Date(this.clock());
    const post = await this.withSlugConflictMapped(() =>
      this.repo.insert({
        ...input,
        previousSlugs: [],
        status: intent === "publish" ? "published" : "draft",
        publishedAt: intent === "publish" ? now : null,
        createdAt: now,
        updatedAt: now,
      }),
    );
    logger.info("blog.post.created", { postId: post.id, status: post.status });
    return post;
  }

  async update(id: string, input: PostInput, intent: SaveIntent): Promise<Post> {
    const existing = await this.getById(id);
    // A published post stays published on save, so it must always meet publish rules.
    this.assertValid(input, existing.status === "published" ? "publish" : intent);
    if (input.slug !== existing.slug) await this.assertSlugFree(input.slug, id);

    const now = new Date(this.clock());
    // Keep old slugs (once published) so their URLs 301 to the new one.
    const previousSlugs =
      input.slug !== existing.slug && existing.publishedAt
        ? [...new Set([...existing.previousSlugs, existing.slug])].filter((s) => s !== input.slug)
        : existing.previousSlugs.filter((s) => s !== input.slug);

    const updated = await this.withSlugConflictMapped(() =>
      this.repo.update(id, {
        ...input,
        previousSlugs,
        status: intent === "publish" ? "published" : existing.status,
        publishedAt: intent === "publish" ? (existing.publishedAt ?? now) : existing.publishedAt,
        updatedAt: now,
      }),
    );
    if (!updated) throw new NotFoundError(`Post ${id} not found`);
    logger.info("blog.post.updated", { postId: id, status: updated.status, slugChanged: input.slug !== existing.slug });
    return updated;
  }

  async unpublish(id: string): Promise<Post> {
    const updated = await this.repo.update(id, { status: "draft", updatedAt: new Date(this.clock()) });
    if (!updated) throw new NotFoundError(`Post ${id} not found`);
    logger.info("blog.post.unpublished", { postId: id });
    return updated;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repo.delete(id))) throw new NotFoundError(`Post ${id} not found`);
    logger.info("blog.post.deleted", { postId: id });
  }

  async getById(id: string): Promise<Post> {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundError(`Post ${id} not found`);
    return post;
  }

  listForAdmin(): Promise<PostSummary[]> {
    return this.repo.listAll();
  }

  /** Public lookup: current slug, an old slug (redirect), or nothing. Drafts are invisible. */
  async findPublished(slug: string): Promise<PublishedLookup> {
    const post = await this.repo.findBySlug(slug);
    if (post) return post.status === "published" ? { kind: "post", post } : { kind: "missing" };
    const renamed = await this.repo.findByPreviousSlug(slug);
    if (renamed?.status === "published") return { kind: "redirect", slug: renamed.slug };
    return { kind: "missing" };
  }

  /** `page` is 1-based. Returns an empty listing for out-of-range pages. */
  async listPublished(page: number): Promise<PublishedListing> {
    const offset = (page - 1) * POSTS_PER_PAGE;
    const { posts, total } = await this.repo.listPublished(offset, POSTS_PER_PAGE);
    return { posts, page, totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
  }

  listRecentPublished(limit: number): Promise<PostSummary[]> {
    return this.repo.listRecentPublished(limit);
  }

  listPublishedSlugs(): Promise<Array<Pick<Post, "slug" | "updatedAt">>> {
    return this.repo.listPublishedSlugs();
  }

  private assertValid(input: PostInput, intent: SaveIntent): void {
    const errors = validatePost(input, intent, this.imageBaseUrl);
    if (Object.keys(errors).length > 0) throw new ValidationError("Invalid post", errors);
  }

  private async assertSlugFree(slug: string, excludeId?: string): Promise<void> {
    if (await this.repo.isSlugTaken(slug, excludeId)) {
      throw new ValidationError("Slug taken", { slug: SLUG_TAKEN_MESSAGE });
    }
  }

  /** A concurrent save can still win the unique index; report it like a taken slug. */
  private async withSlugConflictMapped<T>(op: () => Promise<T>): Promise<T> {
    try {
      return await op();
    } catch (err) {
      if (err instanceof ConflictError) throw new ValidationError("Slug taken", { slug: SLUG_TAKEN_MESSAGE });
      throw err;
    }
  }
}
