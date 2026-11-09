import Image from "next/image";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkSeoHeadings } from "@/lib/blog/remarkSeoHeadings";
import { parseOwnImageUrl } from "@/lib/images/imageUrl";
import { IMAGE_BASE_URL } from "@/lib/images/publicConfig";

const CONTENT_MAX_WIDTH_PX = 768;
const IMAGE_SIZES = `(max-width: ${CONTENT_MAX_WIDTH_PX}px) 100vw, ${CONTENT_MAX_WIDTH_PX}px`;

/** "//host/path" is protocol-relative, i.e. external, despite the leading slash. */
const isInternalHref = (href: string) => (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");

const components: Components = {
  a({ href = "", children }) {
    if (isInternalHref(href)) return <Link href={href}>{children}</Link>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    // Only our own uploads render: they carry their dimensions in the key, and
    // hot-linked third-party images would leak readers' IPs to other hosts.
    const url = typeof src === "string" ? src : "";
    const size = parseOwnImageUrl(url, IMAGE_BASE_URL);
    if (!size) return null;
    return (
      <Image src={url} alt={alt ?? ""} width={size.width} height={size.height} sizes={IMAGE_SIZES} className="rounded-xl" />
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    );
  },
};

/**
 * Renders an article's Markdown to semantic HTML. Raw HTML in the source is
 * dropped (`skipHtml`) and react-markdown neutralizes `javascript:` URLs, so
 * stored content cannot inject scripts. Works in Server and Client Components
 * (the editor preview reuses it).
 */
export function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-lg prose-slate max-w-none prose-headings:text-brand-navy prose-headings:scroll-mt-28 prose-a:text-brand-navy-light prose-a:underline-offset-2 hover:prose-a:text-brand-orange-dark prose-strong:text-brand-navy">
      <Markdown remarkPlugins={[remarkGfm, remarkSeoHeadings]} components={components} skipHtml>
        {markdown}
      </Markdown>
    </div>
  );
}
