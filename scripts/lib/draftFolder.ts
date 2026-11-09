import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DraftArticle } from "@/lib/blog/draftImport";
import { ValidationError } from "@/lib/errors";

/**
 * A draft folder (`.blog-drafts/<slug>/`) holds exactly one `article.md` and
 * one `cover.<png|jpg|jpeg|webp>`. The image format is still verified by magic
 * bytes downstream; the extension only lets us find the file.
 */

export const ARTICLE_FILE = "article.md";
const COVER_FILE = /^cover\.(png|jpe?g|webp)$/i;

function folderError(message: string): ValidationError {
  return new ValidationError(message, { folder: message });
}

async function listFiles(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch {
    throw folderError(`No se pudo leer la carpeta ${dir}.`);
  }
}

export async function readDraftFolder(dir: string): Promise<DraftArticle> {
  const files = await listFiles(dir);
  if (!files.includes(ARTICLE_FILE)) throw folderError(`Falta ${ARTICLE_FILE} en ${dir}.`);

  const covers = files.filter((f) => COVER_FILE.test(f));
  if (covers.length === 0) throw folderError(`Falta la portada en ${dir} (cover.png, cover.jpg o cover.webp).`);
  if (covers.length > 1) throw folderError(`Hay más de una portada en ${dir}: ${covers.join(", ")}. Deja solo una.`);

  const [markdown, cover] = await Promise.all([
    readFile(join(dir, ARTICLE_FILE), "utf8"),
    readFile(join(dir, covers[0])),
  ]);
  return { markdown, cover };
}
