import type { MetadataRoute } from "next";
import { getPostService } from "@/lib/server/container";
import { SITE_URL } from "@/lib/constants";
import { BLOG_URL, postPath } from "./_components/blogMeta";

// Served at /blog/sitemap.xml and listed in robots.txt by next-sitemap
// (see next-sitemap.config.js). Posts are dynamic, so next-sitemap's
// build-time scan cannot see them; this one is regenerated on publish.
export const revalidate = 3600;

const BLOG_PRIORITY = 0.7;
const POST_PRIORITY = 0.6;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await (await getPostService()).listPublishedSlugs();
  return [
    { url: BLOG_URL, changeFrequency: "weekly", priority: BLOG_PRIORITY, lastModified: posts[0]?.updatedAt },
    ...posts.map((p) => ({
      url: `${SITE_URL}${postPath(p.slug)}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: POST_PRIORITY,
    })),
  ];
}
