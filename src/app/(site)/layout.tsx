import Script from "next/script";
import { JsonLd } from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileBookingBar from "@/components/MobileBookingBar";
import { ADDRESS_VENUE, PHONE_INTL, SITE_NAME, SITE_URL, SOCIAL } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${SITE_URL}/#salon`,
  name: SITE_NAME,
  description:
    "Salón de bronceado profesional en Costa Rica. Especialistas en bronceado brasileño, camas UV y tratamientos corporales.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: [`${SITE_URL}/image1.jpeg`, `${SITE_URL}/image2.jpeg`],
  sameAs: Object.values(SOCIAL),
  telephone: PHONE_INTL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS_VENUE.replace(" · ", ", "),
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
      <JsonLd data={jsonLd} />
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
