import type { Metadata } from "next";
import { SITE_NAME } from "./constants";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Branded 1200x630 card (public/og-default.png) for pages without an image of
 * their own. Blog posts use their cover instead.
 */
export const DEFAULT_SHARE_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Solaris Bronceado — Salón de bronceado profesional en Costa Rica",
};

/**
 * Open Graph defaults. Next merges metadata shallowly, so a page that sets
 * `openGraph` replaces the whole object (including images): spread this and
 * override fields.
 */
export const DEFAULT_OPEN_GRAPH: OpenGraph & { type: "website" } = {
  type: "website",
  locale: "es_CR",
  siteName: SITE_NAME,
  title: "Solaris Bronceado | Salón de Bronceado Profesional en Costa Rica",
  description: "Bronceado profesional en Costa Rica. Técnica brasileña, tono dorado natural desde la primera sesión.",
  images: [DEFAULT_SHARE_IMAGE],
};
