import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const docs = defineCollection({
  name: "docs",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Sort key for the docs sidebar and index. Lower comes first; docs without
    // one sort after those with one, then by path. See lib/docs.ts.
    order: z.number().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      mdx,
      // `content/docs/guides/intro.mdx` -> ["guides", "intro"]
      slug: document._meta.path.split("/"),
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
    const mdx = await compileMDX(context, document);
    return { ...document, mdx, name: document._meta.path };
  },
});

export default defineConfig({
  content: [docs, pages],
});
