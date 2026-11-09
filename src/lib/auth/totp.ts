/**
 * RFC 6238 TOTP (HMAC-SHA1, 6 digits, 30 s) — the variant every authenticator
 * app (Google Authenticator, 1Password, Authy…) supports. Node stdlib only, and
 * free of `server-only`/aliases so scripts/setup-admin.ts can import it.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const TOTP_PERIOD_SECONDS = 30;
export const TOTP_DIGITS = 6;
/** Accept the previous/next step to tolerate clock drift. */
export const TOTP_DRIFT_STEPS = 1;

const SECRET_BYTES = 20; // 160 bits, as recommended by RFC 4226
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const BASE32_BITS = 5;
const BYTE_BITS = 8;
const MS_PER_SECOND = 1000;
const CODE_PATTERN = new RegExp(`^\\d{${TOTP_DIGITS}}$`);

export function base32Encode(data: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of data) {
    value = (value << BYTE_BITS) | byte;
    bits += BYTE_BITS;
    while (bits >= BASE32_BITS) {
      out += BASE32_ALPHABET[(value >>> (bits - BASE32_BITS)) & 31];
      bits -= BASE32_BITS;
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[(value << (BASE32_BITS - bits)) & 31];
  return out;
}

/** Throws on characters outside the RFC 4648 base32 alphabet. */
export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) throw new Error("Invalid base32 character");
    value = (value << BASE32_BITS) | index;
    bits += BASE32_BITS;
    if (bits >= BYTE_BITS) {
      bytes.push((value >>> (bits - BYTE_BITS)) & 0xff);
      bits -= BYTE_BITS;
    }
  }
  return Buffer.from(bytes);
}

export function generateTotpSecret(): string {
  return base32Encode(randomBytes(SECRET_BYTES));
}

export function stepAt(nowMs: number): number {
  return Math.floor(nowMs / MS_PER_SECOND / TOTP_PERIOD_SECONDS);
}

/** HOTP (RFC 4226) for a given counter, using a raw key. */
export function hotp(key: Buffer, counter: number, digits: number = TOTP_DIGITS): string {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", key).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = digest.readUInt32BE(offset) & 0x7fffffff;
  return (binary % 10 ** digits).toString().padStart(digits, "0");
}

/**
 * Returns the time step `code` is valid for (within ±TOTP_DRIFT_STEPS of now),
 * or null. Every candidate is compared in constant time with no early exit.
 */
export function findMatchingStep(secretBase32: string, code: string, nowMs: number): number | null {
  if (!CODE_PATTERN.test(code)) return null;
  const key = base32Decode(secretBase32);
  const current = stepAt(nowMs);
  const provided = Buffer.from(code);
  let matched: number | null = null;
  for (let step = current - TOTP_DRIFT_STEPS; step <= current + TOTP_DRIFT_STEPS; step++) {
    if (timingSafeEqual(Buffer.from(hotp(key, step)), provided) && matched === null) matched = step;
  }
  return matched;
}

export function otpauthUri(secretBase32: string, account: string, issuer: string): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}
