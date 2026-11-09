/**
 * scrypt password hashing (Node stdlib, memory-hard). Encoded format:
 *   scrypt:<log2 N>:<r>:<p>:<salt base64url>:<hash base64url>
 * `:` is used instead of `$` because Next's dotenv expansion treats `$x` as a
 * variable reference inside .env files.
 *
 * Kept free of `server-only` and path aliases so scripts/setup-admin.ts can
 * import it directly with Node.
 */
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

const PREFIX = "scrypt";
const SEPARATOR = ":";
const SALT_BYTES = 16;
const KEY_BYTES = 64;
// OWASP 2024+ guidance for scrypt: N=2^17, r=8, p=1 (~128 MiB per hash).
const DEFAULT_LOG_N = 17;
const DEFAULT_R = 8;
const DEFAULT_P = 1;
// Bounds on accepted parameters so a malformed hash cannot pin the CPU/RAM.
const MIN_LOG_N = 14;
const MAX_LOG_N = 20;
const MAX_R = 16;
const MAX_P = 4;
// scrypt needs ~128 * N * r bytes; give it 2x headroom over the default 32 MiB cap.
const MEMORY_HEADROOM = 2;
const SCRYPT_BLOCK_FACTOR = 128;

interface ScryptParams {
  logN: number;
  r: number;
  p: number;
}

interface ParsedHash extends ScryptParams {
  salt: Buffer;
  hash: Buffer;
}

function derive(password: string, salt: Buffer, params: ScryptParams): Promise<Buffer> {
  const N = 2 ** params.logN;
  const options: ScryptOptions = {
    N,
    r: params.r,
    p: params.p,
    maxmem: SCRYPT_BLOCK_FACTOR * N * params.r * MEMORY_HEADROOM,
  };
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_BYTES, options, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

function isInt(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function parsePasswordHash(encoded: string): ParsedHash | null {
  const parts = encoded.split(SEPARATOR);
  if (parts.length !== 6 || parts[0] !== PREFIX) return null;
  const [logN, r, p] = parts.slice(1, 4).map(Number);
  if (!isInt(logN, MIN_LOG_N, MAX_LOG_N) || !isInt(r, 1, MAX_R) || !isInt(p, 1, MAX_P)) {
    return null;
  }
  const salt = Buffer.from(parts[4], "base64url");
  const hash = Buffer.from(parts[5], "base64url");
  if (salt.length < SALT_BYTES || hash.length !== KEY_BYTES) return null;
  return { logN, r, p, salt, hash };
}

export async function hashPassword(
  password: string,
  params: ScryptParams = { logN: DEFAULT_LOG_N, r: DEFAULT_R, p: DEFAULT_P },
): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await derive(password, salt, params);
  return [PREFIX, params.logN, params.r, params.p, salt.toString("base64url"), hash.toString("base64url")].join(
    SEPARATOR,
  );
}

/** Constant-time verification. Returns false (never throws) for a malformed hash. */
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parsed = parsePasswordHash(encoded);
  if (!parsed) return false;
  const candidate = await derive(password, parsed.salt, parsed);
  return timingSafeEqual(candidate, parsed.hash);
}
