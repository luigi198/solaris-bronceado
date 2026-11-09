import { MongoClient, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { ensureIndexes } from "../src/lib/storage/mongo/collections";

/**
 * Real mongod (in-memory) per test file, wiped before each test. Returns a
 * getter because the Db only exists once beforeAll has run.
 */
export function setupTestDb(): () => Db {
  let server: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    client = await MongoClient.connect(server.getUri());
    db = client.db("test");
    await ensureIndexes(db);
  });

  beforeEach(async () => {
    const collections = await db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });

  afterAll(async () => {
    await client?.close();
    await server?.stop();
  });

  return () => db;
}

/** Controllable clock for time-dependent logic. */
export function fakeClock(start = Date.UTC(2026, 0, 1)) {
  let now = start;
  return {
    now: () => now,
    advance: (ms: number) => {
      now += ms;
    },
  };
}
