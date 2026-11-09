import sharp from "sharp";
import { describe, expect, it } from "vitest";
import type { ImageStorage } from "@/lib/contracts/images";
import { ValidationError } from "@/lib/errors";
import { ImageService } from "./imageService";
import { buildImageKey, parseOwnImageUrl } from "./imageUrl";
import { MAX_UPLOAD_BYTES, processImage, sniffFormat } from "./processImage";

const BASE = "https://img.example.com";

function png(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: "#f5a520" } })
    .withMetadata({ exif: { IFD0: { Copyright: "secret-gps-like-data" } } })
    .png()
    .toBuffer();
}

/** Real in-memory implementation of the storage contract. */
class MemoryStorage implements ImageStorage {
  readonly objects = new Map<string, { body: Buffer; contentType: string }>();
  async put(key: string, body: Buffer, contentType: string): Promise<string> {
    this.objects.set(key, { body, contentType });
    return `${BASE}/${key}`;
  }
}

describe("processImage", () => {
  it("re-encodes to WebP, downsizes, and strips metadata", async () => {
    const out = await processImage(await png(3000, 1500));
    expect(sniffFormat(out.data)).toBe("webp");
    expect(out).toMatchObject({ width: 2000, height: 1000, contentType: "image/webp" });
    expect((await sharp(out.data).metadata()).exif).toBeUndefined();
  });

  it("rejects files that are not images regardless of name/MIME", async () => {
    await expect(processImage(Buffer.from("<svg onload=alert(1)>"))).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects empty, oversized and corrupt files", async () => {
    await expect(processImage(Buffer.alloc(0))).rejects.toBeInstanceOf(ValidationError);
    await expect(processImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1))).rejects.toBeInstanceOf(ValidationError);
    const corrupt = Buffer.concat([(await png(10, 10)).subarray(0, 20)]);
    await expect(processImage(corrupt)).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("ImageService", () => {
  it("stores processed images under a server-generated key with dimensions", async () => {
    const storage = new MemoryStorage();
    const uploaded = await new ImageService(storage).upload(await png(800, 600));
    expect(uploaded).toMatchObject({ width: 800, height: 600 });
    expect(parseOwnImageUrl(uploaded.url, BASE)).toEqual({ width: 800, height: 600 });
    const [stored] = storage.objects.values();
    expect(stored.contentType).toBe("image/webp");
  });
});

describe("parseOwnImageUrl", () => {
  it("only trusts our own upload URLs", () => {
    const key = buildImageKey("id", { width: 10, height: 20 });
    expect(parseOwnImageUrl(`${BASE}/${key}`, BASE)).toEqual({ width: 10, height: 20 });
    expect(parseOwnImageUrl(`https://evil.example/${key}`, BASE)).toBeNull();
    expect(parseOwnImageUrl(`${BASE}.evil.example/${key}`, BASE)).toBeNull();
    expect(parseOwnImageUrl(`${BASE}/${key}`, null)).toBeNull();
  });
});
