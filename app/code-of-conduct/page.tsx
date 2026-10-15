import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/code-of-conduct.mdx.
const page = getPage("code-of-conduct");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function CodeOfConductPage() {
  return <ContentPage name="code-of-conduct" eyebrow="Community" />;
}
