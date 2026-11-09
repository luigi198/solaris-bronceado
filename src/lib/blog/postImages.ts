import type { Post } from "@/lib/contracts/blog";
import { extractOwnImageUrls } from "@/lib/images/imageUrl";

type ImageBearing = Pick<Post, "coverImage" | "contentMarkdown">;

/** Our uploads used by a post: its cover plus any image URL in the body. */
export function postImageUrls(post: ImageBearing, imageBaseUrl: string | null): string[] {
  const urls = new Set(extractOwnImageUrls(post.contentMarkdown, imageBaseUrl));
  if (post.coverImage && extractOwnImageUrls(post.coverImage.url, imageBaseUrl).length > 0) urls.add(post.coverImage.url);
  return [...urls];
}

/** Candidates not used by any of `others`. O(total text + candidates) via a Set. */
export function unreferencedImages(
  candidates: readonly string[],
  others: readonly ImageBearing[],
  imageBaseUrl: string | null,
): string[] {
  const stillUsed = new Set(others.flatMap((p) => postImageUrls(p, imageBaseUrl)));
  return candidates.filter((url) => !stillUsed.has(url));
}
