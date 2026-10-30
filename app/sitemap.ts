import { allPages } from "content-collections";
import type { MetadataRoute } from "next";
import { docHref, getOrderedDocs } from "@/lib/docs";
import { siteUrl } from "@/lib/metadata";

// Written to out/sitemap.xml at build time. Required by `output: "export"`.
export const dynamic = "force-static";

// Lists the home page, every doc, and every site page in content/pages/
// (each is served at /<file name>). Add other hand-written routes here.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteUrl}${path}`;
  return [
    { url: url("/") },
    { url: url("/docs") },
    ...getOrderedDocs().map((doc) => ({ url: url(docHref(doc)) })),
    ...allPages.map((page) => ({
      url: url(`/${page.name}`),
      ...(page.updated && { lastModified: page.updated }),
    })),
  ];
}
