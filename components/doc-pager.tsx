import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CodeSpans } from "@/components/code-spans";
import { SliceCorner } from "@/components/decor";
import { type Doc, docHref, getAdjacentDocs } from "@/lib/docs";

// Links to the previous and next docs in sidebar order, at the foot of each
// doc, styled like the cards on the /docs index.
export function DocPager({ doc }: { doc: Doc }) {
  const { previous, next } = getAdjacentDocs(doc);
  return (
    <nav
      aria-label="Previous and next pages"
      className="mt-16 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2"
    >
      {previous && <PagerLink doc={previous} direction="previous" />}
      {next && <PagerLink doc={next} direction="next" />}
    </nav>
  );
}

function PagerLink({
  doc,
  direction,
}: {
  doc: Doc;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={docHref(doc)}
      rel={isNext ? "next" : "prev"}
      className={`group relative block border border-slate-200 p-5 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 ${
        isNext ? "text-right sm:col-start-2" : ""
      }`}
    >
      <SliceCorner
        corner={isNext ? "tr" : "tl"}
        className="size-6 bg-slate-200 group-hover:size-9 group-hover:bg-sprout-500"
      />
      <span
        className={`flex items-center gap-1.5 font-mono text-xs font-medium tracking-wider text-slate-500 uppercase ${
          isNext ? "justify-end" : ""
        }`}
      >
        {!isNext && <Arrow aria-hidden="true" className="size-3.5" />}
        {isNext ? "Next" : "Previous"}
        {isNext && <Arrow aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="mt-1 block font-medium text-slate-950 group-hover:text-cobalt-800">
        <CodeSpans text={doc.title} />
      </span>
    </Link>
  );
}
