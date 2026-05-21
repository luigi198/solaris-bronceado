const TIPS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
    text: "Llega con la piel limpia, sin cremas ni perfumes",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        <path d="M19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      </svg>
    ),
    text: "Piel exfoliada para un resultado más uniforme e intenso",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
      </svg>
    ),
    text: "Ven depilada para mejores resultados",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    text: "Usa ropa holgada y preferiblemente oscura",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12" />
        <path d="M18 3a2 2 0 012 2v14a2 2 0 01-2 2" />
        <path d="M9 8h6M9 12h4" />
      </svg>
    ),
    text: "Ven con sandalias para cuidar el resultado en los pies",
  },
];

export default function PreCare() {
  return (
    <section
      className="py-16 md:py-24 bg-brand-cream"
      aria-labelledby="precare-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-orange font-semibold uppercase tracking-widest text-sm mb-3">
            Antes de tu cita
          </p>
          <h2
            id="precare-heading"
            className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4"
          >
            Cuidados previos a tu sesión
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Aplica para bronceado brasileño y con spray. Sigue estos pasos y
            consigue el mejor resultado posible.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0" role="list">
          {TIPS.map((tip) => (
            <li
              key={tip.text}
              className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 px-6 py-5 shadow-sm"
            >
              <span className="mt-0.5 shrink-0 text-brand-orange">{tip.icon}</span>
              <span className="text-slate-700 font-medium leading-snug">{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
