import type { ImageStorage } from "../src/lib/contracts/images";

/** Real in-memory implementation of the storage contract. */
export class MemoryStorage implements ImageStorage {
  readonly objects = new Map<string, { body: Buffer; contentType: string }>();

  constructor(private readonly baseUrl: string) {}

  async put(key: string, body: Buffer, contentType: string): Promise<string> {
    this.objects.set(key, { body, contentType });
    return `${this.baseUrl}/${key}`;
  }

  async delete(keys: readonly string[]): Promise<void> {
    for (const key of keys) this.objects.delete(key);
  }
}

/** Storage whose deletes always fail, for testing best-effort cleanup. */
export class FailingDeleteStorage extends MemoryStorage {
  override async delete(): Promise<void> {
    throw new Error("S3 unavailable");
  }
}
