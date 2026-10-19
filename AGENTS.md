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
   `<h1>`, so start body headings at `##`. GitHub-flavored Markdown
   (tables, strikethrough, task lists, bare-URL autolinks) is enabled via
   `remark-gfm`. The body is MDX, not plain
   Markdown: a bare `{` or `<` in prose is parsed as JavaScript or JSX, so
   escape it (`\{`, `\<`) or put it in a code span. Plain HTML elements such
   as `<kbd>` work. Importing project components from MDX is not set up. To
   make a React component available, pass it through the `components` prop of
   `<MDXContent>` in `app/docs/[...slug]/page.tsx`.
4. Check it with `pnpm dev`. The watcher recompiles on save, and the page
   appears at its URL and in the `/docs` index. Then run `pnpm build`. It must
   pass, and its route table should list the new path under
   `/docs/[...slug]`.

Docs are grouped in the sidebar and on `/docs` by top-level directory
(`getting-started/` → "Getting Started"; top-level files → "Overview"). Within
and across sections they sort by the optional `order` frontmatter number, so a
section's position is set by its lowest `order`. Current convention: Overview
1–9, Getting Started 10s, Concepts 20s, Guides 30s, Reference 40s. Grouping
logic lives in `lib/docs.ts`.

Renaming or moving a file changes its URL. To add a frontmatter field, add it
to the zod schema in `content-collections.ts`. The field is then typed on
every entry of `allDocs`.

## Site pages (about, announcements, code of conduct, security)

The non-docs pages are also editable MDX, in a second collection, `pages`,
under `content/pages/`. Each file has its own explicit route:
`content/pages/about.mdx` is rendered by `app/about/page.tsx`, and likewise
`announcements`, `code-of-conduct`, and `security`. Their frontmatter is `title`,
`description`, and an optional `updated` date (`YYYY-MM-DD`), shown as
"Last updated". Announcements is a single page: add new entries at the top of
`content/pages/announcements.mdx` under a dated `##` heading.

Header nav links are in `components/site-header.tsx` and footer links (code of
conduct, security) are in `components/site-footer.tsx`.

# Design system

Styling is Tailwind v4 throughout. Theme tokens and custom utilities live in
`app/globals.css`; use them rather than raw hex values or one-off CSS.

- **Colors.** Four brand ramps from the logo, each `50`–`950`: `sprout`
  (#60AE00 at 500), `leaf` (#00AD0F at 500), `lagoon` (#00AD97 at 500), and
  `cobalt` (#0028AD at 800). Steps 600 and up pass WCAG AA with white text;
  500 and below need dark text. Neutrals are Tailwind's `slate`. Surfaces are
  mostly `white`/`slate-50`; `cobalt-950` is the dark accent surface. The site
  is light-only.
- **Type.** `font-display` (Unbounded) for headings, set on `h1`–`h6` in the
  base layer; `font-sans` (Spline Sans) for body; `font-mono` (Geist Mono) for
  code and labels. The `text-*` line heights are overridden so body sizes are
  at least 1.5 and heading sizes at least 1.2. Don't use smaller `leading-*`.
- **Buttons.** `ButtonLink` in `components/button.tsx`. `primary` is
  sprout-500 (#60AE00) with dark text; `secondary` is a white fill with a 2px
  cobalt outline. Icons are from `lucide-react`; don't use unicode glyphs.
- **Slice decoration.** Triangles echo the "slice" idea. Utilities:
  `clip-tri-{tl,tr,bl,br,up,down}`, `clip-slice-corner`, `bg-slcr-linear`,
  `bg-slcr-tri-br`,
  `text-slcr-gradient`, and `bg-triangle-grid` (a faint field of small
  staggered triangles). Components in `components/decor.tsx`: `SliceField`
  (procedural triangle mosaic, sparse/light on the left and dense/dark on the
  right; same `seed`, same pattern), `SliceGrid` (hand-authored mosaic),
  `SliceDivider` (diagonal section transition), `SliceCorner`, `SliceMark`,
  and `Eyebrow`.
- **Gradient rule.** A single shape gets either one soft gradient or a solid
  fill, never a hard edge inside it; hard edges only fall between shapes. A gradient in a triangle runs
  parallel or perpendicular to its long edge (use corner keywords such as
  `to bottom right`, not fixed angles, so it holds at any aspect ratio). So
  don't use conic gradients for decoration (their seam puts a hard edge inside
  a shape). In decoration use sprout, lagoon, and cobalt together; sprout and
  leaf are too close to tell apart side by side.
- **Motion.** Keep it light, and gate every animation with `motion-safe:`.
  Page-load: `animate-rise` for hero text, `SliceField animated` for art.
  Scroll: spread `{...reveal(step)}` from `components/decor.tsx` onto an
  element to fade it up once as it enters the viewport
  (`components/scroll-reveal.tsx`, mounted in the root layout). Content is
  visible without JS. Hover: buttons widen their cut corner, nav links grow an
  underline, and linked cards grow their `SliceCorner`. Only give hover
  feedback to things that are clickable.
- **Page structure.** Main pages start with `PageHeader`
  (`components/page-header.tsx`). MDX uses `proseClasses` from `lib/styles.ts`.
  Docs stay neutral (slate, with sprout/cobalt only for marks, links, and the
  current page).
- **Logo.** `components/logo.tsx` renders `public/slcr-logo.svg` (color) or
  `public/slcr-logo-white.svg`. `app/icon.svg` is the favicon: one SVG holding the S icon and
  a copy of `public/slcr-logo.svg`; an internal media query shows the S
  at 24px and below (16px tabs) and the full wordmark above. The color logo
  is plain SVG: the source file's angular gradient (a Figma `foreignObject`
  that doesn't render in `<img>` or favicons) is approximated with thin wedges
  clipped to the letters.
