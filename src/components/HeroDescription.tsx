"use client";

import { useState } from "react";

const FULL_TEXT =
  'En Solaris, entendemos que el bronceado no es una cuestión de "talla única". Cada piel tiene su propia identidad, sus necesidades y sus propios objetivos de belleza. Por eso, nos hemos consolidado como el centro de referencia absoluto en técnicas de bronceado, ofreciendo un abanico completo de opciones de vanguardia para que consigas ese tono dorado, saludable y radiante que buscas, durante todo el año. No importa si buscas un brillo sutil para un evento de fin de semana, una base duradera antes de tus vacaciones, o un tratamiento terapéutico para la piel; nuestro equipo de expertos diseñará el protocolo ideal para ti.';

export default function HeroDescription() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6 md:mb-8 max-w-2xl">
      <p
        className={`text-lg text-white/80 leading-relaxed ${!expanded ? "line-clamp-3 md:line-clamp-none" : ""}`}
      >
        {FULL_TEXT}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 text-sm font-medium text-brand-gold hover:text-brand-gold/80 transition-colors md:hidden"
        aria-expanded={expanded}
      >
        {expanded ? "Ver menos ↑" : "Ver más ↓"}
      </button>
    </div>
  );
}
