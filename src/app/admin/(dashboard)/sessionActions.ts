"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, readSessionCookie, requireAdmin } from "@/lib/http/adminAuth";
import { ADMIN_LOGIN_PATH } from "@/lib/http/sessionCookie";
import { logger } from "@/lib/logger";
import { getSessionService } from "@/lib/server/container";

export async function logoutAction(): Promise<void> {
  const token = await readSessionCookie();
  if (token) await (await getSessionService()).revoke(token);
  await clearSessionCookie();
  logger.info("auth.logout");
  redirect(ADMIN_LOGIN_PATH);
}

/** "Log out everywhere": revokes every session, e.g. after using a shared device. */
export async function logoutEverywhereAction(): Promise<void> {
  await requireAdmin();
  await (await getSessionService()).revokeAll();
  await clearSessionCookie();
  logger.info("auth.logout_all");
  redirect(ADMIN_LOGIN_PATH);
}
