import { beforeEach, describe, expect, it } from "vitest";
import { fakeClock, setupTestDb } from "../../../test/mongo";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { MongoPostRepository } from "@/lib/storage/mongo/postRepository";
import { PostService } from "./postService";
import { POSTS_PER_PAGE } from "./rules";
import type { PostInput } from "./validation";

const getDb = setupTestDb();
const IMAGE_BASE = "https://img.example.com";

function input(overrides: Partial<PostInput> = {}): PostInput {
  return {
    title: "Cómo cuidar tu bronceado",
    slug: "como-cuidar-tu-bronceado",
    description: "D".repeat(140),
    seoTitle: null,
    contentMarkdown: "Contenido ".repeat(40),
    coverImage: { url: `${IMAGE_BASE}/blog/abc-1200x800.webp`, alt: "Piel bronceada", width: 1200, height: 800 },
    ...overrides,
  };
}

async function fieldErrors(promise: Promise<unknown>): Promise<Record<string, string>> {
  const err = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  if (!(err instanceof ValidationError)) throw new Error(`Expected ValidationError, got ${String(err)}`);
  return err.fieldErrors;
}

describe("PostService", () => {
  let service: PostService;
  let clock: ReturnType<typeof fakeClock>;

  beforeEach(() => {
    clock = fakeClock();
    service = new PostService(new MongoPostRepository(getDb()), clock.now, IMAGE_BASE);
  });

  it("publishes a valid post and finds it by slug", async () => {
    const post = await service.create(input(), "publish");
    expect(post.status).toBe("published");
    expect(post.publishedAt).toEqual(new Date(clock.now()));
    const found = await service.findPublished(post.slug);
    expect(found).toMatchObject({ kind: "post", post: { id: post.id } });
  });

  it("allows incomplete drafts but hides them publicly", async () => {
    const draft = await service.create(input({ description: "", coverImage: null, contentMarkdown: "" }), "draft");
    expect(draft.status).toBe("draft");
    expect(await service.findPublished(draft.slug)).toEqual({ kind: "missing" });
  });

  it("enforces SEO rules on publish", async () => {
    const errors = await fieldErrors(
      service.create(input({ description: "corta", coverImage: null, contentMarkdown: "x" }), "publish"),
    );
    expect(Object.keys(errors).sort()).toEqual(["contentMarkdown", "coverImage", "description"]);
  });

  it("rejects invalid and reserved slugs", async () => {
    expect(await fieldErrors(service.create(input({ slug: "Con Espacios" }), "draft"))).toHaveProperty("slug");
    expect(await fieldErrors(service.create(input({ slug: "pagina" }), "draft"))).toHaveProperty("slug");
  });

  it("rejects cover images not uploaded through our storage", async () => {
    const cover = { url: "https://evil.example/x.webp", alt: "Imagen", width: 10, height: 10 };
    expect(await fieldErrors(service.create(input({ coverImage: cover }), "draft"))).toHaveProperty("coverImage");
  });

  it("rejects duplicate slugs", async () => {
    await service.create(input(), "draft");
    expect(await fieldErrors(service.create(input(), "draft"))).toHaveProperty("slug");
  });

  it("redirects old slugs of published posts after a rename", async () => {
    const post = await service.create(input(), "publish");
    await service.update(post.id, input({ slug: "nuevo-slug" }), "publish");
    expect(await service.findPublished("como-cuidar-tu-bronceado")).toEqual({ kind: "redirect", slug: "nuevo-slug" });
    // The old slug stays reserved so the redirect cannot be hijacked.
    expect(await fieldErrors(service.create(input(), "draft"))).toHaveProperty("slug");
  });

  it("keeps the original publish date on later edits", async () => {
    const post = await service.create(input(), "publish");
    clock.advance(86_400_000);
    const updated = await service.update(post.id, input({ title: "Título nuevo" }), "publish");
    expect(updated.publishedAt).toEqual(post.publishedAt);
    expect(updated.updatedAt.getTime()).toBe(clock.now());
  });

  it("unpublishes and deletes", async () => {
    const post = await service.create(input(), "publish");
    await service.unpublish(post.id);
    expect(await service.findPublished(post.slug)).toEqual({ kind: "missing" });
    await service.delete(post.id);
    await expect(service.getById(post.id)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws NotFoundError for unknown or malformed ids", async () => {
    await expect(service.getById("not-an-id")).rejects.toBeInstanceOf(NotFoundError);
    await expect(service.delete("0123456789abcdef01234567")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("paginates published posts newest first", async () => {
    const total = POSTS_PER_PAGE + 2;
    for (let i = 0; i < total; i++) {
      clock.advance(1000);
      await service.create(input({ slug: `post-${i}` }), "publish");
    }
    await service.create(input({ slug: "draft-only" }), "draft");
    const first = await service.listPublished(1);
    expect(first.totalPages).toBe(2);
    expect(first.posts[0].slug).toBe(`post-${total - 1}`);
    expect((await service.listPublished(2)).posts).toHaveLength(2);
  });
});
