import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PostBody } from "@/components/blog/PostBody";
import { readingTimeMinutes } from "@/lib/blog/rules";
import { isValidSlug } from "@/lib/blog/slug";
import type { Post } from "@/lib/contracts/blog";
import { getPostService } from "@/lib/server/container";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { BLOG_PATH, breadcrumbJsonLd, formatDate, postJsonLd, postPath, type Crumb } from "../_components/blogMeta";
import { PostCard } from "../_components/PostCard";

export const revalidate = 3600;

type Params = { slug: string };

const RELATED_COUNT = 3;
const COVER_SIZES = "(max-width: 896px) 100vw, 896px";

/** Prerender every published post at build; new ones render on first request (ISR). */
export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await (await getPostService()).listPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

/** Deduped between generateMetadata and the page within one render. */
const loadPost = cache(async (slug: string): Promise<Post> => {
  if (!isValidSlug(slug)) notFound();
  const result = await (await getPostService()).findPublished(slug);
  if (result.kind === "redirect") permanentRedirect(postPath(result.slug));
  if (result.kind === "missing") notFound();
  return result.post;
});

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  const title = post.seoTitle ?? post.title;
  const images = post.coverImage
    ? [{ url: post.coverImage.url, width: post.coverImage.width, height: post.coverImage.height, alt: post.coverImage.alt }]
    : undefined;
  return {
    title,
    description: post.description,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      type: "article",
      locale: "es_CR",
      siteName: "Solaris Bronceado",
      url: postPath(post.slug),
      title,
      description: post.description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images,
    },
    twitter: { card: "summary_large_image", title, description: post.description, images: images?.map((i) => i.url) },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const post = await loadPost((await params).slug);
  const { posts: latest } = await (await getPostService()).listPublished(1);
  const related = latest.filter((p) => p.id !== post.id).slice(0, RELATED_COUNT);
  const minutes = readingTimeMinutes(post.contentMarkdown);
  const wordCount = post.contentMarkdown.split(/\s+/).filter(Boolean).length;
  const crumbs: Crumb[] = [
    { name: "Inicio", path: "/" },
    { name: "Blog", path: BLOG_PATH },
    { name: post.title, path: postPath(post.slug) },
  ];
  const wasUpdated = post.publishedAt && post.updatedAt.toDateString() !== post.publishedAt.toDateString();

  return (
    <>
      <JsonLd data={postJsonLd(post, wordCount)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <main>
        <article>
          <header className="pt-28 md:pt-36 pb-8 md:pb-10 bg-brand-cream">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Breadcrumbs crumbs={crumbs} />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-slate-600">{post.description}</p>
              <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                {post.publishedAt && (
                  <span>
                    Publicado el <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
                  </span>
                )}
                {wasUpdated && (
                  <span>
                    Actualizado el <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
                  </span>
                )}
                <span>{minutes} min de lectura</span>
              </p>
            </div>
          </header>

          {post.coverImage && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mb-2 mt-8">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                width={post.coverImage.width}
                height={post.coverImage.height}
                sizes={COVER_SIZES}
                priority
                className="w-full h-auto rounded-2xl shadow-sm"
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <PostBody markdown={post.contentMarkdown} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="pb-16 md:pb-20" aria-labelledby="related-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="related-heading" className="text-2xl font-bold text-brand-navy mb-6">
                Sigue leyendo
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0" role="list">
                {related.map((p) => (
                  <li key={p.id} className="flex">
                    <PostCard post={p} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
