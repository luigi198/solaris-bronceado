import type { Db } from "mongodb";

export const COLLECTIONS = {
  posts: "posts",
  sessions: "auth_sessions",
  attempts: "auth_attempts",
  locks: "auth_locks",
  state: "auth_state",
} as const;

/**
 * Idempotent; safe to run on every cold start. TTL indexes let MongoDB purge
 * expired sessions and rate-limit counters on its own.
 */
export async function ensureIndexes(db: Db): Promise<void> {
  await Promise.all([
    db.collection(COLLECTIONS.posts).createIndexes([
      { key: { slug: 1 }, name: "slug_unique", unique: true },
      { key: { previousSlugs: 1 }, name: "previous_slugs" },
      { key: { status: 1, publishedAt: -1 }, name: "status_published_at" },
    ]),
    db.collection(COLLECTIONS.sessions).createIndexes([
      { key: { tokenHash: 1 }, name: "token_hash_unique", unique: true },
      { key: { expiresAt: 1 }, name: "expires_ttl", expireAfterSeconds: 0 },
    ]),
    db.collection(COLLECTIONS.attempts).createIndexes([
      { key: { key: 1 }, name: "key" },
      { key: { expiresAt: 1 }, name: "expires_ttl", expireAfterSeconds: 0 },
    ]),
    db.collection(COLLECTIONS.locks).createIndexes([
      { key: { expiresAt: 1 }, name: "expires_ttl", expireAfterSeconds: 0 },
    ]),
  ]);
}

const DUPLICATE_KEY_CODE = 11000;

export function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === DUPLICATE_KEY_CODE;
}
