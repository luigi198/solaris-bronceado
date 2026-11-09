/**
 * Uploads a prepared draft folder as an unpublished blog post:
 *
 *   npm run blog:draft -- .blog-drafts/<slug>
 *
 * The folder holds article.md (front matter + Markdown) and cover.<png|jpg|webp>.
 * Credentials come from .env.blog-draft (gitignored); see .env.example. The
 * post is always saved as a draft — publishing stays a human step in /admin.
 */
import { importDraft } from "@/lib/blog/draftImport";
import { SITE_URL } from "@/lib/constants";
import { AppError, ValidationError } from "@/lib/errors";
import { IMAGE_BASE_URL } from "@/lib/images/publicConfig";
import { logger } from "@/lib/logger";
import { getImageService, getPostService } from "@/lib/server/container";
import { readDraftFolder } from "./lib/draftFolder.ts";

const EXIT_OK = 0;
const EXIT_INVALID_INPUT = 1;
const EXIT_OPERATIONAL = 2;
const USAGE = "Uso: npm run blog:draft -- .blog-drafts/<slug>";

/** Where the draft is going, without credentials: host and database only. */
function describeTarget(): string {
  const uri = process.env.MONGODB_URI ?? "";
  let host = "desconocido";
  try {
    host = new URL(uri).hostname;
  } catch {
    // Malformed URIs are rejected by the env validation right after this.
  }
  return `${host} / ${process.env.MONGODB_DB ?? "solaris"}`;
}

function printValidation(err: ValidationError): void {
  console.error("El borrador no se subió. Corrige lo siguiente:");
  for (const [field, message] of Object.entries(err.fieldErrors)) console.error(`  - ${field}: ${message}`);
}

async function run(dir: string | undefined): Promise<number> {
  if (!dir) {
    console.error(USAGE);
    return EXIT_INVALID_INPUT;
  }
  try {
    const article = await readDraftFolder(dir);
    console.log(`Destino: ${describeTarget()}`);
    const post = await importDraft(article, {
      posts: await getPostService(),
      images: getImageService(),
      imageBaseUrl: IMAGE_BASE_URL,
    });
    console.log(`Borrador creado: "${post.title}" (${post.slug})`);
    console.log(`Revísalo en: ${SITE_URL}/admin/posts/${post.id}`);
    return EXIT_OK;
  } catch (err) {
    if (err instanceof ValidationError) {
      printValidation(err);
      return EXIT_INVALID_INPUT;
    }
    logger.error("blog.draft.import_failed", { dir, err });
    console.error(err instanceof AppError ? err.message : "Error inesperado; revisa el log de arriba.");
    return EXIT_OPERATIONAL;
  }
}

// Exit explicitly: the cached Mongo client would otherwise keep the process alive.
process.exit(await run(process.argv[2]));
