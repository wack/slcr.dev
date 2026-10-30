import { docHref, getOrderedDocs } from "@/lib/docs";
import { siteDescription, siteUrl } from "@/lib/metadata";

// Written to out/llms-full.txt at build time. Required by `output: "export"`.
export const dynamic = "force-static";

// Every doc page's Markdown source in one file, in sidebar order, so an LLM
// or coding agent can read the whole manual in one request. Linked from
// /llms.txt.
export function GET() {
  const docs = getOrderedDocs().map((doc) =>
    [
      `# ${doc.title}`,
      `Source: ${siteUrl}${docHref(doc)}`,
      `> ${doc.description}`,
      // Make site-relative links absolute, since this file is read out of
      // context.
      doc.content.trim().replaceAll("](/", `](${siteUrl}/`),
    ].join("\n\n"),
  );

  const body = [
    ["# SLCR documentation", `> ${siteDescription}`].join("\n\n"),
    ...docs,
  ].join("\n\n---\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
