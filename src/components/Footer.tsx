import Link from "next/link";
import { PHONE, PHONE_LINK, PHONE_LOCAL, PHONE_LOCAL_LINK, ADDRESS_VENUE, ADDRESS_CITY, SCHEDULE, SOCIAL, WA_LINK } from "@/lib/constants";

const SERVICE_LINKS = [
  "Bronceado Brasileño",
  "Cámara de Bronceado",
  "Bronceado con Spray",
  "Exfoliación Pre-Bronceado",
  "Hidratación Post-Bronceado",
  "Salón",
] as const;

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#proceso", label: "Proceso" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#contacto", label: "Contacto" },
] as const;

function SunLogoIcon() {
  return (
    <svg width="36" height="25" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="22" y1="0" x2="22" y2="7" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="2" x2="27" y2="8" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="8" x2="31.5" y2="12" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="17" x2="34" y2="17.5" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="2" x2="17" y2="8" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="8" x2="12.5" y2="12" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="17" x2="10" y2="17.5" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" strokeLinecap="round" />
      <path d="M 9,24 A 13,13 0 0,1 35,24" style={{ fill: "var(--color-brand-gold)" }} />
      <line x1="2" y1="24" x2="42" y2="24" style={{ stroke: "var(--color-brand-orange)" }} strokeWidth="2" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-dark text-white" aria-label="Pie de página">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Solaris Bronceado – Inicio" className="flex items-center gap-2 mb-4">
              <SunLogoIcon />
              <span className="font-extrabold text-xl text-white">Solaris</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Especialistas en bronceado profesional en Costa Rica. Tono dorado
              natural y uniforme, todo el año.
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Solaris Bronceado"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
<a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Solaris Bronceado"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
              Servicios
            </h3>
            <ul className="space-y-3 list-none p-0 m-0" role="list">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-brand-gold text-sm transition-colors duration-200"
                    aria-label={`Consultar sobre ${service}`}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
              Navegación
            </h3>
            <ul className="space-y-3 list-none p-0 m-0" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand-gold text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">
              Contacto
            </h3>
            <ul className="space-y-4 list-none p-0 m-0 text-white/60 text-sm" role="list">
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-brand-orange" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="flex flex-col leading-snug">
                  <span>{ADDRESS_VENUE}</span>
                  <span>{ADDRESS_CITY}</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-orange" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 01.22 3.43 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.46-1.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
                <a href={PHONE_LINK} className="hover:text-brand-gold transition-colors">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-orange" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 01.22 3.43 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.46-1.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
                <a href={PHONE_LOCAL_LINK} className="hover:text-brand-gold transition-colors">
                  {PHONE_LOCAL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-brand-orange" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {SCHEDULE}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <p>
            &copy; {currentYear} Solaris Bronceado. Todos los derechos reservados.
          </p>
          <p>San José, Costa Rica</p>
        </div>
      </div>
    </footer>
  );
}
