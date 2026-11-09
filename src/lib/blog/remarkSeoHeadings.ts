import type { Heading, Nodes, Root } from "mdast";
import { slugify } from "./slug";

type Depth = Heading["depth"];
const DEMOTED: Readonly<Record<Depth, Depth>> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6 };

function collectHeadings(node: Nodes, out: Heading[]): void {
  if (node.type === "heading") out.push(node);
  if ("children" in node) for (const child of node.children) collectHeadings(child, out);
}

function textOf(node: Nodes): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map(textOf).join("");
  return "";
}

/**
 * Remark plugin enforcing our heading SEO rules on article bodies:
 * - The page template owns the only <h1>, so if the Markdown uses `#` at all,
 *   every heading is demoted one level (h1→h2, h2→h3, …) to keep the hierarchy.
 * - Every heading gets a stable, unique `id` for deep links ("#como-preparar").
 * Runs in O(n) over the syntax tree.
 */
export function remarkSeoHeadings() {
  return (tree: Root): void => {
    const headings: Heading[] = [];
    collectHeadings(tree, headings);
    const demote = headings.some((h) => h.depth === 1);
    const used = new Map<string, number>();

    for (const heading of headings) {
      if (demote) heading.depth = DEMOTED[heading.depth];
      const base = slugify(textOf(heading)) || "seccion";
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;
      heading.data = { ...heading.data, hProperties: { ...heading.data?.hProperties, id } };
    }
  };
}
