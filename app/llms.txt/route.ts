import { allPages } from "content-collections";
import { githubUrl } from "@/components/github-link";
import { docHref, getDocSections } from "@/lib/docs";
import { siteDescription, siteUrl } from "@/lib/metadata";

// Written to out/llms.txt at build time. Required by `output: "export"`.
export const dynamic = "force-static";

// An index of the docs for LLMs and coding agents, in the llms.txt format
// (https://llmstxt.org): a summary, then one linked list per docs section.
// Every doc and site page is listed automatically.
export function GET() {
  const link = (title: string, path: string, description: string) =>
    `- [${title}](${siteUrl}${path}): ${description}`;

  const body = [
    "# SLCR",
    `> ${siteDescription}`,
    [
      "SLCR stands for Sliceable, Linked, Checkable Requirements. A project's requirements live in one structured specification file (TOML, YAML, or JSON). Agents read small, task-specific excerpts of it called slices, people read a Markdown document rendered from it, and validators in the codebase check whether the code meets each requirement.",
      `The reference implementation is the \`slcr\` CLI, written in Rust and released under the MIT License: ${githubUrl}`,
      `The full text of every doc page is at ${siteUrl}/llms-full.txt.`,
    ].join("\n\n"),
    ...getDocSections().map((section) =>
      [
        `## ${section.title}`,
        ...section.docs.map((doc) =>
          link(doc.title, docHref(doc), doc.description),
        ),
      ].join("\n"),
    ),
    [
      "## Optional",
      ...allPages.map((page) =>
        link(page.title, `/${page.name}`, page.description),
      ),
    ].join("\n"),
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
