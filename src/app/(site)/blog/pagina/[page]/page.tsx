import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPostService } from "@/lib/server/container";
import { BlogIndex } from "../../_components/BlogIndex";
import { BLOG_PATH, pagePath } from "../../_components/blogMeta";

export const revalidate = 3600;

type Params = { page: string };

const PAGE_NUMBER = /^[1-9]\d{0,3}$/;

/** Rendered on first request, then cached (ISR). */
export function generateStaticParams(): Params[] {
  return [];
}

function parsePage(raw: string): number {
  if (!PAGE_NUMBER.test(raw)) notFound();
  return Number(raw);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const page = parsePage((await params).page);
  return {
    title: `Blog de Bronceado — Página ${page}`,
    description: `Más guías de bronceado de Solaris Bronceado: preparación de la piel, técnicas, duración del color y cuidados posteriores. Página ${page} del blog.`,
    alternates: { canonical: pagePath(page) },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPaginatedPage({ params }: { params: Promise<Params> }) {
  const page = parsePage((await params).page);
  if (page === 1) permanentRedirect(BLOG_PATH);
  const listing = await (await getPostService()).listPublished(page);
  if (page > listing.totalPages) notFound();
  return <BlogIndex listing={listing} />;
}
