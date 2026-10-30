import { MDXContent } from "@content-collections/mdx/react";
import { allDocs } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/decor";
import { DocPager } from "@/components/doc-pager";
import { DocToc } from "@/components/doc-toc";
import { JsonLd } from "@/components/json-ld";
import { CodeSpans, plainText } from "@/components/code-spans";
import { docHref, findDoc, getDocSections } from "@/lib/docs";
import { pageMetadata } from "@/lib/metadata";
import { docBreadcrumbJsonLd } from "@/lib/structured-data";
import { mdxComponents } from "@/lib/mdx-components";
import { proseClasses } from "@/lib/styles";

// Only the docs returned by generateStaticParams exist; everything else 404s.
// Required by `output: "export"`, which cannot render unknown paths on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(
  props: PageProps<"/docs/[...slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const doc = findDoc(slug);
  if (!doc) {
    return {};
  }
  return pageMetadata({
    title: plainText(doc.metaTitle ?? doc.title),
    description: plainText(doc.description),
    path: docHref(doc),
  });
}

export default async function DocPage(props: PageProps<"/docs/[...slug]">) {
  const { slug } = await props.params;
  const doc = findDoc(slug);
  if (!doc) {
    notFound();
  }

  const section = getDocSections().find((s) => s.docs.includes(doc));

  // A one-entry contents list isn't worth the space.
  const showToc = doc.toc.length > 1;

  return (
    <div className="flex gap-10">
      <main className="min-w-0 max-w-3xl flex-1">
        <JsonLd
          data={docBreadcrumbJsonLd(plainText(doc.title), docHref(doc))}
        />
        {section && <Eyebrow>{section.title}</Eyebrow>}
        <h1 className="mt-4 text-3xl">
          <CodeSpans text={doc.title} />
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          <CodeSpans text={doc.description} />
        </p>
        <article className={`mt-10 ${proseClasses}`}>
          <MDXContent code={doc.mdx} components={mdxComponents} />
        </article>
        <DocPager doc={doc} />
      </main>
      {/* Only at xl and up is there room beside the sidebar and the text. */}
      {showToc && (
        <aside className="hidden w-48 shrink-0 xl:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <DocToc entries={doc.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
