import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import { DEFAULT_OPEN_GRAPH, DEFAULT_SHARE_IMAGE } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Solaris Bronceado | Salón de Bronceado Profesional en Costa Rica",
    template: "%s | Solaris Bronceado",
  },
  description:
    "Salón de bronceado profesional en Costa Rica: bronceado brasileño, cámara de bronceado y spray tan. Tono dorado y natural desde la primera sesión.",
  keywords: [
    "bronceado Costa Rica",
    "bronceado brasileño Costa Rica",
    "salón de bronceado",
    "bronceado sin sol Costa Rica",
    "bronceado artificial Costa Rica",
    "Solaris bronceado",
    "tanning Costa Rica",
    "spray tan Costa Rica",
  ],
  openGraph: DEFAULT_OPEN_GRAPH,
  twitter: {
    card: "summary_large_image",
    title: "Solaris Bronceado | Costa Rica",
    description:
      "Bronceado profesional brasileño y tratamientos corporales en Costa Rica.",
    images: [DEFAULT_SHARE_IMAGE.url],
  },
  // No root canonical/robots: they would leak into 404s and /admin. Each
  // indexable page sets its own canonical; indexing is the default.
};

/** Shell shared by the public site `(site)` and the private `/admin` area. */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
