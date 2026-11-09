import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solarisbronceado.com"),
  title: {
    default: "Solaris Bronceado | Salón de Bronceado Profesional en Costa Rica",
    template: "%s | Solaris Bronceado",
  },
  description:
    "Especialistas en bronceado profesional en Costa Rica. Bronceado brasileño, camas UV y tratamientos corporales. Resultados dorados y naturales desde la primera sesión, sin sol ni rayos UV.",
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
  openGraph: {
    type: "website",
    locale: "es_CR",
    siteName: "Solaris Bronceado",
    title: "Solaris Bronceado | Salón de Bronceado Profesional en Costa Rica",
    description:
      "Bronceado profesional en Costa Rica. Técnica brasileña, tono dorado natural desde la primera sesión.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solaris Bronceado | Costa Rica",
    description:
      "Bronceado profesional brasileño y tratamientos corporales en Costa Rica.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://solarisbronceado.com" },
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
