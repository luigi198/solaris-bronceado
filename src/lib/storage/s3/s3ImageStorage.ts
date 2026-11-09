import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ImageStorage } from "@/lib/contracts/images";
import { logger } from "@/lib/logger";

/** Keys are content-addressed by UUID and never overwritten, so cache forever. */
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

export interface S3ImageStorageConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Public base URL objects are served from, without a trailing slash. */
  publicBaseUrl: string;
}

export class S3ImageStorage implements ImageStorage {
  private readonly client: S3Client;

  constructor(private readonly config: S3ImageStorageConfig) {
    this.client = new S3Client({
      region: config.region,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  async put(key: string, body: Buffer, contentType: string): Promise<string> {
    try {
      const result = await this.client.send(
        new PutObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: IMMUTABLE_CACHE,
          // Never overwrite an existing object.
          IfNoneMatch: "*",
        }),
      );
      logger.info("s3.put.succeeded", { key, statusCode: result.$metadata.httpStatusCode });
      return `${this.config.publicBaseUrl}/${key}`;
    } catch (err) {
      logger.error("s3.put.failed", { key, err });
      throw err;
    }
  }
}
