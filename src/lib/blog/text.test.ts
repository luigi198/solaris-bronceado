import { describe, expect, it } from "vitest";
import { parseFrontMatter } from "./frontMatter";
import { readingTimeMinutes } from "./rules";
import { isValidSlug, slugify, SLUG_MAX_LENGTH } from "./slug";

describe("slugify", () => {
  it("strips accents, punctuation and casing", () => {
    expect(slugify("¿Cómo cuidar tu BRONCEADO? ¡Guía 2026!")).toBe("como-cuidar-tu-bronceado-guia-2026");
    expect(slugify("Mañana en la piña")).toBe("manana-en-la-pina");
  });

  it("truncates long titles on a word boundary", () => {
    const slug = slugify("palabra ".repeat(30));
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("validates slugs", () => {
    expect(isValidSlug("bronceado-brasileno")).toBe(true);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("doble--guion")).toBe(false);
    expect(isValidSlug("../etc")).toBe(false);
    expect(isValidSlug("pagina")).toBe(false);
  });
});

describe("parseFrontMatter", () => {
  it("extracts known fields and the body", () => {
    const md = `---\ntitle: "Guía: bronceado"\nmeta_description: Una descripción\nslug: guia\nauthor: ignored\n---\n\n## Intro\nTexto`;
    expect(parseFrontMatter(md)).toEqual({
      fields: { title: "Guía: bronceado", description: "Una descripción", slug: "guia" },
      body: "## Intro\nTexto",
    });
  });

  it("returns the input untouched when there is no front matter", () => {
    expect(parseFrontMatter("## Hola\n---\nno")).toEqual({ fields: {}, body: "## Hola\n---\nno" });
  });
});

describe("readingTimeMinutes", () => {
  it("rounds to at least one minute", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes("palabra ".repeat(1000))).toBe(5);
  });
});
