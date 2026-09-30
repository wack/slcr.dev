import { allDocs } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
};

export default function DocsIndexPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
      <ul className="mt-8 flex flex-col gap-6">
        {allDocs.map((doc) => (
          <li key={doc._meta.path}>
            <Link
              href={`/docs/${doc.slug.join("/")}`}
              className="text-lg font-medium hover:underline"
            >
              {doc.title}
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400">
              {doc.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
