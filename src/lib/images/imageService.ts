import { randomUUID } from "node:crypto";
import type { ImageRemover, ImageStorage } from "@/lib/contracts/images";
import { logger } from "@/lib/logger";
import { buildImageKey, imageKeyFromUrl } from "./imageUrl";
import { processImage } from "./processImage";
import type { UploadedImage } from "./uploadTypes";

export class ImageService implements ImageRemover {
  constructor(
    private readonly storage: ImageStorage,
    /** Public base URL of our uploads; only URLs under it are ever deleted. */
    private readonly baseUrl: string,
  ) {}

  async removeImages(urls: readonly string[]): Promise<void> {
    const keys = [...new Set(urls.map((url) => imageKeyFromUrl(url, this.baseUrl)).filter((k) => k !== null))];
    if (keys.length === 0) return;
    await this.storage.delete(keys);
    logger.info("images.deleted", { count: keys.length, keys });
  }

  /** Throws ValidationError for unacceptable files. Keys are always server-generated. */
  async upload(bytes: Buffer): Promise<UploadedImage> {
    const image = await processImage(bytes);
    const key = buildImageKey(randomUUID(), image);
    const url = await this.storage.put(key, image.data, image.contentType);
    logger.info("images.uploaded", { key, bytes: image.data.length, width: image.width, height: image.height });
    return { url, width: image.width, height: image.height };
  }
}
