import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { pageMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/code-of-conduct.mdx.
const page = getPage("code-of-conduct");

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/code-of-conduct",
});

export default function CodeOfConductPage() {
  return <ContentPage name="code-of-conduct" eyebrow="Community" />;
}
