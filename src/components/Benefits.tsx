const BENEFITS = [
  {
    title: "Técnica brasileña certificada",
    description:
      "Utilizamos pigmentos naturales y potenciadores de bronceado de alta calidad para lograr resultados intensos y uniformes.",
  },
  {
    title: "Tecnología híbrida avanzada",
    description:
      "Combinamos luz UV, activadores de melanina y pigmentos naturales para lograr un bronceado intenso, uniforme y duradero.",
  },
  {
    title: "Resultados desde la primera sesión",
    description:
      "Obtén un tono más intenso y uniforme desde las primeras sesiones gracias a nuestra técnica híbrida y pigmentos naturales.",
  },
  {
    title: "Para todo tipo de piel",
    description:
      "Realizamos un diagnóstico de fototipo cutáneo para personalizar cada sesión según tu tono y tipo de piel.",
  },
  {
    title: "Asesoría profesional especializada",
    description:
      "Nuestro equipo te guía en cada etapa para lograr un bronceado seguro, uniforme y adaptado a tu piel.",
  },
  {
    title: "Productos premium y seguros",
    description:
      "Trabajamos con pigmentos naturales, aceleradores y productos de alta calidad para cuidar y realzar tu piel.",
  },
] as const;

export default function Benefits() {
  return (
    <section
      id="nosotros"
      className="py-20 md:py-28 bg-brand-cream"
      aria-labelledby="nosotros-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
            ¿Por qué Solaris?
          </p>
          <h2
            id="nosotros-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-5"
          >
            La diferencia que sientes desde la primera visita
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Somos especialistas en bronceado desde 1999, con la mejor técnica,
            los mejores productos y el mejor resultado.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0"
          role="list"
        >
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex gap-4">
              <div className="shrink-0 mt-1 flex items-center justify-center w-8 h-8 bg-brand-orange rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-navy mb-1">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
