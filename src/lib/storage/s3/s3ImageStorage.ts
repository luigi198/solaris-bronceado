import "server-only";
import { DeleteObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ImageStorage } from "@/lib/contracts/images";
import { logger } from "@/lib/logger";

/** Keys are content-addressed by UUID and never overwritten, so cache forever. */
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";
/** S3 DeleteObjects limit per request. */
const MAX_KEYS_PER_DELETE = 1000;

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

  /**
   * The bucket is versioned: this only adds delete markers (the IAM user has
   * no s3:DeleteObjectVersion), so a leaked key cannot destroy images for good
   * and lifecycle rules purge old versions later.
   */
  async delete(keys: readonly string[]): Promise<void> {
    for (let i = 0; i < keys.length; i += MAX_KEYS_PER_DELETE) {
      const batch = keys.slice(i, i + MAX_KEYS_PER_DELETE);
      let result;
      try {
        result = await this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.config.bucket,
            Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
          }),
        );
      } catch (err) {
        logger.error("s3.delete.failed", { count: batch.length, err });
        throw err;
      }
      // DeleteObjects reports per-key failures in a 200 response.
      const failed = result.Errors ?? [];
      if (failed.length > 0) {
        logger.error("s3.delete.partial_failure", {
          failed: failed.map((e) => ({ key: e.Key, errorCode: e.Code })),
        });
        throw new Error(`S3 failed to delete ${failed.length} of ${batch.length} objects`);
      }
      logger.info("s3.delete.succeeded", { count: batch.length, statusCode: result.$metadata.httpStatusCode });
    }
  }
}
