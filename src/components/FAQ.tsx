const FAQS = [
  {
    question: "¿Cuánto dura el bronceado brasileño?",
    answer:
      "El bronceado brasileño puede durar de 6 a 8 semanas. Utilizamos activadores de melanina, pigmentos naturales y tecnología híbrida para lograr un resultado intenso y duradero, incluso si visitas piscinas o la playa.",
  },
  {
    question: "¿El bronceado es seguro para la piel?",
    answer:
      "Sí. En Solaris realizamos un diagnóstico de fototipo cutáneo para personalizar cada sesión según tu tipo de piel. Además, trabajamos con equipos certificados, protocolos de higiene rigurosos y productos de alta calidad para lograr un bronceado seguro y uniforme.",
  },
  {
    question: "¿Cuándo veré los resultados del bronceado?",
    answer:
      "Los resultados del bronceado brasileño son visibles desde las primeras sesiones. En el bronceado en cámara UV, el tono aparece de forma gradual y con 10 sesiones ya es notorio el cambio en la tonalidad de la piel.",
  },
  {
    question: "¿Necesito preparación previa antes de mi sesión?",
    answer:
      "Sí. Recomendamos venir con la piel limpia, exfoliada, depilada y sin cremas ni perfumes. También es ideal usar ropa holgada, preferiblemente oscura, y sandalias para mayor comodidad después de la sesión.",
  },
  {
    question: "¿El bronceado funciona igual para todo tipo de piel?",
    answer:
      "Sí. En Solaris realizamos un diagnóstico de fototipo cutáneo para personalizar cada sesión según tu tipo y tono de piel, logrando un resultado uniforme, seguro y natural.",
  },
  {
    question: "¿Qué debo evitar después del bronceado?",
    answer:
      "Para mantener tu bronceado por más tiempo, recomendamos mantener la piel hidratada y seguir las indicaciones de nuestros especialistas según la técnica utilizada. En el caso del bronceado en cámara UV, el mantenimiento puede realizarse con sesiones periódicas o exposición solar moderada.",
  },
  {
    question: "¿Puedo broncearme si estoy embarazada?",
    answer:
      "El bronceado instantáneo a base de caña de azúcar es una opción segura y apta para embarazadas. Sin embargo, siempre recomendamos consultar con tu médico antes de cualquier tratamiento estético durante el embarazo.",
  },
  {
    question: "¿Con qué frecuencia puedo ir al salón?",
    answer:
      "Para el bronceado en cámara UV recomendamos 3 sesiones por semana hasta alcanzar el tono deseado. Luego, una sesión semanal o exposición solar moderada ayuda a mantener el resultado. En el caso del bronceado brasileño, la duración puede ser de 6 a 8 semanas dependiendo del cuidado y mantenimiento de la piel.",
  },
] as const;

function ChevronIcon() {
  return (
    <svg
      className="shrink-0 text-brand-orange transition-transform duration-300 group-open:rotate-180"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-20 md:py-28 bg-brand-cream"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-5"
          >
            Todo lo que necesitas saber
          </h2>
          <p className="text-slate-600 text-lg">
            Resolvemos tus dudas para que llegues a tu sesión con total confianza.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group py-1">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer text-brand-navy font-semibold text-lg hover:text-brand-orange transition-colors duration-200">
                <span>{faq.question}</span>
                <ChevronIcon />
              </summary>
              <div className="pb-6 pr-10 text-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
