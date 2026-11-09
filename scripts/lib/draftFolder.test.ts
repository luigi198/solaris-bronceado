import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ValidationError } from "@/lib/errors";
import { readDraftFolder } from "./draftFolder";

describe("readDraftFolder", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "blog-draft-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("reads the article and the single cover image", async () => {
    await writeFile(join(dir, "article.md"), "---\ntitle: Hola\n---\nTexto");
    await writeFile(join(dir, "cover.JPG"), Buffer.from([0xff, 0xd8, 0xff]));

    const draft = await readDraftFolder(dir);
    expect(draft.markdown).toContain("title: Hola");
    expect([...draft.cover]).toEqual([0xff, 0xd8, 0xff]);
  });

  it("fails when the cover is missing", async () => {
    await writeFile(join(dir, "article.md"), "Texto");
    await expect(readDraftFolder(dir)).rejects.toThrow(ValidationError);
  });

  it("fails when there is more than one cover", async () => {
    await writeFile(join(dir, "article.md"), "Texto");
    await writeFile(join(dir, "cover.png"), "a");
    await writeFile(join(dir, "cover.webp"), "b");
    await expect(readDraftFolder(dir)).rejects.toThrow(/más de una portada/);
  });

  it("fails when the folder does not exist", async () => {
    await expect(readDraftFolder(join(dir, "nope"))).rejects.toThrow(/No se pudo leer/);
  });
});
