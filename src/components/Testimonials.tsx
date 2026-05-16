const TESTIMONIALS = [
  {
    initials: "MG",
    name: "María González",
    location: "San José",
    rating: 5,
    text: "Me encantó el resultado desde la primera sesión. Mi piel quedó con un tono dorado increíble, súper uniforme y sin manchas. El personal es muy profesional y el ambiente del salón es precioso.",
  },
  {
    initials: "AV",
    name: "Andrea Vargas",
    location: "Escazú",
    rating: 5,
    text: "Fui por primera vez y quedé enamorada. El bronceado brasileño se ve tan natural que todos me preguntan si estuve de vacaciones en la playa. ¡Totalmente recomendado!",
  },
  {
    initials: "CJ",
    name: "Carolina Jiménez",
    location: "Heredia",
    rating: 5,
    text: "Lo que más me gusta es que el bronceado dura semanas y se ve súper natural. Ya no necesito el sol para sentirme linda. Solaris es mi lugar favorito.",
  },
] as const;

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-20 md:py-28 bg-brand-navy"
      aria-labelledby="testimonios-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold font-semibold uppercase tracking-widest text-sm mb-3">
            Testimonios
          </p>
          <h2
            id="testimonios-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5"
          >
            Lo que dicen nuestras clientas
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Resultados reales, clientas felices. Esto es lo que nos inspira cada día.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0" role="list">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name}>
              <figure className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                <div className="flex gap-0.5 text-brand-gold mb-6" aria-label={`${testimonial.rating} de 5 estrellas`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                <blockquote className="flex-1">
                  <p className="text-white/85 leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-orange font-bold text-white text-sm shrink-0"
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/50 text-sm">{testimonial.location}</p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
