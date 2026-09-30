<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Static site generation (SSG) is mandatory

This site is fully static. `next.config.ts` sets `output: "export"`, so
`next build` prerenders every route to HTML/CSS/JS in `out/` and **fails** if any
route needs a server at request time. Keep it that way:

- Never remove `output: "export"` or `images.unoptimized` from `next.config.ts`.
  `pnpm build` runs `scripts/verify-static-export.mjs` after `next build` and
  fails if the static export was not produced.
- Don't use features that need a server: `cookies()`, `headers()`,
  `searchParams` in Server Components, `draft-mode`, Server Actions,
  `proxy`/middleware, rewrites/redirects/headers in `next.config.ts`, ISR
  (`revalidate`), non-GET Route Handlers, or `next/image`'s default loader.
  Route Handlers must be GET-only with `export const dynamic = "force-static"`.
- Every dynamic route segment (`[param]`, `[...param]`) must export
  `generateStaticParams()` and `export const dynamicParams = false`.
- Interactivity belongs in Client Components (`"use client"`) that run in the
  browser. Guard browser APIs (`window`, `localStorage`) inside `useEffect`,
  because Client Components are also prerendered at build time.

The authoritative list is `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.

# Documentation content (MDX via Content Collections)

Documentation pages are MDX files under `content/docs/`, compiled at build time
by [Content Collections](https://www.content-collections.dev/). Content
Collections reads the files, validates each one's frontmatter against a schema,
compiles the MDX, and writes the results out as a typed module the app imports.
No MDX is parsed at request time, which keeps the docs compatible with the
static export above.

- `content-collections.ts` defines the `docs` collection. Its schema (zod) is
  the frontmatter contract: every doc needs `title` and `description`. The
  `transform` compiles the MDX body (`mdx`) and derives `slug` from the file
  path. `content/docs/a/b.mdx` is served at `/docs/a/b`.
- Import compiled content with `import { allDocs } from "content-collections"`.
  That alias (in `tsconfig.json`) points at `.content-collections/generated/`,
  which is generated and git-ignored. Never edit or commit it.
- Render MDX with `<MDXContent code={doc.mdx} />` from
  `@content-collections/mdx/react`. Pages are `app/docs/page.tsx` (index) and
  `app/docs/[...slug]/page.tsx`.
- Compilation is wired into Next.js via `withContentCollections` in
  `next.config.ts`: `pnpm dev` compiles and then watches `content/`, and
  `pnpm build` compiles before building. There is no separate content build
  step to run or forget. Don't add one, and don't unwrap the config.
- Frontmatter that fails the schema makes `pnpm build` exit non-zero with a
  validation error naming the file.

## Adding a new doc page

Adding a page needs no route or component code. The file is the page.

1. Create an `.mdx` file under `content/docs/`. Its path relative to that
   directory, minus the extension, becomes its URL:
   `content/docs/getting-started.mdx` → `/docs/getting-started`, and
   `content/docs/guides/linking.mdx` → `/docs/guides/linking`. Use kebab-case
   file and directory names. A file named `index.mdx` is served at
   `/docs/.../index`, not at its parent directory.
2. Start the file with frontmatter matching the schema in
   `content-collections.ts`:

   ```mdx
   ---
   title: Getting Started
   description: One sentence, used on the /docs index and as the meta description.
   ---

   Body text in Markdown/MDX goes here.
   ```

3. Write the body. The page template already renders `title` as the page's
   `<h1>`, so start body headings at `##`. The body is MDX, not plain
   Markdown: a bare `{` or `<` in prose is parsed as JavaScript or JSX, so
   escape it (`\{`, `\<`) or put it in a code span. Plain HTML elements such
   as `<kbd>` work. Importing project components from MDX is not set up. To
   make a React component available, pass it through the `components` prop of
   `<MDXContent>` in `app/docs/[...slug]/page.tsx`.
4. Check it with `pnpm dev`. The watcher recompiles on save, and the page
   appears at its URL and in the `/docs` index. Then run `pnpm build`. It must
   pass, and its route table should list the new path under
   `/docs/[...slug]`.

Renaming or moving a file changes its URL. To add a frontmatter field, add it
to the zod schema in `content-collections.ts`. The field is then typed on
every entry of `allDocs`.
