/** Boundary contract between image processing and object storage (S3). */
export interface ImageStorage {
  /** Stores `body` under `key` and returns its public URL. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
}
