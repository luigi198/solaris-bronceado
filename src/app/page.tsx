import Hero from "@/components/Hero";
import Services from "@/components/Services";
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
        text: "El bronceado brasileño dura entre 7 y 14 días dependiendo del tipo de piel y el cuidado posterior. Con hidratación diaria puedes extender la duración hasta 2 semanas.",
      },
    },
    {
      "@type": "Question",
      name: "¿El bronceado sin sol es seguro para la piel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Nuestros productos están certificados y libres de ingredientes dañinos. El bronceado brasileño usa DHA, una molécula derivada de la caña de azúcar que tiñe solo las capas superficiales de la piel sin afectar las capas profundas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuándo veré los resultados del bronceado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El bronceado brasileño comienza a desarrollarse en 4 a 8 horas y alcanza su tono completo en 24 horas. Las sesiones en cama de bronceado muestran resultados más gradualmente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Necesito preparación previa antes del bronceado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recomendamos llegar con la piel limpia, sin maquillaje ni humectante. Idealmente, exfolíate 24 horas antes para maximizar los resultados y la duración. Ofrecemos este servicio preparatorio en nuestro salón.",
      },
    },
    {
      "@type": "Question",
      name: "¿El bronceado funciona para todo tipo de piel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Contamos con fórmulas especializadas para pieles claras, medias y oscuras. En tu primera visita evaluamos tu tono de piel para seleccionar la fórmula que mejor se adapte a ti.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué debo evitar después del bronceado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las primeras 8 horas evita el agua, el sudor y la ropa muy ajustada. Después mantén la piel hidratada y evita exfoliantes para prolongar el resultado lo máximo posible.",
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
