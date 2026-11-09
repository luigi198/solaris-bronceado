import { ValidationError } from "@/lib/errors";

/** Stays under Vercel's 4.5 MB function request-body limit with form overhead. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_OUTPUT_WIDTH = 2000;
/** Rejects decompression bombs (e.g. a tiny PNG declaring 100k x 100k pixels). */
const MAX_INPUT_PIXELS = 40_000_000;
const WEBP_QUALITY = 82;

type Format = "jpeg" | "png" | "webp";

/**
 * sharp is a native module (libvips). Loading it lazily keeps every route that
 * merely imports the composition root (blog pages, login) independent of it:
 * a missing or broken native binary can only fail an upload, never the site.
 */
async function loadSharp() {
  return (await import("sharp")).default;
}

export interface ProcessedImage {
  data: Buffer;
  width: number;
  height: number;
  contentType: "image/webp";
}

/** Identify the format from magic bytes — the client's declared MIME type is not trusted. */
export function sniffFormat(bytes: Buffer): Format | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

/**
 * Validates and re-encodes an upload to WebP. Re-encoding strips EXIF/GPS and
 * any payload smuggled in metadata or trailing bytes; the output is a fresh
 * image built from decoded pixels only.
 */
export async function processImage(bytes: Buffer): Promise<ProcessedImage> {
  if (bytes.length === 0) throw new ValidationError("Empty file", { file: "El archivo está vacío." });
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new ValidationError("File too large", { file: "La imagen no puede superar 4 MB." });
  }
  if (!sniffFormat(bytes)) {
    throw new ValidationError("Unsupported format", { file: "Formato no permitido. Usa JPG, PNG o WebP." });
  }

  try {
    const { data, info } = await (await loadSharp())(bytes, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" })
      .rotate() // apply EXIF orientation before the metadata is dropped
      .resize({ width: MAX_OUTPUT_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, contentType: "image/webp" };
  } catch {
    throw new ValidationError("Undecodable image", { file: "No se pudo procesar la imagen. ¿Está dañada?" });
  }
}
