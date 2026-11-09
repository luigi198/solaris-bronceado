import type { Clock, TotpStepStore } from "@/lib/contracts/auth";
import { InvalidCredentialsError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { safeEqual } from "./digest";
import { verifyPassword } from "./password";
import type { LoginRateLimiter } from "./rateLimit";
import type { IssuedSession, SessionService } from "./session";
import { findMatchingStep } from "./totp";

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  totpSecret: string;
}

export interface LoginAttempt {
  username: string;
  password: string;
  totpCode: string;
  /** Keyed pseudonym of the client IP — never the raw IP. */
  clientPseudonym: string;
}

/**
 * Single-admin login. Order matters:
 *   1. reject locked clients before doing any expensive work;
 *   2. count the attempt before checking credentials (race-safe);
 *   3. evaluate username, password AND TOTP unconditionally so timing does not
 *      reveal which one was wrong;
 *   4. burn the TOTP step so a sniffed code cannot be replayed.
 */
export class LoginService {
  constructor(
    private readonly credentials: AdminCredentials,
    private readonly limiter: LoginRateLimiter,
    private readonly sessions: SessionService,
    private readonly totpSteps: TotpStepStore,
    private readonly clock: Clock,
  ) {}

  /** Throws InvalidCredentialsError or RateLimitedError. */
  async login(attempt: LoginAttempt): Promise<IssuedSession> {
    const client = attempt.clientPseudonym;
    await this.limiter.assertNotLocked(client);
    await this.limiter.registerAttempt(client);

    const usernameOk = safeEqual(attempt.username, this.credentials.username);
    const passwordOk = await verifyPassword(attempt.password, this.credentials.passwordHash);
    const step = findMatchingStep(this.credentials.totpSecret, attempt.totpCode, this.clock());

    if (!usernameOk || !passwordOk || step === null) {
      logger.warn("auth.login.failed", { client, reason: "invalid_credentials" });
      throw new InvalidCredentialsError();
    }
    if (!(await this.totpSteps.claimStep(step))) {
      logger.warn("auth.login.failed", { client, reason: "totp_replay" });
      throw new InvalidCredentialsError();
    }

    await this.limiter.registerSuccess(client);
    const session = await this.sessions.issue();
    logger.info("auth.login.succeeded", { client });
    return session;
  }
}
