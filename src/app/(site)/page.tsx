import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PreCare from "@/components/PreCare";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto dura el bronceado brasileño?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El bronceado brasileño puede durar de 6 a 8 semanas. Utilizamos activadores de melanina, pigmentos naturales y tecnología híbrida para lograr un resultado intenso y duradero, incluso si visitas piscinas o la playa.",
      },
    },
    {
      "@type": "Question",
      name: "¿El bronceado es seguro para la piel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. En Solaris realizamos un diagnóstico de fototipo cutáneo para personalizar cada sesión según tu tipo de piel. Además, trabajamos con equipos certificados, protocolos de higiene rigurosos y productos de alta calidad para lograr un bronceado seguro y uniforme.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuándo veré los resultados del bronceado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los resultados del bronceado brasileño son visibles desde las primeras sesiones. En el bronceado en cámara UV, el tono aparece de forma gradual y con 10 sesiones ya es notorio el cambio en la tonalidad de la piel. Con el bronceado spray los resultados serán inmediatos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito preparación previa antes de mi sesión?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Recomendamos venir con la piel limpia, exfoliada, depilada y sin cremas ni perfumes. También es ideal usar ropa holgada, preferiblemente oscura, y sandalias para mayor comodidad después de la sesión.",
      },
    },
    {
      "@type": "Question",
      name: "¿El bronceado funciona igual para todo tipo de piel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. En Solaris realizamos un diagnóstico de fototipo cutáneo para personalizar cada sesión según tu tipo y tono de piel, logrando un resultado uniforme, seguro y natural.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué debo evitar después del bronceado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para mantener tu bronceado por más tiempo, recomendamos mantener la piel hidratada y seguir las indicaciones de nuestros especialistas según la técnica utilizada. En el caso del bronceado en cámara UV, el mantenimiento puede realizarse con sesiones periódicas o exposición solar moderada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo broncearme si estoy embarazada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El bronceado instantáneo a base de caña de azúcar es una opción segura y apta para embarazadas. Sin embargo, siempre recomendamos consultar con tu médico antes de cualquier tratamiento estético durante el embarazo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Con qué frecuencia puedo ir al salón?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para el bronceado en cámara UV recomendamos 3 sesiones por semana hasta alcanzar el tono deseado. Luego, una sesión semanal o exposición solar moderada ayuda a mantener el resultado. En el caso del bronceado brasileño, la duración puede ser de 6 a 8 semanas dependiendo del cuidado y mantenimiento de la piel.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main>
        <Hero />
        <Services />
        <PreCare />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
