import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/http/adminAuth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Acceso privado al panel de administración del blog de Solaris Bronceado.",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-1">Panel del blog</h1>
        <p className="text-sm text-slate-600 mb-6">Solaris Bronceado</p>
        <LoginForm />
      </div>
    </main>
  );
}
