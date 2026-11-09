import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { pseudonymize } from "@/lib/auth/digest";
import { getAuthEnv } from "@/lib/server/env";
import { getSessionService } from "@/lib/server/container";
import { ADMIN_LOGIN_PATH, SESSION_COOKIE } from "./sessionCookie";

const UNKNOWN_CLIENT = "unknown";

/**
 * On Vercel, x-forwarded-for is set by the edge and cannot be spoofed by the
 * client (Vercel overwrites it). The first entry is the real client IP.
 */
export async function getClientPseudonym(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || UNKNOWN_CLIENT;
  return pseudonymize(getAuthEnv().AUTH_SECRET, ip);
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function readSessionCookie(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export const isAdmin = cache(async (): Promise<boolean> => {
  const sessions = await getSessionService();
  return sessions.validate(await readSessionCookie());
});

/**
 * The real authorization check. Call it at the top of every admin page and
 * Server Action — the proxy only does an optimistic cookie-presence redirect.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect(ADMIN_LOGIN_PATH);
}
