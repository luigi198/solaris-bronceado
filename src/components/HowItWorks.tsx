import { WA_LINK } from "@/lib/constants";

const STEPS = [
  {
    step: "01",
    title: "Reserva tu cita",
    description:
      "Escríbenos por WhatsApp o llámanos. Evaluamos tu tipo de piel y te recomendamos la técnica ideal para lograr tu tono perfecto.",
  },
  {
    step: "02",
    title: "Ven a tu sesión",
    description:
      "Te preparamos según tu técnica de bronceado y realizamos el procedimiento con asesoría profesional en un ambiente cómodo y seguro.",
  },
  {
    step: "03",
    title: "Luce tu bronceado",
    description:
      "Disfruta un tono dorado uniforme y radiante con recomendaciones profesionales para prolongar tu resultado.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="proceso"
      className="py-20 md:py-28 bg-white"
      aria-labelledby="proceso-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
            El proceso
          </p>
          <h2
            id="proceso-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-5"
          >
            Así de fácil es tener el bronceado perfecto
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            En tres pasos simples pasas de la consulta al tono dorado que siempre quisiste.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative list-none p-0 m-0">
          {/* Connecting line (desktop only) */}
          <li className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-brand-gold/40 pointer-events-none" aria-hidden="true" />

          {STEPS.map((item) => (
            <li key={item.step} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand-navy text-brand-gold font-extrabold text-2xl shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">
                {item.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="text-center mt-14">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-4 rounded-full text-lg transition-colors duration-200 shadow-md"
          >
            Comenzar ahora
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
