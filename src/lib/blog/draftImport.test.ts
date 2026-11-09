import sharp from "sharp";
import { beforeEach, describe, expect, it } from "vitest";
import { FailingDeleteStorage, MemoryStorage } from "../../../test/memoryStorage";
import { fakeClock, setupTestDb } from "../../../test/mongo";
import { ValidationError } from "@/lib/errors";
import { ImageService } from "@/lib/images/imageService";
import { MongoPostRepository } from "@/lib/storage/mongo/postRepository";
import { importDraft } from "./draftImport";
import { PostService } from "./postService";

const getDb = setupTestDb();
const IMAGE_BASE = "https://img.example.com";
const COVER_WIDTH = 1600;
const COVER_HEIGHT = 900;

const png = () =>
  sharp({ create: { width: COVER_WIDTH, height: COVER_HEIGHT, channels: 3, background: "#f5a520" } }).png().toBuffer();

function article(overrides: Record<string, string> = {}, body = "## Antes de tu sesión\n\n" + "Hidrata tu piel. ".repeat(40)): string {
  const fields = {
    title: "Cómo preparar tu piel para un bronceado parejo",
    description: "D".repeat(140),
    coverAlt: "Cabina de bronceado iluminada en tonos cálidos",
    ...overrides,
  };
  const lines = Object.entries(fields).map(([k, v]) => `${k}: "${v}"`);
  return `---\n${lines.join("\n")}\n---\n\n${body}`;
}

async function fieldErrors(promise: Promise<unknown>): Promise<Record<string, string>> {
  const err = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  if (!(err instanceof ValidationError)) throw new Error(`Expected ValidationError, got ${String(err)}`);
  return err.fieldErrors;
}

describe("importDraft", () => {
  let storage: MemoryStorage;
  let posts: PostService;

  const deps = (s: MemoryStorage = storage) => {
    const images = new ImageService(s, IMAGE_BASE);
    posts = new PostService(new MongoPostRepository(getDb()), fakeClock().now, IMAGE_BASE, images);
    return { posts, images, imageBaseUrl: IMAGE_BASE };
  };

  beforeEach(() => {
    storage = new MemoryStorage(IMAGE_BASE);
  });

  it("creates an unpublished draft with the uploaded cover and the body without front matter", async () => {
    const post = await importDraft({ markdown: article(), cover: await png() }, deps());

    expect(post).toMatchObject({
      status: "draft",
      publishedAt: null,
      slug: "como-preparar-tu-piel-para-un-bronceado-parejo",
      coverImage: { alt: "Cabina de bronceado iluminada en tonos cálidos", width: COVER_WIDTH, height: COVER_HEIGHT },
    });
    expect(post.contentMarkdown.startsWith("## Antes de tu sesión")).toBe(true);
    expect(storage.objects.size).toBe(1);
    expect(await posts.findPublished(post.slug)).toEqual({ kind: "missing" });
  });

  it("uses the front matter slug when given", async () => {
    const post = await importDraft({ markdown: article({ slug: "Piel Lista" }), cover: await png() }, deps());
    expect(post.slug).toBe("piel-lista");
  });

  it("rejects an article that is not publish-ready before uploading anything", async () => {
    const errors = await fieldErrors(
      importDraft({ markdown: article({ description: "Muy corta", coverAlt: "" }, "Corto."), cover: await png() }, deps()),
    );
    expect(Object.keys(errors).sort()).toEqual(["contentMarkdown", "coverAlt", "description"]);
    expect(storage.objects.size).toBe(0);
  });

  it("rejects a file that is not an image without creating a post", async () => {
    const d = deps();
    const errors = await fieldErrors(importDraft({ markdown: article(), cover: Buffer.from("not an image") }, d));
    expect(errors.file).toBeDefined();
    expect(await posts.listForAdmin()).toHaveLength(0);
  });

  it("removes the uploaded cover when the slug is already taken", async () => {
    const d = deps();
    await importDraft({ markdown: article(), cover: await png() }, d);
    const errors = await fieldErrors(importDraft({ markdown: article(), cover: await png() }, d));
    expect(errors.slug).toBeDefined();
    expect(storage.objects.size).toBe(1);
  });

  it("still reports the original error when the cover cleanup fails", async () => {
    const failing = new FailingDeleteStorage(IMAGE_BASE);
    const d = deps(failing);
    await importDraft({ markdown: article(), cover: await png() }, d);
    const errors = await fieldErrors(importDraft({ markdown: article(), cover: await png() }, d));
    expect(errors.slug).toBeDefined();
  });
});
