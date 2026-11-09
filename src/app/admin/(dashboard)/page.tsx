import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/http/adminAuth";
import { getPostService } from "@/lib/server/container";
import { ui } from "../_components/ui";

export const metadata: Metadata = {
  title: "Artículos",
  description: "Lista de artículos del blog de Solaris Bronceado: borradores y publicados.",
};

const DATE = new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await (await getPostService()).listForAdmin();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">Artículos</h1>
        <Link href="/admin/posts/new" className={ui.buttonPrimary}>
          Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className={`${ui.card} text-slate-600`}>Aún no hay artículos. Crea el primero.</p>
      ) : (
        <ul className="space-y-3 list-none p-0" role="list">
          {posts.map((post) => (
            <li key={post.id} className={`${ui.card} flex flex-wrap items-center justify-between gap-3`}>
              <div className="min-w-0">
                <Link href={`/admin/posts/${post.id}`} className={`${ui.link} font-semibold`}>
                  {post.title}
                </Link>
                <p className="text-xs text-slate-600 mt-1">
                  /blog/{post.slug} · editado {DATE.format(post.updatedAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  post.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
                }`}
              >
                {post.status === "published" ? "Publicado" : "Borrador"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
