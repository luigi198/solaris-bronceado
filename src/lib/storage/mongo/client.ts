import "server-only";
import { MongoClient, type Db } from "mongodb";
import { logger } from "@/lib/logger";
import { ensureIndexes } from "./collections";

const MAX_POOL_SIZE = 10;
const SERVER_SELECTION_TIMEOUT_MS = 5_000;

interface MongoCache {
  db?: Promise<Db>;
}

// Reuse one client per serverless instance (and across dev hot reloads).
const globalForMongo = globalThis as typeof globalThis & { __solarisMongo?: MongoCache };
const cache: MongoCache = (globalForMongo.__solarisMongo ??= {});

async function connect(uri: string, dbName: string): Promise<Db> {
  const client = new MongoClient(uri, {
    maxPoolSize: MAX_POOL_SIZE,
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    appName: "solaris-bronceado",
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    await ensureIndexes(db);
    logger.info("mongo.connected", { dbName });
    return db;
  } catch (err) {
    logger.error("mongo.connect_failed", { dbName, err });
    await client.close().catch(() => undefined);
    throw err;
  }
}

export function getDb(uri: string, dbName: string): Promise<Db> {
  if (!cache.db) {
    cache.db = connect(uri, dbName).catch((err: unknown) => {
      cache.db = undefined; // allow the next request to retry
      throw err;
    });
  }
  return cache.db;
}
