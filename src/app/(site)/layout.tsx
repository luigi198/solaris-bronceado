import Script from "next/script";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileBookingBar from "@/components/MobileBookingBar";
import { PHONE_INTL } from "@/lib/constants";

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

/** Public marketing site chrome + GA4. Kept out of /admin on purpose. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      {children}
      <MobileBookingBar />
      <WhatsAppFloat />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-01W27QZDQL" strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-01W27QZDQL');
        `}
      </Script>
    </>
  );
}
