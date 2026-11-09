import type { AttemptStore, Clock } from "@/lib/contracts/auth";
import { RateLimitedError } from "@/lib/errors";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

export interface LoginRateLimitPolicy {
  /** Attempts allowed per client in one window before it is locked. */
  clientMaxAttempts: number;
  clientWindowMs: number;
  /** Escalating lock durations for repeat offenders; the last one repeats. */
  clientLockDurationsMs: readonly number[];
  /** How long a client's lock history is remembered for escalation. */
  clientLockMemoryMs: number;
  /**
   * Attempts allowed across ALL clients per window — the backstop against a
   * distributed (many-IP) attack on the single admin account.
   */
  globalMaxAttempts: number;
  globalWindowMs: number;
  globalLockMs: number;
}

export const DEFAULT_LOGIN_POLICY: LoginRateLimitPolicy = {
  clientMaxAttempts: 5,
  clientWindowMs: 15 * MINUTE_MS,
  clientLockDurationsMs: [15 * MINUTE_MS, HOUR_MS, 24 * HOUR_MS],
  clientLockMemoryMs: 24 * HOUR_MS,
  globalMaxAttempts: 100,
  globalWindowMs: HOUR_MS,
  globalLockMs: 15 * MINUTE_MS,
};

const GLOBAL_KEY = "global";
const clientKey = (pseudonym: string) => `client:${pseudonym}`;

/**
 * Fixed-window login throttling with escalating per-client locks and a global
 * cap. Attempts are counted *before* credentials are checked, so concurrent
 * requests cannot slip past the limit while the slow hash runs.
 */
export class LoginRateLimiter {
  constructor(
    private readonly store: AttemptStore,
    private readonly clock: Clock,
    private readonly policy: LoginRateLimitPolicy = DEFAULT_LOGIN_POLICY,
  ) {}

  /** Throws RateLimitedError if the client or the whole login is locked. */
  async assertNotLocked(clientPseudonym: string): Promise<void> {
    const now = this.clock();
    for (const key of [clientKey(clientPseudonym), GLOBAL_KEY]) {
      const lock = await this.store.getLock(key);
      if (lock && lock.lockedUntil.getTime() > now) {
        throw new RateLimitedError(lock.lockedUntil.getTime() - now);
      }
    }
  }

  /** Counts one attempt; throws RateLimitedError (and locks) once over a limit. */
  async registerAttempt(clientPseudonym: string): Promise<void> {
    const now = this.clock();
    const { policy } = this;

    const clientCount = await this.increment(clientKey(clientPseudonym), policy.clientWindowMs, now);
    const globalCount = await this.increment(GLOBAL_KEY, policy.globalWindowMs, now);

    if (clientCount > policy.clientMaxAttempts) {
      const key = clientKey(clientPseudonym);
      const lockCount = await this.store.incrementLockCount(key, policy.clientLockMemoryMs);
      const durations = policy.clientLockDurationsMs;
      const duration = durations[Math.min(lockCount, durations.length) - 1];
      await this.store.setLockedUntil(key, new Date(now + duration));
      throw new RateLimitedError(duration);
    }

    if (globalCount > policy.globalMaxAttempts) {
      await this.store.incrementLockCount(GLOBAL_KEY, policy.globalLockMs);
      await this.store.setLockedUntil(GLOBAL_KEY, new Date(now + policy.globalLockMs));
      throw new RateLimitedError(policy.globalLockMs);
    }
  }

  /** Clears the client's counters and lock after a successful login. */
  async registerSuccess(clientPseudonym: string): Promise<void> {
    await this.store.clear(clientKey(clientPseudonym));
  }

  private increment(key: string, windowMs: number, now: number): Promise<number> {
    const windowStart = Math.floor(now / windowMs) * windowMs;
    return this.store.incrementWindow(key, windowStart, windowMs);
  }
}
