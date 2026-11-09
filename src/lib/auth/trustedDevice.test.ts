import { describe, expect, it } from "vitest";
import { fakeClock } from "../../../test/mongo";
import { TRUSTED_DEVICE_TTL_MS, TrustedDeviceTokens } from "./trustedDevice";

const SECRET = "test-auth-secret-of-sufficient-length";

describe("TrustedDeviceTokens", () => {
  it("verifies a token it issued until it expires", () => {
    const clock = fakeClock();
    const devices = new TrustedDeviceTokens(SECRET, clock.now);
    const { token, expiresAt } = devices.issue();
    expect(expiresAt.getTime()).toBe(clock.now() + TRUSTED_DEVICE_TTL_MS);
    expect(devices.verify(token)).toBe(true);
    clock.advance(TRUSTED_DEVICE_TTL_MS);
    expect(devices.verify(token)).toBe(false);
  });

  it("rejects tokens signed with another secret", () => {
    const clock = fakeClock();
    const { token } = new TrustedDeviceTokens("another-secret-of-sufficient-length", clock.now).issue();
    expect(new TrustedDeviceTokens(SECRET, clock.now).verify(token)).toBe(false);
  });

  it("rejects a tampered expiry", () => {
    const clock = fakeClock();
    const devices = new TrustedDeviceTokens(SECRET, clock.now);
    const [expiry, signature] = devices.issue().token.split(".");
    expect(devices.verify(`${Number(expiry) + TRUSTED_DEVICE_TTL_MS}.${signature}`)).toBe(false);
  });

  it.each([undefined, "", "garbage", "123.abc", `${"9".repeat(13)}.${"A".repeat(44)}`])(
    "rejects malformed token %s",
    (token) => {
      expect(new TrustedDeviceTokens(SECRET, fakeClock().now).verify(token)).toBe(false);
    },
  );
});
