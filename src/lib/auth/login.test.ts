import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { fakeClock, setupTestDb } from "../../../test/mongo";
import { InvalidCredentialsError, RateLimitedError } from "@/lib/errors";
import { MongoAttemptStore, MongoSessionStore, MongoTotpStepStore } from "@/lib/storage/mongo/authStores";
import { LoginService, type AdminCredentials, type LoginAttempt } from "./login";
import { hashPassword } from "./password";
import { DEFAULT_LOGIN_POLICY, LoginRateLimiter } from "./rateLimit";
import { SESSION_ABSOLUTE_TTL_MS, SESSION_IDLE_TTL_MS, SessionService } from "./session";
import { base32Decode, generateTotpSecret, hotp, stepAt, TOTP_PERIOD_SECONDS } from "./totp";

const getDb = setupTestDb();
const PASSWORD = "a-long-and-unique-passphrase";
const PERIOD_MS = TOTP_PERIOD_SECONDS * 1000;
const MINUTE_MS = 60_000;

let credentials: AdminCredentials;

beforeAll(async () => {
  credentials = {
    username: "admin",
    passwordHash: await hashPassword(PASSWORD, { logN: 14, r: 8, p: 1 }),
    totpSecret: generateTotpSecret(),
  };
});

function setup() {
  const clock = fakeClock();
  const db = getDb();
  const sessions = new SessionService(new MongoSessionStore(db), clock.now);
  const login = new LoginService(
    credentials,
    new LoginRateLimiter(new MongoAttemptStore(db), clock.now),
    sessions,
    new MongoTotpStepStore(db),
    clock.now,
  );
  const codeNow = () => hotp(base32Decode(credentials.totpSecret), stepAt(clock.now()));
  const attempt = (overrides: Partial<LoginAttempt> = {}): LoginAttempt => ({
    username: "admin",
    password: PASSWORD,
    totpCode: codeNow(),
    clientPseudonym: "client-a",
    ...overrides,
  });
  return { clock, sessions, login, attempt };
}

describe("LoginService", () => {
  let ctx: ReturnType<typeof setup>;
  beforeEach(() => {
    ctx = setup();
  });

  it("issues a valid session for correct credentials", async () => {
    const session = await ctx.login.login(ctx.attempt());
    expect(await ctx.sessions.validate(session.token)).toBe(true);
  });

  it.each([
    ["username", { username: "root" }],
    ["password", { password: "wrong" }],
    ["TOTP code", { totpCode: "000000" }],
  ])("rejects a wrong %s with the same generic error", async (_label, overrides) => {
    await expect(ctx.login.login(ctx.attempt(overrides))).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rejects a replayed TOTP code", async () => {
    const code = ctx.attempt().totpCode;
    await ctx.login.login(ctx.attempt({ totpCode: code }));
    await expect(ctx.login.login(ctx.attempt({ totpCode: code }))).rejects.toBeInstanceOf(InvalidCredentialsError);
    ctx.clock.advance(PERIOD_MS);
    await expect(ctx.login.login(ctx.attempt())).resolves.toBeDefined();
  });

  it("locks a client after too many attempts, even with the right password", async () => {
    for (let i = 0; i < DEFAULT_LOGIN_POLICY.clientMaxAttempts; i++) {
      await expect(ctx.login.login(ctx.attempt({ password: "wrong" }))).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
    }
    await expect(ctx.login.login(ctx.attempt())).rejects.toBeInstanceOf(RateLimitedError);
    // Locked: still refused before the lock expires.
    ctx.clock.advance(14 * MINUTE_MS);
    await expect(ctx.login.login(ctx.attempt())).rejects.toBeInstanceOf(RateLimitedError);
  });

  it("does not let one client's lockout affect another", async () => {
    for (let i = 0; i <= DEFAULT_LOGIN_POLICY.clientMaxAttempts; i++) {
      await ctx.login.login(ctx.attempt({ password: "wrong" })).catch(() => undefined);
    }
    await expect(ctx.login.login(ctx.attempt({ clientPseudonym: "client-b" }))).resolves.toBeDefined();
  });

  it("escalates the lock for repeat offenders", async () => {
    const lockOut = async () => {
      for (let i = 0; i <= DEFAULT_LOGIN_POLICY.clientMaxAttempts; i++) {
        await ctx.login.login(ctx.attempt({ password: "wrong" })).catch(() => undefined);
      }
    };
    await lockOut();
    ctx.clock.advance(16 * MINUTE_MS); // first lock (15 min) over, new window
    await lockOut();
    ctx.clock.advance(16 * MINUTE_MS); // second lock is 1 h: still locked
    await expect(ctx.login.login(ctx.attempt())).rejects.toBeInstanceOf(RateLimitedError);
  });

  it("applies the global cap across many clients", async () => {
    for (let i = 0; i < DEFAULT_LOGIN_POLICY.globalMaxAttempts; i++) {
      await ctx.login.login(ctx.attempt({ password: "wrong", clientPseudonym: `bot-${i}` })).catch(() => undefined);
    }
    await expect(ctx.login.login(ctx.attempt({ clientPseudonym: "fresh" }))).rejects.toBeInstanceOf(
      RateLimitedError,
    );
  });
});

describe("SessionService", () => {
  let ctx: ReturnType<typeof setup>;
  beforeEach(() => {
    ctx = setup();
  });

  it("rejects missing, malformed and unknown tokens", async () => {
    expect(await ctx.sessions.validate(undefined)).toBe(false);
    expect(await ctx.sessions.validate("short")).toBe(false);
    expect(await ctx.sessions.validate("A".repeat(43))).toBe(false);
  });

  it("expires idle sessions", async () => {
    const { token } = await ctx.sessions.issue();
    ctx.clock.advance(SESSION_IDLE_TTL_MS + 1);
    expect(await ctx.sessions.validate(token)).toBe(false);
  });

  it("keeps active sessions alive until the absolute limit", async () => {
    const { token } = await ctx.sessions.issue();
    const step = SESSION_IDLE_TTL_MS / 2;
    for (let elapsed = step; elapsed < SESSION_ABSOLUTE_TTL_MS; elapsed += step) {
      ctx.clock.advance(step);
      expect(await ctx.sessions.validate(token)).toBe(true);
    }
    ctx.clock.advance(step);
    expect(await ctx.sessions.validate(token)).toBe(false);
  });

  it("revokes a single session and all sessions", async () => {
    const a = await ctx.sessions.issue();
    const b = await ctx.sessions.issue();
    await ctx.sessions.revoke(a.token);
    expect(await ctx.sessions.validate(a.token)).toBe(false);
    expect(await ctx.sessions.validate(b.token)).toBe(true);
    await ctx.sessions.revokeAll();
    expect(await ctx.sessions.validate(b.token)).toBe(false);
  });
});
