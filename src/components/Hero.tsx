import Image from "next/image";
import Link from "next/link";
import { WA_LINK } from "@/lib/constants";
import TrackedLink from "@/components/TrackedLink";
import HeroDescription from "@/components/HeroDescription";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 75% 15%, color-mix(in srgb, var(--color-brand-orange) 22%, transparent) 0%, transparent 55%), linear-gradient(135deg, var(--color-brand-navy-dark) 0%, var(--color-brand-navy) 50%, var(--color-brand-navy-light) 100%)",
      }}
      aria-labelledby="hero-heading"
    >
      {/* Decorative sun glow */}
      <div
        className="absolute top-4 right-0 md:-right-16 w-80 h-80 md:w-[560px] md:h-[560px] rounded-full pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand-gold) 0%, var(--color-brand-orange) 35%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative ring */}
      <div
        className="absolute top-16 right-16 md:right-32 w-48 h-48 md:w-80 md:h-80 rounded-full border border-brand-gold/20 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-32 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-brand-gold/30 text-brand-gold px-4 py-1.5 rounded-full text-sm font-medium mb-4 md:mb-8">
              <span aria-hidden="true">✦</span>
              <span>Bronceado profesional en Costa Rica</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 md:mb-6"
            >
              Solaris
              <span className="block text-brand-gold">El arte del bronceado perfecto</span>
            </h1>

            <HeroDescription />

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedLink
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-4 rounded-full text-lg transition-colors duration-200 shadow-lg"
                tracking={[
                  { event: "whatsapp_click", source: "hero" },
                  { event: "cta_click", source: "hero" },
                ]}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Reservar por WhatsApp
              </TrackedLink>

              <Link
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-brand-gold hover:text-brand-gold text-white font-bold px-8 py-4 rounded-full text-lg transition-colors duration-200"
              >
                Ver servicios
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative w-full max-w-sm lg:max-w-none lg:w-[420px] shrink-0" aria-hidden="true">
            <div className="relative h-[520px] lg:h-[620px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src="/image1.jpeg"
                alt="Resultado de bronceado profesional Solaris"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 384px, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
            </div>
            {/* Decorative glow behind image */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none -z-10"
              style={{ background: "radial-gradient(circle, var(--color-brand-orange) 0%, transparent 70%)" }}
            />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,36 C360,72 1080,0 1440,36 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
