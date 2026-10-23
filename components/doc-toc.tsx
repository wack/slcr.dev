"use client";

import { useEffect, useState } from "react";
import { CodeSpans } from "@/components/code-spans";
import { SliceMark } from "@/components/decor";
import type { TocEntry } from "@/lib/headings";

// "On this page" list of a doc's ## and ### headings. The heading nearest the
// top of the viewport is marked current, styled like the sidebar's current
// page. Without JS it is a plain list of anchor links.
export function DocToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el) => el !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      // The last heading above the top quarter of the viewport, or the first
      // heading before any has been reached.
      const line = window.innerHeight / 4;
      const passed = headings.filter(
        (el) => el.getBoundingClientRect().top <= line,
      );
      setActiveId((passed.at(-1) ?? headings[0])?.id);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-slate-500 uppercase">
        <SliceMark className="bg-slate-300" />
        On this page
      </p>
      <ul className="mt-2 flex flex-col border-l border-slate-200">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === activeId ? "location" : undefined}
              className={`-ml-px block border-l-2 border-transparent py-1 text-slate-600 hover:border-slate-400 hover:text-slate-950 aria-[current=location]:border-sprout-500 aria-[current=location]:font-medium aria-[current=location]:text-cobalt-800 ${entry.depth === 3 ? "pl-7" : "pl-4"}`}
            >
              <CodeSpans text={entry.text} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
