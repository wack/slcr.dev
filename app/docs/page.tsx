import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, reveal, SliceCorner } from "@/components/decor";
import { CodeSpans } from "@/components/code-spans";
import { docHref, getDocSections } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Documentation",
  description:
    "Documentation for SLCR: install the CLI, learn the core concepts, follow step-by-step guides, and look up the specification format and commands.",
  path: "/docs",
});

export default function DocsIndexPage() {
  return (
    <main className="max-w-3xl">
      <Eyebrow>Docs</Eyebrow>
      <h1 className="mt-4 text-3xl">Documentation</h1>
      <p className="mt-4 text-lg text-slate-600">
        Everything you need to read, write, and check SLCR documents.
      </p>
      {getDocSections().map((section) => (
        <section key={section.key} className="mt-12">
          <h2 className="text-lg">{section.title}</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {section.docs.map((doc, i) => (
              <li key={doc._meta.path} {...reveal(i)}>
                <Link
                  href={docHref(doc)}
                  className="group relative block h-full border border-slate-200 p-5 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  <SliceCorner className="size-6 bg-slate-200 group-hover:size-9 group-hover:bg-sprout-500" />
                  <span className="block font-medium text-slate-950 group-hover:text-cobalt-800">
                    <CodeSpans text={doc.title} />
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    <CodeSpans text={doc.description} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
