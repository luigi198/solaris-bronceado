import { describe, expect, it } from "vitest";
import {
  base32Decode,
  base32Encode,
  findMatchingStep,
  generateTotpSecret,
  hotp,
  otpauthUri,
  stepAt,
  TOTP_PERIOD_SECONDS,
} from "./totp";

// RFC 6238 Appendix B test secret (SHA-1).
const RFC_SECRET = base32Encode(Buffer.from("12345678901234567890", "ascii"));
const PERIOD_MS = TOTP_PERIOD_SECONDS * 1000;

describe("base32", () => {
  it("round-trips arbitrary bytes", () => {
    const bytes = Buffer.from([0, 1, 2, 250, 255, 128, 64]);
    expect(base32Decode(base32Encode(bytes))).toEqual(bytes);
  });

  it("rejects characters outside the alphabet", () => {
    expect(() => base32Decode("ABC1")).toThrow();
  });

  it("generates 160-bit secrets", () => {
    expect(base32Decode(generateTotpSecret())).toHaveLength(20);
  });
});

describe("TOTP", () => {
  it.each([
    [59, "94287082"],
    [1111111109, "07081804"],
    [2000000000, "69279037"],
  ])("matches RFC 6238 vector at t=%i", (seconds, expected) => {
    const key = Buffer.from("12345678901234567890", "ascii");
    expect(hotp(key, stepAt(seconds * 1000), 8)).toBe(expected);
  });

  it("accepts the current code and returns its step", () => {
    const now = 1111111109_000;
    expect(findMatchingStep(RFC_SECRET, "081804", now)).toBe(stepAt(now));
  });

  it("tolerates one step of clock drift either way", () => {
    const now = 1111111109_000;
    expect(findMatchingStep(RFC_SECRET, "081804", now + PERIOD_MS)).toBe(stepAt(now));
    expect(findMatchingStep(RFC_SECRET, "081804", now - PERIOD_MS)).toBe(stepAt(now));
  });

  it("rejects codes outside the drift window", () => {
    const now = 1111111109_000;
    expect(findMatchingStep(RFC_SECRET, "081804", now + 2 * PERIOD_MS)).toBeNull();
  });

  it("rejects wrong and malformed codes", () => {
    const now = 1111111109_000;
    expect(findMatchingStep(RFC_SECRET, "000000", now)).toBeNull();
    expect(findMatchingStep(RFC_SECRET, "08180", now)).toBeNull();
    expect(findMatchingStep(RFC_SECRET, "08180a", now)).toBeNull();
  });

  it("builds an otpauth URI authenticator apps understand", () => {
    const uri = otpauthUri("JBSWY3DPEHPK3PXP", "admin", "Solaris Bronceado");
    expect(uri).toMatch(/^otpauth:\/\/totp\/Solaris%20Bronceado%3Aadmin\?/);
    expect(uri).toContain("secret=JBSWY3DPEHPK3PXP");
  });
});
