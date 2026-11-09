import { randomUUID } from "node:crypto";
import type { ImageStorage } from "@/lib/contracts/images";
import { logger } from "@/lib/logger";
import { buildImageKey } from "./imageUrl";
import { processImage } from "./processImage";
import type { UploadedImage } from "./uploadTypes";

export class ImageService {
  constructor(private readonly storage: ImageStorage) {}

  /** Throws ValidationError for unacceptable files. Keys are always server-generated. */
  async upload(bytes: Buffer): Promise<UploadedImage> {
    const image = await processImage(bytes);
    const key = buildImageKey(randomUUID(), image);
    const url = await this.storage.put(key, image.data, image.contentType);
    logger.info("images.uploaded", { key, bytes: image.data.length, width: image.width, height: image.height });
    return { url, width: image.width, height: image.height };
  }
}
