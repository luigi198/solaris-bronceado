const BENEFITS = [
  {
    title: "Técnica brasileña certificada",
    description:
      "Usamos la técnica original brasileña con productos premium importados y probados clínicamente.",
  },
  {
    title: "Sin sol ni rayos UV",
    description:
      "Cuida tu piel. Nuestro proceso de bronceado es 100% libre de radiación ultravioleta y sin exposición solar.",
  },
  {
    title: "Resultados desde la primera sesión",
    description:
      "Sal del salón con un tono dorado natural y uniforme. Sin manchas, sin zonas oscuras, sin rayones.",
  },
  {
    title: "Para todo tipo de piel",
    description:
      "Fórmulas especializadas para pieles claras, medias y oscuras. Evaluamos tu tono antes de aplicar.",
  },
  {
    title: "Personal certificado",
    description:
      "Nuestro equipo está capacitado y certificado en técnicas de bronceado profesional. Estás en las mejores manos.",
  },
  {
    title: "Productos premium y seguros",
    description:
      "Usamos productos hidratantes libres de parabenos y químicos dañinos, con certificación internacional.",
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
            No somos un salón más. Somos especialistas en bronceado con la
            mejor técnica, los mejores productos y el mejor resultado.
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
