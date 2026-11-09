import type { Db } from "mongodb";
import type {
  AttemptStore,
  LockState,
  SessionRecord,
  SessionStore,
  TotpStepStore,
} from "@/lib/contracts/auth";
import { COLLECTIONS, isDuplicateKeyError } from "./collections";

export class MongoSessionStore implements SessionStore {
  constructor(private readonly db: Db) {}

  private get sessions() {
    return this.db.collection<SessionRecord>(COLLECTIONS.sessions);
  }

  async create(record: SessionRecord): Promise<void> {
    await this.sessions.insertOne({ ...record });
  }

  async findByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    return this.sessions.findOne({ tokenHash }, { projection: { _id: 0 } });
  }

  async touch(tokenHash: string, at: Date): Promise<void> {
    await this.sessions.updateOne({ tokenHash }, { $set: { lastSeenAt: at } });
  }

  async delete(tokenHash: string): Promise<void> {
    await this.sessions.deleteOne({ tokenHash });
  }

  async deleteAll(): Promise<void> {
    await this.sessions.deleteMany({});
  }
}

interface AttemptDoc {
  _id: string;
  key: string;
  count: number;
  expiresAt: Date;
}

interface LockDoc {
  _id: string;
  lockCount: number;
  lockedUntil: Date;
  expiresAt: Date;
}

export class MongoAttemptStore implements AttemptStore {
  constructor(private readonly db: Db) {}

  private get attempts() {
    return this.db.collection<AttemptDoc>(COLLECTIONS.attempts);
  }

  private get locks() {
    return this.db.collection<LockDoc>(COLLECTIONS.locks);
  }

  async incrementWindow(key: string, windowStartMs: number, ttlMs: number): Promise<number> {
    const doc = await this.attempts.findOneAndUpdate(
      { _id: `${key}:${windowStartMs}` },
      { $inc: { count: 1 }, $setOnInsert: { key, expiresAt: new Date(windowStartMs + ttlMs) } },
      { upsert: true, returnDocument: "after" },
    );
    // With upsert + returnDocument "after" the driver always returns a document.
    return doc?.count ?? 1;
  }

  async getLock(key: string): Promise<LockState | null> {
    const doc = await this.locks.findOne({ _id: key });
    return doc ? { lockCount: doc.lockCount, lockedUntil: doc.lockedUntil } : null;
  }

  async incrementLockCount(key: string, memoryMs: number): Promise<number> {
    const doc = await this.locks.findOneAndUpdate(
      { _id: key },
      {
        $inc: { lockCount: 1 },
        $set: { expiresAt: new Date(Date.now() + memoryMs) },
        $setOnInsert: { lockedUntil: new Date(0) },
      },
      { upsert: true, returnDocument: "after" },
    );
    return doc?.lockCount ?? 1;
  }

  async setLockedUntil(key: string, lockedUntil: Date): Promise<void> {
    // $max: a concurrent shorter lock never shortens an existing longer one.
    await this.locks.updateOne({ _id: key }, { $max: { lockedUntil, expiresAt: lockedUntil } });
  }

  async clear(key: string): Promise<void> {
    await Promise.all([this.attempts.deleteMany({ key }), this.locks.deleteOne({ _id: key })]);
  }
}

interface StateDoc {
  _id: string;
  lastStep: number;
}

const TOTP_STATE_ID = "totp";

export class MongoTotpStepStore implements TotpStepStore {
  constructor(private readonly db: Db) {}

  async claimStep(step: number): Promise<boolean> {
    try {
      // Matches only if the stored step is older; otherwise the upsert collides
      // with the existing _id and the duplicate-key error means "already used".
      await this.db
        .collection<StateDoc>(COLLECTIONS.state)
        .updateOne({ _id: TOTP_STATE_ID, lastStep: { $lt: step } }, { $set: { lastStep: step } }, { upsert: true });
      return true;
    } catch (err) {
      if (isDuplicateKeyError(err)) return false;
      throw err;
    }
  }
}
