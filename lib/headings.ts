import GithubSlugger from "github-slugger";
import type { Heading, Nodes, Root } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

// Heading IDs and the docs table of contents. Both come from the same walk
// over the same headings with the same slugger, so every TOC link matches an
// ID in the rendered page. IDs are GitHub-style ("## Why SLCR?" -> "why-slcr"),
// so `#fragment` links written by hand in MDX work too.

export type TocEntry = {
  depth: 2 | 3;
  id: string;
  // Heading text, with inline code kept in backticks for <CodeSpans>.
  text: string;
};

function collectHeadings(node: Nodes, headings: Heading[]) {
  if (node.type === "heading") {
    headings.push(node);
  } else if ("children" in node) {
    for (const child of node.children) {
      collectHeadings(child, headings);
    }
  }
}

function headingIds(tree: Root) {
  const headings: Heading[] = [];
  collectHeadings(tree, headings);
  const slugger = new GithubSlugger();
  return headings.map((heading) => ({
    heading,
    id: slugger.slug(toString(heading)),
  }));
}

function displayText(node: Nodes): string {
  if (node.type === "inlineCode") {
    return `\`${node.value}\``;
  }
  if ("children" in node) {
    return node.children.map(displayText).join("");
  }
  return "value" in node ? node.value : "";
}

// Remark plugin: gives every heading in a compiled doc its `id`.
export function remarkHeadingIds() {
  return (tree: Root) => {
    for (const { heading, id } of headingIds(tree)) {
      // remark-rehype copies `data.hProperties` onto the rendered element.
      const data = (heading.data ??= {}) as {
        hProperties?: Record<string, unknown>;
      };
      data.hProperties = { ...data.hProperties, id };
    }
  };
}

// The `##` and `###` headings of an MDX body, for the TOC. This parses the
// body as plain Markdown, which finds the same headings as the MDX compiler
// as long as headings aren't written inside JSX.
export function extractToc(content: string): TocEntry[] {
  return headingIds(fromMarkdown(content)).flatMap(({ heading, id }) =>
    heading.depth === 2 || heading.depth === 3
      ? [{ depth: heading.depth, id, text: displayText(heading) }]
      : [],
  );
}
