import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/privacy.mdx.
const page = getPage("privacy");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function PrivacyPage() {
  return <ContentPage name="privacy" eyebrow="Legal" />;
}
