import { describe, expect, it } from "vitest";
import { hashPassword, parsePasswordHash, verifyPassword } from "./password";

// Lower cost than production so the suite stays fast; the code path is identical.
const FAST = { logN: 14, r: 8, p: 1 };

describe("password hashing", () => {
  it("verifies the correct password", async () => {
    const hash = await hashPassword("correct horse battery staple", FAST);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("correct horse battery staple", FAST);
    expect(await verifyPassword("correct horse battery stapl", hash)).toBe(false);
  });

  it("salts every hash", async () => {
    expect(await hashPassword("same", FAST)).not.toBe(await hashPassword("same", FAST));
  });

  it("uses the production cost by default", async () => {
    const hash = await hashPassword("x");
    expect(parsePasswordHash(hash)).toMatchObject({ logN: 17, r: 8, p: 1 });
  });

  it("returns false for malformed hashes instead of throwing", async () => {
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "bcrypt:14:8:1:abc:def")).toBe(false);
    expect(await verifyPassword("x", "scrypt:14:8:1:short:short")).toBe(false);
  });

  it("rejects cost parameters outside safe bounds", async () => {
    const hash = await hashPassword("x", FAST);
    const tooExpensive = hash.replace(/^scrypt:14:/, "scrypt:30:");
    expect(parsePasswordHash(tooExpensive)).toBeNull();
    expect(await verifyPassword("x", tooExpensive)).toBe(false);
  });
});
