"use client";

import { useActionState } from "react";
import { ui } from "../_components/ui";
import { loginAction, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div>
        <label htmlFor="username" className={ui.label}>
          Usuario
        </label>
        <input id="username" name="username" autoComplete="username" required maxLength={64} className={ui.input} />
      </div>
      <div>
        <label htmlFor="password" className={ui.label}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          className={ui.input}
        />
      </div>
      <div>
        <label htmlFor="totp" className={ui.label}>
          Código de verificación
        </label>
        <input
          id="totp"
          name="totp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          aria-describedby="totp-hint"
          className={`${ui.input} tracking-[0.3em]`}
        />
        <p id="totp-hint" className={ui.hint}>
          Los 6 dígitos de tu app de autenticación.
        </p>
      </div>

      <p role="alert" aria-live="assertive" className={ui.error}>
        {state.error}
      </p>

      <button type="submit" disabled={pending} className={`${ui.buttonPrimary} w-full`}>
        {pending ? "Verificando…" : "Entrar"}
      </button>
    </form>
  );
}
