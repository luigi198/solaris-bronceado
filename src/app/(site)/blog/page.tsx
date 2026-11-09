import type { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH, DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import { getPostService } from "@/lib/server/container";
import { BlogIndex } from "./_components/BlogIndex";
import { BLOG_DESCRIPTION, BLOG_PATH, BLOG_TITLE } from "./_components/blogMeta";

// ISR fallback window (seconds); saving a post in /admin revalidates immediately.
// Must be a literal for Next's static analysis.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog de Bronceado: Guías, Cuidados y Consejos",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: BLOG_PATH },
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    url: BLOG_PATH,
    title: `${BLOG_TITLE} | Solaris Bronceado`,
    description: BLOG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BLOG_TITLE} | Solaris Bronceado`,
    description: BLOG_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  const listing = await (await getPostService()).listPublished(1);
  return <BlogIndex listing={listing} />;
}
