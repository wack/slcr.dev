import { MDXContent } from "@content-collections/mdx/react";
import { allDocs } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/decor";
import { findDoc, getDocSections } from "@/lib/docs";
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
  return { title: doc.title, description: doc.description };
}

export default async function DocPage(props: PageProps<"/docs/[...slug]">) {
  const { slug } = await props.params;
  const doc = findDoc(slug);
  if (!doc) {
    notFound();
  }

  const section = getDocSections().find((s) => s.docs.includes(doc));

  return (
    <main className="max-w-3xl">
      {section && <Eyebrow>{section.title}</Eyebrow>}
      <h1 className="mt-4 text-3xl">{doc.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{doc.description}</p>
      <article className={`mt-10 ${proseClasses}`}>
        <MDXContent code={doc.mdx} components={mdxComponents} />
      </article>
    </main>
  );
}
