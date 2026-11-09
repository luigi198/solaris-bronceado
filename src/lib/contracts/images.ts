/** Boundary contract between image processing and object storage (S3). */
export interface ImageStorage {
  /** Stores `body` under `key` and returns its public URL. */
  put(key: string, body: Buffer, contentType: string): Promise<string>;
  /** Deletes the given keys. Missing keys are not an error. Throws if any delete fails. */
  delete(keys: readonly string[]): Promise<void>;
}

/** What the blog domain needs from the image domain when a post goes away. */
export interface ImageRemover {
  /** Deletes our own uploads among `urls`; foreign URLs are ignored. */
  removeImages(urls: readonly string[]): Promise<void>;
}
