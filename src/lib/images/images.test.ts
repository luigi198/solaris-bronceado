import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MemoryStorage } from "../../../test/memoryStorage";
import { ValidationError } from "@/lib/errors";
import { ImageService } from "./imageService";
import { buildImageKey, extractOwnImageUrls, imageKeyFromUrl, parseOwnImageUrl } from "./imageUrl";
import { MAX_UPLOAD_BYTES, processImage, sniffFormat } from "./processImage";

const BASE = "https://img.example.com";

function png(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: "#f5a520" } })
    .withMetadata({ exif: { IFD0: { Copyright: "secret-gps-like-data" } } })
    .png()
    .toBuffer();
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
    const storage = new MemoryStorage(BASE);
    const uploaded = await new ImageService(storage, BASE).upload(await png(800, 600));
    expect(uploaded).toMatchObject({ width: 800, height: 600 });
    expect(parseOwnImageUrl(uploaded.url, BASE)).toEqual({ width: 800, height: 600 });
    const [stored] = storage.objects.values();
    expect(stored.contentType).toBe("image/webp");
  });

  it("removes only our own uploads", async () => {
    const storage = new MemoryStorage(BASE);
    const service = new ImageService(storage, BASE);
    const a = await service.upload(await png(10, 10));
    const b = await service.upload(await png(20, 20));
    await service.removeImages([a.url, "https://evil.example/blog/x-1x1.webp", `${BASE}/other/y-1x1.webp`]);
    expect([...storage.objects.keys()]).toEqual([imageKeyFromUrl(b.url, BASE)]);
  });
});

describe("extractOwnImageUrls / imageKeyFromUrl", () => {
  const key = buildImageKey("0f8c2b1e-1111-4222-8333-944445555666", { width: 800, height: 600 });
  const url = `${BASE}/${key}`;

  it("finds each of our image URLs once, in any Markdown syntax", () => {
    const md = `![a](${url}) texto [ref]: ${url}\n<${url}> ![x](https://evil.example/${key})`;
    expect(extractOwnImageUrls(md, BASE)).toEqual([url]);
    expect(extractOwnImageUrls(md, null)).toEqual([]);
  });

  it("maps our URLs to keys and rejects everything else", () => {
    expect(imageKeyFromUrl(url, BASE)).toBe(key);
    expect(imageKeyFromUrl(`https://evil.example/${key}`, BASE)).toBeNull();
    expect(imageKeyFromUrl(`${BASE}/blog/../secret-1x1.webp`, BASE)).toBeNull();
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
