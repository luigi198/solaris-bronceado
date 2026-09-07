import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const SITE_URL = "https://solarisbronceado.com";
const BLOG_BASE = `${SITE_URL}/blog`;

// Soro blog embed (trysoro.com). The <script> below renders the article
// list/content on the client into #soro-blog; posts are authored in the Soro
// dashboard. Two consequences this route works around:
//   1. If the widget uses path-based routing (/blog/<slug>), those URLs must
//      not 404 — hence this optional catch-all `[[...slug]]`, which serves the
//      same embed shell for /blog and any /blog/* path.
//   2. Article content/metadata isn't available server-side. We emit a
//      self-referential canonical + a slug-derived <title> per path so articles
//      aren't collapsed into /blog as duplicates; the widget is expected to set
//      the real document.title/meta once it renders.
// If Soro ever offers server-rendered / subdirectory publishing on this plan,
// replace this embed with that integration for real per-article SEO.
const SORO_ORIGIN = "https://app.trysoro.com";
const SORO_EMBED_SRC = `${SORO_ORIGIN}/api/embed/c4b9e6dd-d064-49d6-b505-43e85beac0ce`;

const INDEX_DESCRIPTION =
  "Consejos de expertos sobre bronceado brasileño, camas UV y spray tan: cómo preparar la piel, cuánto dura el color y cómo cuidarlo para un tono dorado natural.";
const ARTICLE_DESCRIPTION =
  "Guía de bronceado de Solaris Bronceado, especialistas en Costa Rica: cómo preparar la piel, lograr un tono dorado natural y cuidarlo para que dure más tiempo.";

const INDEX_TITLE = "Guías y consejos de bronceado";

type Params = { slug?: string[] };

/** Render /blog statically; deeper /blog/* paths are server-rendered on demand. */
export function generateStaticParams(): Params[] {
  return [{ slug: [] }];
}

/** "como-preparar-la-piel" -> "Como preparar la piel". Best-effort title for a
 *  path whose real article title only exists inside the client widget. */
function deslugify(segments: string[]): string {
  const last = segments.at(-1) ?? "";
  const words = last
    .replace(/\.(html?|php)$/i, "")
    .split(/[-_]+/)
    .filter(Boolean);
  if (words.length === 0) return "";
  const text = words.join(" ").slice(0, 70).trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const isArticle = Array.isArray(slug) && slug.length > 0;
  const canonical = isArticle ? `${BLOG_BASE}/${slug.join("/")}` : BLOG_BASE;
  const heading = isArticle ? deslugify(slug) || "Artículo del blog" : INDEX_TITLE;
  const description = isArticle ? ARTICLE_DESCRIPTION : INDEX_DESCRIPTION;

  return {
    title: isArticle ? heading : "Blog de Bronceado: Guías, Cuidados y Consejos",
    description,
    alternates: { canonical },
    openGraph: {
      type: isArticle ? "article" : "website",
      locale: "es_CR",
      siteName: "Solaris Bronceado",
      url: canonical,
      title: `${heading} | Solaris Bronceado`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${heading} | Solaris Bronceado`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog de Solaris Bronceado",
  description: INDEX_DESCRIPTION,
  url: BLOG_BASE,
  inLanguage: "es-CR",
  publisher: {
    "@type": "BeautySalon",
    name: "Solaris Bronceado",
    url: SITE_URL,
  },
};

// Topics we cover — gives the shell real, crawlable content and internal links
// even before the widget hydrates (or if it fails / JS is disabled).
const TOPICS = [
  { href: "/#servicios", label: "Técnicas de bronceado: brasileño, cámara UV y spray" },
  { href: "/#proceso", label: "Cómo preparar la piel antes de tu sesión" },
  { href: "/#faq", label: "Cuánto dura el bronceado y cómo mantenerlo" },
  { href: "/#contacto", label: "Cuidados post-bronceado e hidratación" },
] as const;

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const isArticle = Array.isArray(slug) && slug.length > 0;
  const heading = isArticle ? deslugify(slug) || "Artículo del blog" : INDEX_TITLE;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_BASE },
      ...(isArticle
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: heading,
              item: `${BLOG_BASE}/${slug.join("/")}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      {/* Speed up the third-party widget fetch so its content is present for
          Googlebot's render pass and for Core Web Vitals. */}
      <link rel="preconnect" href={SORO_ORIGIN} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={SORO_ORIGIN} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main>
        <section
          className="pt-28 md:pt-36 pb-10 md:pb-14 bg-brand-cream"
          aria-labelledby="blog-heading"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Ruta de navegación" className="mb-6">
              <ol
                className="flex flex-wrap items-center gap-2 list-none p-0 m-0 text-sm text-slate-500"
                role="list"
              >
                <li>
                  <Link
                    href="/"
                    className="hover:text-brand-orange transition-colors duration-200"
                  >
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                {isArticle ? (
                  <>
                    <li>
                      <Link
                        href="/blog"
                        className="hover:text-brand-orange transition-colors duration-200"
                      >
                        Blog
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-brand-navy font-medium">
                      {heading}
                    </li>
                  </>
                ) : (
                  <li aria-current="page" className="text-brand-navy font-medium">
                    Blog
                  </li>
                )}
              </ol>
            </nav>

            <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
              Blog
            </p>
            <h1
              id="blog-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-4"
            >
              {heading}
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Todo lo que necesitas saber para preparar tu piel, elegir la técnica
              adecuada y mantener tu bronceado dorado por más tiempo. Escrito por
              el equipo de especialistas de Solaris Bronceado en Costa Rica.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16" aria-labelledby="blog-articles-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="blog-articles-heading" className="sr-only">
              Artículos del blog
            </h2>

            {/* Soro injects the article list/content here on the client. */}
            <div id="soro-blog" className="min-h-[60vh]" />
            <Script
              id="soro-embed"
              src={SORO_EMBED_SRC}
              strategy="afterInteractive"
            />

            <noscript>
              <p className="text-slate-600">
                Necesitas activar JavaScript para leer los artículos del blog.
                Mientras tanto, estos son los temas que cubrimos:
              </p>
            </noscript>

            <aside
              className="mt-12 border-t border-gray-100 pt-8"
              aria-labelledby="blog-topics-heading"
            >
              <h2
                id="blog-topics-heading"
                className="text-sm font-bold uppercase tracking-widest text-brand-navy mb-4"
              >
                Temas que cubrimos
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0" role="list">
                {TOPICS.map((topic) => (
                  <li key={topic.href}>
                    <Link
                      href={topic.href}
                      className="text-slate-600 hover:text-brand-orange transition-colors duration-200"
                    >
                      {topic.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
