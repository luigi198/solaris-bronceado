const FAQS = [
  {
    question: "¿Cuánto dura el bronceado brasileño?",
    answer:
      "El bronceado brasileño dura entre 7 y 14 días dependiendo de tu tipo de piel y el cuidado posterior. Con hidratación diaria y evitando exfoliantes agresivos puedes extender la duración hasta 2 semanas.",
  },
  {
    question: "¿El bronceado sin sol es seguro para la piel?",
    answer:
      "Sí, completamente. Nuestros productos están certificados y libres de ingredientes dañinos. El bronceado brasileño utiliza DHA (dihidroxiacetona), una molécula naturalmente derivada de la caña de azúcar que reacciona solo con las capas superficiales de la piel sin afectar las capas más profundas.",
  },
  {
    question: "¿Cuándo veré los resultados del bronceado?",
    answer:
      "El bronceado brasileño comienza a desarrollarse entre 4 y 8 horas después de la aplicación, alcanzando su tono completo en 24 horas. Las sesiones en cama de bronceado muestran resultados de forma más gradual, generalmente visibles tras 2 o 3 sesiones.",
  },
  {
    question: "¿Necesito preparación previa antes de mi sesión?",
    answer:
      "Recomendamos llegar con la piel limpia, sin maquillaje, perfume ni humectante. Idealmente, exfolíate 24 horas antes para maximizar los resultados y la duración. Si no tienes tiempo, ofrecemos el servicio de exfoliación preparatoria en nuestro salón.",
  },
  {
    question: "¿El bronceado funciona igual para todo tipo de piel?",
    answer:
      "Sí. Contamos con fórmulas adaptadas para pieles claras, medias y oscuras. En tu primera visita evaluamos tu tono de piel y seleccionamos la fórmula ideal para que el resultado sea el más natural y duradero posible.",
  },
  {
    question: "¿Qué debo evitar después del bronceado?",
    answer:
      "Las primeras 8 horas después de la aplicación evita el agua, el sudor y la ropa muy ajustada o de colores oscuros. Luego del primer contacto con el agua, mantén la piel hidratada diariamente y evita exfoliantes y productos con aceites minerales para prolongar el resultado.",
  },
  {
    question: "¿Puedo broncearme si estoy embarazada?",
    answer:
      "Los ingredientes del bronceado brasileño son seguros externamente, pero siempre recomendamos consultar con tu médico antes de cualquier tratamiento cosmético durante el embarazo. Tu seguridad y la de tu bebé son lo primero.",
  },
  {
    question: "¿Con qué frecuencia puedo ir al salón?",
    answer:
      "Para el bronceado brasileño puedes repetirlo cada vez que se desvanezca, usualmente cada 1 o 2 semanas. Para las camas de bronceado recomendamos un máximo de 3 sesiones por semana. Ofrecemos planes de mantenimiento personalizados para clientes frecuentes.",
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
