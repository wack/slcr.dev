import { MDXContent } from "@content-collections/mdx/react";
import { PageHeader } from "@/components/page-header";
import { getPage } from "@/lib/pages";
import { mdxComponents } from "@/lib/mdx-components";
import { proseClasses } from "@/lib/styles";

// Renders a file from content/pages/ as a full page.
export function ContentPage({
  name,
  eyebrow,
}: {
  name: string;
  eyebrow?: string;
}) {
  const page = getPage(name);
  return (
    <main>
      <PageHeader
        eyebrow={eyebrow}
        title={page.title}
        description={page.description}
      >
        {page.updated && (
          <p className="mt-4 text-sm text-slate-500">
            Last updated <time dateTime={page.updated}>{page.updated}</time>
          </p>
        )}
      </PageHeader>
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <article className={proseClasses}>
          <MDXContent code={page.mdx} components={mdxComponents} />
        </article>
      </div>
    </main>
  );
}
