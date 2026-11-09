import { createHmac } from "node:crypto";
import type { Clock } from "@/lib/contracts/auth";
import { safeEqual } from "./digest";

const DAY_MS = 86_400_000;
export const TRUSTED_DEVICE_TTL_MS = 30 * DAY_MS;
/** Domain separation: this HMAC must never be valid for any other AUTH_SECRET use. */
const PURPOSE = "trusted-device:v1";
const TOKEN_PATTERN = /^(\d{13})\.([A-Za-z0-9_-]{43})$/;

export interface IssuedDeviceToken {
  token: string;
  expiresAt: Date;
}

/**
 * Stateless "this browser has logged in successfully before" marker
 * (OWASP device cookies). It only exempts the browser from the *global* login
 * cap, so an attacker flooding the login from many IPs cannot lock the real
 * admin out. It grants no access by itself: password, TOTP and per-client
 * limits still apply. Rotating AUTH_SECRET revokes every token.
 */
export class TrustedDeviceTokens {
  constructor(
    private readonly secret: string,
    private readonly clock: Clock,
  ) {}

  issue(): IssuedDeviceToken {
    const expiresAtMs = this.clock() + TRUSTED_DEVICE_TTL_MS;
    return { token: `${expiresAtMs}.${this.sign(expiresAtMs)}`, expiresAt: new Date(expiresAtMs) };
  }

  verify(token: string | undefined): boolean {
    const match = token ? TOKEN_PATTERN.exec(token) : null;
    if (!match) return false;
    const expiresAtMs = Number(match[1]);
    if (expiresAtMs <= this.clock()) return false;
    return safeEqual(match[2], this.sign(expiresAtMs));
  }

  private sign(expiresAtMs: number): string {
    return createHmac("sha256", this.secret).update(`${PURPOSE}:${expiresAtMs}`).digest("base64url");
  }
}
