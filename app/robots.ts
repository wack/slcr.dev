import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Written to out/robots.txt at build time. Required by `output: "export"`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
