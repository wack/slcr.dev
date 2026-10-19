import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/security.mdx.
const page = getPage("security");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function SecurityPage() {
  return <ContentPage name="security" eyebrow="Community" />;
}
