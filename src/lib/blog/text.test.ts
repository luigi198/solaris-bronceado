import { describe, expect, it } from "vitest";
import { parseFrontMatter } from "./frontMatter";
import { countWords, readingTimeMinutes } from "./rules";
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

  it("reads the cover alt text under its aliases", () => {
    expect(parseFrontMatter(`---\ncover_alt: Cabina de bronceado\n---\nTexto`).fields).toEqual({ coverAlt: "Cabina de bronceado" });
  });

  it("returns the input untouched when there is no front matter", () => {
    expect(parseFrontMatter("## Hola\n---\nno")).toEqual({ fields: {}, body: "## Hola\n---\nno" });
  });
});

describe("countWords", () => {
  it("counts whitespace-separated words, ignoring extra whitespace", () => {
    expect(countWords("  uno\n\ndos\ttres  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });
});

describe("readingTimeMinutes", () => {
  it("rounds to at least one minute", () => {
    expect(readingTimeMinutes(0)).toBe(1);
    expect(readingTimeMinutes(countWords("palabra ".repeat(1000)))).toBe(5);
  });
});
