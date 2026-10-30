import type { Metadata } from "next";

// The production origin. Canonical, Open Graph, and sitemap URLs resolve
// against it (www.slcr.dev redirects here).
export const siteUrl = "https://slcr.dev";

export const siteName = "SLCR";

// The home page's <title>. Other pages get "<title> | SLCR".
export const siteTitle =
  "SLCR: Sliceable, Linked, Checkable Requirements for AI agents";

export const siteDescription =
  "SLCR is an open standard for spec-driven development: software requirements that coding agents read in slices and tools check against your code.";

// Open Graph fields shared by every page, including the link-preview image.
// The image is in public/ and listed here, not app/opengraph-image.png:
// that file convention is dropped by any page that sets its own `openGraph`.
// Social platforms cache images by URL, so give a replacement a new file name.
export const sharedOpenGraph = {
  siteName,
  type: "website",
  locale: "en_US",
  images: [
    {
      url: "/og-image.png",
      width: 2400,
      height: 1260,
      type: "image/png",
      alt: "SLCR: an open standard for agent-native software requirements.",
    },
  ],
} satisfies Metadata["openGraph"];

// Metadata for one page: title, description, canonical URL, and Open Graph.
// Use it on every page. Next.js replaces a parent's `openGraph` object
// wholesale rather than merging it, so a page that sets only `title` would
// otherwise share the layout's og:title. Never set `canonical` in a layout:
// every page under it would inherit it and point at the layout's URL.
// Omit `title` to use `siteTitle` (the home page).
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  // Site-relative, e.g. "/docs/concepts/slices".
  path: string;
}): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...sharedOpenGraph,
      title: title ?? siteTitle,
      description,
      url: path,
    },
  };
}
