import "server-only";
import { LoginService } from "@/lib/auth/login";
import { LoginRateLimiter } from "@/lib/auth/rateLimit";
import { SessionService } from "@/lib/auth/session";
import { TrustedDeviceTokens } from "@/lib/auth/trustedDevice";
import { PostService } from "@/lib/blog/postService";
import type { Clock } from "@/lib/contracts/auth";
import type { ImageRemover } from "@/lib/contracts/images";
import { ImageService } from "@/lib/images/imageService";
import { MongoAttemptStore, MongoSessionStore, MongoTotpStepStore } from "@/lib/storage/mongo/authStores";
import { getDb } from "@/lib/storage/mongo/client";
import { MongoPostRepository } from "@/lib/storage/mongo/postRepository";
import { S3ImageStorage } from "@/lib/storage/s3/s3ImageStorage";
import { IMAGE_BASE_URL } from "@/lib/images/publicConfig";
import { getAuthEnv, getMongoEnv, getS3Env } from "./env";

/**
 * Composition root: the only module that knows which concrete adapters back
 * each domain service. Presentation code asks for services here.
 */

const clock: Clock = () => Date.now();

function db() {
  const { MONGODB_URI, MONGODB_DB } = getMongoEnv();
  return getDb(MONGODB_URI, MONGODB_DB);
}

/** Resolved on first use so public pages never need the S3 credentials. */
const lazyImageRemover: ImageRemover = {
  removeImages: (urls) => getImageService().removeImages(urls),
};

export async function getPostService(): Promise<PostService> {
  return new PostService(new MongoPostRepository(await db()), clock, IMAGE_BASE_URL, lazyImageRemover);
}

export async function getSessionService(): Promise<SessionService> {
  return new SessionService(new MongoSessionStore(await db()), clock);
}

export async function getLoginService(): Promise<LoginService> {
  const env = getAuthEnv();
  const database = await db();
  return new LoginService(
    { username: env.ADMIN_USERNAME, passwordHash: env.ADMIN_PASSWORD_HASH, totpSecret: env.ADMIN_TOTP_SECRET },
    new LoginRateLimiter(new MongoAttemptStore(database), clock),
    new SessionService(new MongoSessionStore(database), clock),
    new MongoTotpStepStore(database),
    new TrustedDeviceTokens(env.AUTH_SECRET, clock),
    clock,
  );
}

export function getImageService(): ImageService {
  const env = getS3Env();
  return new ImageService(
    new S3ImageStorage({
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      publicBaseUrl: env.NEXT_PUBLIC_IMAGE_BASE_URL,
    }),
    env.NEXT_PUBLIC_IMAGE_BASE_URL,
  );
}
