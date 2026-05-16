import { WA_LINK } from "@/lib/constants";

const SERVICES = [
  {
    title: "Bronceado Brasileño",
    description:
      "La técnica más popular del mundo. Fórmula DHA que reacciona con la piel para un tono dorado, natural y uniforme. Sin sol ni rayos UV.",
    tag: "Más popular",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
        <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
        <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" />
        <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" />
      </svg>
    ),
  },
  {
    title: "Cama de Bronceado",
    description:
      "Sesiones express en camas de última generación. Resultados visibles en 15-20 minutos con cuidado y protección profesional.",
    tag: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 4v16M2 8h18a2 2 0 012 2v6H2" />
        <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    title: "Exfoliación Pre-Bronceado",
    description:
      "Tratamiento preparatorio esencial. Elimina células muertas para que el bronceado penetre de manera uniforme y dure mucho más.",
    tag: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      </svg>
    ),
  },
  {
    title: "Hidratación Post-Bronceado",
    description:
      "Sellamos y prolongamos tu resultado con tratamientos hidratantes premium. Tu bronceado puede durar hasta 2 semanas.",
    tag: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  },
  {
    title: "Paquete Solaris VIP",
    description:
      "La experiencia completa: exfoliación + bronceado brasileño + hidratación. Todo en una sola visita para el resultado perfecto.",
    tag: "Recomendado",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Mantenimiento & Retoques",
    description:
      "Planes de mantenimiento para quienes quieren bronceado todo el año. Sesiones periódicas adaptadas a tu tipo de piel.",
    tag: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 019-9 9 9 0 016.36 2.64L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 01-9 9 9 9 0 01-6.36-2.64L3 16" />
      </svg>
    ),
  },
] as const;

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="servicios-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
            Nuestros servicios
          </p>
          <h2
            id="servicios-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-5"
          >
            Todo lo que necesitas para tu bronceado perfecto
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Técnicas profesionales y productos premium para que luzcas un tono
            dorado natural durante semanas.
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0"
          role="list"
        >
          {SERVICES.map((service) => (
            <li
              key={service.title}
              className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {service.tag && (
                <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  {service.tag}
                </span>
              )}

              <div className="flex items-center justify-center w-14 h-14 bg-brand-cream rounded-xl text-brand-orange mb-6">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {service.title}
              </h3>

              <p className="text-slate-600 leading-relaxed flex-1 mb-6">
                {service.description}
              </p>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors text-sm"
                aria-label={`Consultar sobre ${service.title}`}
              >
                Consultar precio
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
