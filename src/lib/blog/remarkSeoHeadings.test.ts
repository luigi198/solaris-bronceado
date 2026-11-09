import type { Heading, Root } from "mdast";
import { describe, expect, it } from "vitest";
import { remarkSeoHeadings } from "./remarkSeoHeadings";

function heading(depth: Heading["depth"], text: string): Heading {
  return { type: "heading", depth, children: [{ type: "text", value: text }] };
}

function run(...headings: Heading[]): Heading[] {
  const tree: Root = { type: "root", children: headings };
  remarkSeoHeadings()(tree);
  return headings;
}

describe("remarkSeoHeadings", () => {
  it("demotes every heading when the body uses an h1", () => {
    const [a, b, c] = run(heading(1, "Título"), heading(2, "Sección"), heading(6, "Fondo"));
    expect([a.depth, b.depth, c.depth]).toEqual([2, 3, 6]);
  });

  it("leaves bodies without an h1 untouched", () => {
    const [a, b] = run(heading(2, "Uno"), heading(3, "Dos"));
    expect([a.depth, b.depth]).toEqual([2, 3]);
  });

  it("assigns unique, slugified ids", () => {
    const ids = run(heading(2, "¿Cuánto dura?"), heading(2, "¿Cuánto dura?"), heading(2, "!!!")).map(
      (h) => h.data?.hProperties?.id,
    );
    expect(ids).toEqual(["cuanto-dura", "cuanto-dura-2", "seccion"]);
  });
});
