import "server-only";
import { z } from "zod";
import { ConfigError } from "@/lib/errors";
import { parsePasswordHash } from "@/lib/auth/password";

/**
 * Environment is validated lazily per feature (on first use), so a page that
 * never touches S3 does not fail because S3 is unconfigured. Errors name the
 * offending variables but never echo their values.
 */

const BASE32_SECRET = /^[A-Z2-7]{32,}$/;
// 32 random bytes base64url-encoded is 43 characters.
const MIN_AUTH_SECRET_LENGTH = 43;

const mongoSchema = z.object({
  MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//),
  MONGODB_DB: z.string().min(1).default("solaris"),
});

const authSchema = z.object({
  ADMIN_USERNAME: z.string().min(3).max(64),
  ADMIN_PASSWORD_HASH: z.string().refine((v) => parsePasswordHash(v) !== null, "malformed scrypt hash"),
  ADMIN_TOTP_SECRET: z.string().regex(BASE32_SECRET),
  AUTH_SECRET: z.string().min(MIN_AUTH_SECRET_LENGTH),
});

const s3Schema = z.object({
  // Vercel reserves the AWS_* names, hence the S3_* prefix.
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  S3_ACCESS_KEY_ID: z.string().min(16),
  S3_SECRET_ACCESS_KEY: z.string().min(16),
  NEXT_PUBLIC_IMAGE_BASE_URL: z.url({ protocol: /^https$/ }).transform((v) => v.replace(/\/+$/, "")),
});

export type MongoEnv = z.infer<typeof mongoSchema>;
export type AuthEnv = z.infer<typeof authSchema>;
export type S3Env = z.infer<typeof s3Schema>;

function loader<T>(name: string, schema: z.ZodType<T>): () => T {
  let cached: T | undefined;
  return () => {
    if (cached) return cached;
    const result = schema.safeParse(process.env);
    if (!result.success) {
      const vars = [...new Set(result.error.issues.map((i) => i.path.join(".")))].join(", ");
      throw new ConfigError(`Invalid or missing ${name} environment variables: ${vars}`);
    }
    cached = result.data;
    return cached;
  };
}

export const getMongoEnv = loader("MongoDB", mongoSchema);
export const getAuthEnv = loader("admin auth", authSchema);
export const getS3Env = loader("S3", s3Schema);
