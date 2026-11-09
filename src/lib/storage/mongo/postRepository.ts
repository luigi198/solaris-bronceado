import { ObjectId, type Db, type Filter, type WithId } from "mongodb";
import type {
  NewPost,
  Post,
  PostRepository,
  PostSummary,
  PublishedPage,
} from "@/lib/contracts/blog";
import { ConflictError } from "@/lib/errors";
import { COLLECTIONS, isDuplicateKeyError } from "./collections";

type PostDoc = NewPost;

const SUMMARY_PROJECTION = {
  slug: 1,
  title: 1,
  description: 1,
  coverImage: 1,
  status: 1,
  publishedAt: 1,
  updatedAt: 1,
} as const;

const PUBLISHED: Filter<PostDoc> = { status: "published" };

function toPost({ _id, ...rest }: WithId<PostDoc>): Post {
  return { id: _id.toHexString(), ...rest };
}

function toSummary(doc: WithId<Pick<PostDoc, keyof typeof SUMMARY_PROJECTION>>): PostSummary {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    coverImage: doc.coverImage,
    status: doc.status,
    publishedAt: doc.publishedAt,
    updatedAt: doc.updatedAt,
  };
}

/** Ids come from URLs; an invalid one simply matches nothing. */
function parseId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && id.length === 24 ? new ObjectId(id) : null;
}

function slugConflict(): ConflictError {
  return new ConflictError("Slug already in use", "slug");
}

export class MongoPostRepository implements PostRepository {
  constructor(private readonly db: Db) {}

  private get posts() {
    return this.db.collection<PostDoc>(COLLECTIONS.posts);
  }

  async insert(post: NewPost): Promise<Post> {
    try {
      const { insertedId } = await this.posts.insertOne({ ...post });
      return { id: insertedId.toHexString(), ...post };
    } catch (err) {
      if (isDuplicateKeyError(err)) throw slugConflict();
      throw err;
    }
  }

  async update(id: string, changes: Partial<NewPost>): Promise<Post | null> {
    const _id = parseId(id);
    if (!_id) return null;
    try {
      const doc = await this.posts.findOneAndUpdate({ _id }, { $set: changes }, { returnDocument: "after" });
      return doc ? toPost(doc) : null;
    } catch (err) {
      if (isDuplicateKeyError(err)) throw slugConflict();
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    const _id = parseId(id);
    if (!_id) return false;
    const { deletedCount } = await this.posts.deleteOne({ _id });
    return deletedCount === 1;
  }

  async findById(id: string): Promise<Post | null> {
    const _id = parseId(id);
    if (!_id) return null;
    const doc = await this.posts.findOne({ _id });
    return doc ? toPost(doc) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const doc = await this.posts.findOne({ slug });
    return doc ? toPost(doc) : null;
  }

  async findByPreviousSlug(slug: string): Promise<Post | null> {
    const doc = await this.posts.findOne({ previousSlugs: slug });
    return doc ? toPost(doc) : null;
  }

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const filter: Filter<PostDoc> = { $or: [{ slug }, { previousSlugs: slug }] };
    const excluded = excludeId ? parseId(excludeId) : null;
    if (excluded) filter._id = { $ne: excluded };
    return (await this.posts.countDocuments(filter, { limit: 1 })) > 0;
  }

  async listAll(): Promise<PostSummary[]> {
    const docs = await this.posts.find({}, { projection: SUMMARY_PROJECTION }).sort({ updatedAt: -1 }).toArray();
    return docs.map(toSummary);
  }

  async listPublished(offset: number, limit: number): Promise<PublishedPage> {
    const [docs, total] = await Promise.all([
      this.posts
        .find(PUBLISHED, { projection: SUMMARY_PROJECTION })
        .sort({ publishedAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      this.posts.countDocuments(PUBLISHED),
    ]);
    return { posts: docs.map(toSummary), total };
  }

  async listRecentPublished(limit: number): Promise<PostSummary[]> {
    const docs = await this.posts
      .find(PUBLISHED, { projection: SUMMARY_PROJECTION })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map(toSummary);
  }

  async listPublishedSlugs(): Promise<Array<Pick<Post, "slug" | "updatedAt">>> {
    return this.posts
      .find(PUBLISHED, { projection: { _id: 0, slug: 1, updatedAt: 1 } })
      .sort({ publishedAt: -1 })
      .toArray();
  }
}
