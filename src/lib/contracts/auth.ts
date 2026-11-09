/**
 * Boundary contracts between the auth domain (src/lib/auth) and its storage
 * adapters (src/lib/storage). Neither side imports the other — both import this.
 */

/** Milliseconds since epoch. Injected so time-dependent logic is testable. */
export type Clock = () => number;

export interface SessionRecord {
  /** SHA-256 of the cookie token. The raw token is never persisted. */
  tokenHash: string;
  createdAt: Date;
  lastSeenAt: Date;
  /** Absolute expiry; the store purges the record after this instant. */
  expiresAt: Date;
}

export interface SessionStore {
  create(record: SessionRecord): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>;
  touch(tokenHash: string, at: Date): Promise<void>;
  delete(tokenHash: string): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface LockState {
  lockCount: number;
  lockedUntil: Date;
}

export interface AttemptStore {
  /**
   * Atomically increments the counter for `key` in the fixed window starting at
   * `windowStartMs` and returns the new count. The counter expires after `ttlMs`.
   */
  incrementWindow(key: string, windowStartMs: number, ttlMs: number): Promise<number>;
  getLock(key: string): Promise<LockState | null>;
  /**
   * Atomically bumps the lock counter for `key` and returns it. The lock record
   * (and so the escalation history) is forgotten after `memoryMs`.
   */
  incrementLockCount(key: string, memoryMs: number): Promise<number>;
  setLockedUntil(key: string, lockedUntil: Date): Promise<void>;
  /** Removes every window counter and the lock for `key`. */
  clear(key: string): Promise<void>;
}

export interface TotpStepStore {
  /**
   * Atomically records `step` as used. Returns false when this step (or a later
   * one) was already used, which is how TOTP code replay is prevented.
   */
  claimStep(step: number): Promise<boolean>;
}
