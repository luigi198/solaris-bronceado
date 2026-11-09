import type { Metadata } from "next";
import { requireAdmin } from "@/lib/http/adminAuth";
import { PostEditor } from "../_components/PostEditor";
import { EMPTY_EDITOR_VALUES } from "../types";

export const metadata: Metadata = {
  title: "Nuevo artículo",
  description: "Crear un nuevo artículo para el blog de Solaris Bronceado desde Markdown.",
};

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Nuevo artículo</h1>
      <PostEditor initial={EMPTY_EDITOR_VALUES} initialStatus={null} />
    </>
  );
}
