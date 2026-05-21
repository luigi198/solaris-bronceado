import { WA_LINK } from "@/lib/constants";

const SERVICES = [
  {
    title: "Bronceado Brasileño",
    description:
      "Técnica híbrida que combina cámara UV, activadores de melanina y pigmentos naturales para lograr un tono intenso, uniforme y de larga duración. Incluye diseño de bikini con cintas. ₡20.000 por sesión.",
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
    title: "Cámara de Bronceado",
    description:
      "10 sesiones + acelerador Australian Gold + gafas protectoras. Un bronceado natural, uniforme y duradero, igual al obtenido con el sol. Todos nuestros equipos son verticales. ₡50.000 el paquete.",
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
    title: "Bronceado con Spray",
    description:
      "Bronceado instantáneo 100% natural a base de caña de azúcar, sin efectos secundarios — el más saludable del mercado. La aplicación tarda solo 5 minutos, cubre manchas, cicatrices, estrías, celulitis, capilares rotos y cualquier imperfección. Sellamos el resultado con cámara de colágeno; el color dura de 8 a 10 días. ₡20.000 por sesión.",
    tag: "Instantáneo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z" />
        <path d="M17 3l1.5 4.5L23 9l-4.5 1.5L17 15l-1.5-4.5L11 9l4.5-1.5L17 3z" />
      </svg>
    ),
  },
  {
    title: "Exfoliación Pre-Bronceado",
    description:
      "Prepara tu piel eliminando células muertas para lograr un bronceado más uniforme, intenso y duradero.",
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
      "Tratamiento hidratante y sellado en cámara de colágeno para prolongar un bronceado uniforme y luminoso.",
    tag: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
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
          className="flex flex-wrap justify-center gap-8 list-none p-0 m-0"
          role="list"
        >
          {SERVICES.map((service) => (
            <li
              key={service.title}
              className="relative bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
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
