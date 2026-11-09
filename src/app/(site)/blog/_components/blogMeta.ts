import type { Post } from "@/lib/contracts/blog";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const BLOG_PATH = "/blog";
export const BLOG_URL = `${SITE_URL}${BLOG_PATH}`;
export const BLOG_TITLE = "Guías y consejos de bronceado";
export const BLOG_DESCRIPTION =
  "Consejos de expertos sobre bronceado brasileño, camas UV y spray tan: cómo preparar la piel, cuánto dura el color y cómo cuidarlo para un tono dorado natural.";

export const postPath = (slug: string) => `${BLOG_PATH}/${slug}`;
export const pagePath = (page: number) => (page <= 1 ? BLOG_PATH : `${BLOG_PATH}/pagina/${page}`);

const DATE_FORMAT = new Intl.DateTimeFormat("es-CR", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (date: Date) => DATE_FORMAT.format(date);

const publisher = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export function blogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog de ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: BLOG_URL,
    inLanguage: "es-CR",
    publisher,
  };
}

export function postJsonLd(post: Post, wordCount: number) {
  const url = `${SITE_URL}${postPath(post.slug)}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: post.coverImage ? [post.coverImage.url] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "es-CR",
    wordCount,
    author: publisher,
    publisher,
    isPartOf: { "@type": "Blog", "@id": BLOG_URL },
  };
}
