import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { pageMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";

// Content lives in content/pages/announcements.mdx.
const page = getPage("announcements");

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: "/announcements",
});

export default function AnnouncementsPage() {
  return <ContentPage name="announcements" eyebrow="News" />;
}
