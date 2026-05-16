"use client";

import { useState } from "react";
import Link from "next/link";
import { WA_LINK } from "@/lib/constants";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
] as const;

function SunLogoIcon() {
  return (
    <svg
      width="40"
      height="28"
      viewBox="0 0 44 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="22" y1="0" x2="22" y2="7" stroke="#f5a520" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="2" x2="27" y2="8" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="8" x2="31.5" y2="12" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="17" x2="34" y2="17.5" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="2" x2="17" y2="8" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="8" x2="12.5" y2="12" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="17" x2="10" y2="17.5" stroke="#f5a520" strokeWidth="2" strokeLinecap="round" />
      <path d="M 9,24 A 13,13 0 0,1 35,24" fill="#ffd35f" />
      <line x1="2" y1="24" x2="42" y2="24" stroke="#f5a520" strokeWidth="2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            aria-label="Solaris Bronceado – Inicio"
            className="flex items-center gap-2"
          >
            <SunLogoIcon />
            <span className="text-brand-navy font-extrabold text-xl md:text-2xl tracking-tight leading-none">
              Solaris
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-brand-navy font-medium hover:text-brand-orange transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            <WhatsAppIcon />
            Reservar cita
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-orange"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4">
            <ul className="list-none m-0 p-0 flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-brand-navy font-medium hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold px-5 py-3 rounded-full"
            >
              <WhatsAppIcon />
              Reservar cita por WhatsApp
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
