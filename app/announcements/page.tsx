import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/announcements.mdx.
const page = getPage("announcements");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function AnnouncementsPage() {
  return <ContentPage name="announcements" eyebrow="News" />;
}
