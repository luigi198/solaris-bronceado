/**
 * Boundary contracts between the blog domain (src/lib/blog) and its storage
 * adapter (src/lib/storage/mongo). Neither side imports the other.
 */

export type PostStatus = "draft" | "published";

export interface PostImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  slug: string;
  /** Old slugs that 301-redirect to the current one. */
  previousSlugs: string[];
  title: string;
  /** Meta description and listing excerpt. */
  description: string;
  /** Overrides `title` in <title> when set. */
  seoTitle: string | null;
  contentMarkdown: string;
  coverImage: PostImage | null;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewPost = Omit<Post, "id">;

export type PostSummary = Pick<
  Post,
  "id" | "slug" | "title" | "description" | "coverImage" | "status" | "publishedAt" | "updatedAt"
>;

export interface PublishedPage {
  posts: PostSummary[];
  total: number;
}

export interface PostRepository {
  /** Throws ConflictError when the slug is already used. */
  insert(post: NewPost): Promise<Post>;
  /** Returns null when no post has `id`. Throws ConflictError on slug clash. */
  update(id: string, changes: Partial<NewPost>): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  findByPreviousSlug(slug: string): Promise<Post | null>;
  /** True when `slug` is a current or previous slug of a post other than `excludeId`. */
  isSlugTaken(slug: string, excludeId?: string): Promise<boolean>;
  listAll(): Promise<PostSummary[]>;
  listPublished(offset: number, limit: number): Promise<PublishedPage>;
  /** Newest published posts without a total count. */
  listRecentPublished(limit: number): Promise<PostSummary[]>;
  listPublishedSlugs(): Promise<Array<Pick<Post, "slug" | "updatedAt">>>;
}
