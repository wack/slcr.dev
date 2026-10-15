import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/about.mdx.
const page = getPage("about");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function AboutPage() {
  return <ContentPage name="about" eyebrow="The project" />;
}
