import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/contracts/blog";
import { formatDate, postPath } from "./blogMeta";

const CARD_IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/** `headingLevel` keeps the outline valid wherever the card list is placed. */
export function PostCard({ post, headingLevel = "h2" }: { post: PostSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-brand-orange">
      {post.coverImage && (
        <div className="relative aspect-[16/9] bg-brand-cream">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            fill
            sizes={CARD_IMAGE_SIZES}
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            {formatDate(post.publishedAt)}
          </time>
        )}
        <Heading className="mt-2 text-lg font-bold text-brand-navy">
          {/* Stretched link: the whole card is clickable, but it is still one real <a>. */}
          <Link href={postPath(post.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
      </div>
    </article>
  );
}
