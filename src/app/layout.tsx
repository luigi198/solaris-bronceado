import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { PHONE_INTL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Solaris Bronceado",
  description:
    "Salón de bronceado profesional en Costa Rica. Especialistas en bronceado brasileño, camas UV y tratamientos corporales.",
  url: "https://solarisbronceado.com",
  telephone: PHONE_INTL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "CR",
    addressRegion: "San José",
    addressLocality: "San José",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <WhatsAppFloat />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-01W27QZDQL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-01W27QZDQL');
          `}
        </Script>
      </body>
    </html>
  );
}
