import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import type { PublishedListing } from "@/lib/blog/postService";
import { BLOG_PATH, BLOG_TITLE, blogJsonLd, breadcrumbJsonLd, pagePath, type Crumb } from "./blogMeta";
import { Breadcrumbs } from "./Breadcrumbs";
import { PostCard } from "./PostCard";

const PAGER_LINK =
  "inline-flex min-h-11 items-center rounded-full border border-brand-navy/20 px-5 font-semibold text-brand-navy hover:border-brand-orange hover:text-brand-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange";

/** Listing shared by /blog (page 1) and /blog/pagina/[page]. */
export function BlogIndex({ listing }: { listing: PublishedListing }) {
  const { posts, page, totalPages } = listing;
  const crumbs: Crumb[] = [
    { name: "Inicio", path: "/" },
    { name: "Blog", path: BLOG_PATH },
    ...(page > 1 ? [{ name: `Página ${page}`, path: pagePath(page) }] : []),
  ];

  return (
    <>
      <JsonLd data={blogJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <main>
        <section className="pt-28 md:pt-36 pb-10 md:pb-14 bg-brand-cream" aria-labelledby="blog-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs crumbs={crumbs} />
            <p className="text-brand-orange-dark font-semibold uppercase tracking-widest text-sm mb-3">Blog</p>
            <h1 id="blog-heading" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-4">
              {page > 1 ? `${BLOG_TITLE} — página ${page}` : BLOG_TITLE}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Todo lo que necesitas saber para preparar tu piel, elegir la técnica adecuada y mantener tu
              bronceado dorado por más tiempo. Escrito por el equipo de especialistas de Solaris Bronceado en
              Costa Rica.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16" aria-label="Artículos del blog">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <p className="text-slate-600 text-center py-16">Pronto publicaremos nuestros primeros artículos.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0" role="list">
                {posts.map((post) => (
                  <li key={post.id} className="flex">
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav aria-label="Paginación" className="mt-12 flex items-center justify-between gap-4">
                {page > 1 ? (
                  <Link href={pagePath(page - 1)} rel="prev" className={PAGER_LINK}>
                    ← Anteriores
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-sm text-slate-600">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={pagePath(page + 1)} rel="next" className={PAGER_LINK}>
                    Siguientes →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
