import { MDXContent } from "@content-collections/mdx/react";
import { allDocs } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Only the docs returned by generateStaticParams exist; everything else 404s.
// Required by `output: "export"`, which cannot render unknown paths on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs.map((doc) => ({ slug: doc.slug }));
}

function findDoc(slug: string[]) {
  return allDocs.find((doc) => doc.slug.join("/") === slug.join("/"));
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

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <article className="prose prose-zinc dark:prose-invert">
        <h1>{doc.title}</h1>
        <MDXContent code={doc.mdx} />
      </article>
    </main>
  );
}
