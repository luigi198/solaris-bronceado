/**
 * One-time admin credential generator. Run locally:
 *
 *   npm run setup:admin
 *
 * Prints the env vars to paste into .env.local and Vercel. The plaintext
 * password is never written anywhere; only its scrypt hash is printed.
 */
import { randomBytes } from "node:crypto";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/lib/auth/password.ts";
import { generateTotpSecret, otpauthUri } from "../src/lib/auth/totp.ts";

const MIN_PASSWORD_LENGTH = 16;
const AUTH_SECRET_BYTES = 32;
const ISSUER = "Solaris Bronceado";

/** Reads a line without echoing it to the terminal. */
async function askHidden(question: string): Promise<string> {
  stdout.write(question);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  let value = "";
  return new Promise((resolve, reject) => {
    const onData = (char: string) => {
      if (char === "\u0003") {
        stdin.setRawMode(false);
        reject(new Error("Cancelled"));
      } else if (char === "\r" || char === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (char === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main(): Promise<void> {
  if (!stdin.isTTY) throw new Error("Run this in an interactive terminal.");
  const rl = createInterface({ input: stdin, output: stdout });
  const username = (await rl.question("Admin username: ")).trim();
  rl.close();
  if (username.length < 3) throw new Error("Username must be at least 3 characters.");

  const password = await askHidden(`Password (min ${MIN_PASSWORD_LENGTH} chars, use a password manager): `);
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if ((await askHidden("Repeat password: ")) !== password) throw new Error("Passwords do not match.");

  stdout.write("Hashing (scrypt, takes a moment)…\n");
  const passwordHash = await hashPassword(password);
  const totpSecret = generateTotpSecret();
  const authSecret = randomBytes(AUTH_SECRET_BYTES).toString("base64url");

  stdout.write(`
──────── Add these to .env.local and Vercel (Production + Preview) ────────
ADMIN_USERNAME=${username}
ADMIN_PASSWORD_HASH=${passwordHash}
ADMIN_TOTP_SECRET=${totpSecret}
AUTH_SECRET=${authSecret}
────────────────────────────────────────────────────────────────────────────

Two-factor setup — in your authenticator app choose "Enter a setup key":
  Account: ${username}
  Key:     ${totpSecret}
  Type:    Time-based
Or open this URI on the device with the app (e.g. paste into 1Password):
  ${otpauthUri(totpSecret, username, ISSUER)}

Treat all of the above as secrets. Close this terminal tab when done.
`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
