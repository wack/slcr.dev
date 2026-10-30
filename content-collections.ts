import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options } from "@content-collections/mdx";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { extractToc, remarkHeadingIds } from "./lib/headings";

// GitHub-flavored Markdown (tables, autolinks, strikethrough, task lists) for
// every collection.
// Headings get GitHub-style IDs so they can be linked to (see lib/headings.ts).
// Fenced code blocks are syntax-highlighted by Shiki at build time, so no
// highlighter ships to the browser. The language comes from the fence
// (```toml); fences without one, or with one Shiki doesn't know, stay plain.
const mdxOptions: Options = {
  remarkPlugins: [remarkGfm, remarkHeadingIds],
  rehypePlugins: [
    [
      rehypeShiki,
      {
        theme: "github-dark-default",
        defaultLanguage: "text",
        fallbackLanguage: "text",
        transformers: [
          {
            // Record the fence's language for the code block header
            // (components/code-block.tsx).
            pre(node) {
              node.properties["data-language"] = this.options.lang;
            },
          },
        ],
      } satisfies RehypeShikiOptions,
    ],
  ],
};

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    // Replaces `title` in the browser tab, search results, and link previews,
    // for a page whose short sidebar title says little on its own ("CLI").
    metaTitle: z.string().optional(),
    description: z.string(),
    // Sort key for the docs sidebar and index. Lower comes first; docs without
    // one sort after those with one, then by path. See lib/docs.ts.
    order: z.number().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    return {
      ...document,
      mdx,
      // `content/docs/guides/intro.mdx` -> ["guides", "intro"]
      slug: document._meta.path.split("/"),
      // The ## and ### headings, for the page's table of contents.
      toc: extractToc(document.content),
    };
  },
});

// Standalone site pages (about, announcements, legal). Each file is rendered by
// its own route in `app/`, e.g. `content/pages/about.mdx` by `app/about/page.tsx`.
const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ISO date (YYYY-MM-DD) shown as "Last updated" when present.
    updated: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, mdxOptions);
    return { ...document, mdx, name: document._meta.path };
  },
});

export default defineConfig({
  content: [docs, pages],
});
