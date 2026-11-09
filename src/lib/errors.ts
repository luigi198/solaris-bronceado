/**
 * Error taxonomy shared by every layer. `recoverable` tells callers whether the
 * failure is the user's to fix (bad input, wrong password, wait and retry) or
 * an operational fault (misconfiguration, infrastructure down).
 */
export abstract class AppError extends Error {
  abstract readonly recoverable: boolean;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export type FieldErrors = Readonly<Record<string, string>>;

export class ValidationError extends AppError {
  readonly recoverable = true;

  constructor(
    message: string,
    readonly fieldErrors: FieldErrors = {},
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly recoverable = true;
}

/** A unique value (e.g. a post slug) is already taken. */
export class ConflictError extends AppError {
  readonly recoverable = true;

  constructor(
    message: string,
    readonly field: string,
  ) {
    super(message);
  }
}

export class InvalidCredentialsError extends AppError {
  readonly recoverable = true;

  constructor() {
    super("Invalid credentials");
  }
}

export class RateLimitedError extends AppError {
  readonly recoverable = true;

  constructor(readonly retryAfterMs: number) {
    super("Too many attempts");
  }
}

/** Missing/invalid environment configuration. Never recoverable at runtime. */
export class ConfigError extends AppError {
  readonly recoverable = false;
}
