/**
 * Minimal structured JSON logger. Output goes to stdout/stderr, which Vercel
 * collects as runtime logs. Values whose key looks sensitive are redacted as a
 * last line of defence — callers must still never pass secrets or PII.
 */

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const SENSITIVE_KEY = /pass|secret|token|totp|^code$|cookie|authorization|hash|^ip$/i;
const REDACTED = "[redacted]";
const MIN_LEVEL: Level = process.env.NODE_ENV === "production" ? "info" : "debug";
const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function serializeError(err: unknown): Fields {
  if (err instanceof Error) {
    return { errorName: err.name, errorMessage: err.message, stack: err.stack };
  }
  return { errorMessage: String(err) };
}

function redact(fields: Fields): Fields {
  const out: Fields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (key === "err") Object.assign(out, serializeError(value));
    else out[key] = SENSITIVE_KEY.test(key) ? REDACTED : value;
  }
  return out;
}

function write(level: Level, event: string, fields: Fields): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...redact(fields) });
  if (level === "error" || level === "warn") console.error(line);
  else console.log(line);
}

export const logger = {
  debug: (event: string, fields: Fields = {}) => write("debug", event, fields),
  info: (event: string, fields: Fields = {}) => write("info", event, fields),
  warn: (event: string, fields: Fields = {}) => write("warn", event, fields),
  error: (event: string, fields: Fields = {}) => write("error", event, fields),
};
