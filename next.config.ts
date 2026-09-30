import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This site is fully static (SSG). `next build` emits plain HTML/CSS/JS into
  // `out/` and fails if any route needs a server at request time. Do not remove
  // this; see AGENTS.md. `scripts/verify-static-export.mjs` enforces it.
  output: "export",
  images: {
    // The default image loader needs a server, which a static export lacks.
    unoptimized: true,
  },
};

// Compiles `content/` via content-collections.ts on `next build` and
// `next dev` (in watch mode), before Next.js compiles the app.
export default withContentCollections(nextConfig);
