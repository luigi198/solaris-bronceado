"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { InvalidCredentialsError, RateLimitedError } from "@/lib/errors";
import { getClientPseudonym, readDeviceCookie, setDeviceCookie, setSessionCookie } from "@/lib/http/adminAuth";
import { logger } from "@/lib/logger";
import { getLoginService } from "@/lib/server/container";

export interface LoginState {
  error: string | null;
}

const MIN_FAILURE_RESPONSE_MS = 1000;
const MS_PER_MINUTE = 60_000;
const GENERIC_ERROR = "Usuario, contraseña o código incorrectos.";

// Caps also stop oversized inputs from being used to burn CPU in scrypt.
const loginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(256),
  totp: z.string().regex(/^\d{6}$/),
});

/** Uniform failure latency so response time leaks nothing about why it failed. */
async function padFailure(startedAt: number): Promise<void> {
  const remaining = MIN_FAILURE_RESPONSE_MS - (Date.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const startedAt = Date.now();
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    totp: String(formData.get("totp") ?? "").replace(/\s+/g, ""),
  });
  if (!parsed.success) {
    await padFailure(startedAt);
    return { error: GENERIC_ERROR };
  }

  try {
    const login = await getLoginService();
    const { session, device } = await login.login({
      username: parsed.data.username,
      password: parsed.data.password,
      totpCode: parsed.data.totp,
      clientPseudonym: await getClientPseudonym(),
      deviceToken: await readDeviceCookie(),
    });
    await setSessionCookie(session.token, session.expiresAt);
    await setDeviceCookie(device.token, device.expiresAt);
  } catch (err) {
    await padFailure(startedAt);
    if (err instanceof InvalidCredentialsError) return { error: GENERIC_ERROR };
    if (err instanceof RateLimitedError) {
      const minutes = Math.ceil(err.retryAfterMs / MS_PER_MINUTE);
      logger.warn("auth.login.rate_limited", { retryAfterMinutes: minutes });
      return { error: `Demasiados intentos. Intenta de nuevo en ${minutes} minuto${minutes === 1 ? "" : "s"}.` };
    }
    logger.error("auth.login.error", { err });
    return { error: "No se pudo iniciar sesión por un problema del servidor. Intenta más tarde." };
  }
  redirect("/admin");
}
