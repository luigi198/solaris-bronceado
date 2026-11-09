import { randomBytes } from "node:crypto";
import type { Clock, SessionStore } from "@/lib/contracts/auth";
import { sha256 } from "./digest";

const MINUTE_MS = 60_000;
export const SESSION_ABSOLUTE_TTL_MS = 8 * 60 * MINUTE_MS;
export const SESSION_IDLE_TTL_MS = 60 * MINUTE_MS;
/** Avoid a DB write on every request: refresh lastSeenAt at most once a minute. */
const TOUCH_INTERVAL_MS = MINUTE_MS;
const TOKEN_BYTES = 32; // 256-bit, unguessable
/** base64url length of TOKEN_BYTES; anything else is rejected without a lookup. */
const TOKEN_LENGTH = 43;

export interface IssuedSession {
  token: string;
  expiresAt: Date;
}

/**
 * Opaque, server-side sessions. The cookie carries a random token; the store
 * only ever sees its SHA-256, so a database leak does not leak live sessions.
 * Server-side state means logout and "log out everywhere" really revoke.
 */
export class SessionService {
  constructor(
    private readonly store: SessionStore,
    private readonly clock: Clock,
  ) {}

  async issue(): Promise<IssuedSession> {
    const now = this.clock();
    const token = randomBytes(TOKEN_BYTES).toString("base64url");
    const expiresAt = new Date(now + SESSION_ABSOLUTE_TTL_MS);
    await this.store.create({
      tokenHash: sha256(token),
      createdAt: new Date(now),
      lastSeenAt: new Date(now),
      expiresAt,
    });
    return { token, expiresAt };
  }

  /** True when `token` maps to a live session; expired sessions are deleted. */
  async validate(token: string | undefined): Promise<boolean> {
    if (!token || token.length !== TOKEN_LENGTH) return false;
    const tokenHash = sha256(token);
    const record = await this.store.findByTokenHash(tokenHash);
    if (!record) return false;

    const now = this.clock();
    const idleExpired = now - record.lastSeenAt.getTime() > SESSION_IDLE_TTL_MS;
    if (record.expiresAt.getTime() <= now || idleExpired) {
      await this.store.delete(tokenHash);
      return false;
    }
    if (now - record.lastSeenAt.getTime() > TOUCH_INTERVAL_MS) {
      await this.store.touch(tokenHash, new Date(now));
    }
    return true;
  }

  async revoke(token: string): Promise<void> {
    await this.store.delete(sha256(token));
  }

  async revokeAll(): Promise<void> {
    await this.store.deleteAll();
  }
}
