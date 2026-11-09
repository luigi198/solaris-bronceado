import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotFoundError } from "@/lib/errors";
import { requireAdmin } from "@/lib/http/adminAuth";
import { getPostService } from "@/lib/server/container";
import { PostEditor } from "../_components/PostEditor";
import type { EditorValues } from "../types";

export const metadata: Metadata = {
  title: "Editar artículo",
  description: "Editar, publicar o despublicar un artículo del blog de Solaris Bronceado.",
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await (await getPostService()).getById(id).catch((err: unknown) => {
    if (err instanceof NotFoundError) notFound();
    throw err;
  });

  const initial: EditorValues = {
    title: post.title,
    slug: post.slug,
    description: post.description,
    seoTitle: post.seoTitle ?? "",
    contentMarkdown: post.contentMarkdown,
    coverUrl: post.coverImage?.url ?? "",
    coverAlt: post.coverImage?.alt ?? "",
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Editar artículo</h1>
      {/* key: remount with fresh state for another post or after (un)publishing */}
      <PostEditor key={`${post.id}-${post.status}`} postId={post.id} initial={initial} initialStatus={post.status} />
    </>
  );
}
