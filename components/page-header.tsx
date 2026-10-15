import type { ReactNode } from "react";
import { Eyebrow, SliceDivider, SliceField } from "@/components/decor";

// Seeds each page's art from its title, so every page has its own pattern.
function seedFrom(text: string) {
  let h = 0;
  for (const ch of text) {
    h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0;
  }
  return h;
}

// The top band of a main site page: eyebrow, title, description, and art.
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="relative overflow-hidden bg-slate-50">
        <div className="bg-triangle-grid absolute inset-0 mask-l-from-10% opacity-70" />
        <div className="relative mx-auto flex w-full max-w-6xl items-end justify-between gap-10 px-6 pt-16 pb-6">
          <div className="max-w-2xl motion-safe:animate-rise">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-4 text-3xl sm:text-4xl">{title}</h1>
            {description && (
              <p className="mt-4 text-lg text-slate-600">{description}</p>
            )}
            {children}
          </div>
          <SliceField
            cols={8}
            rows={3}
            seed={seedFrom(title)}
            animated
            className="hidden w-80 shrink-0 md:grid lg:w-96"
          />
        </div>
      </div>
      <SliceDivider from="bg-slate-50" to="fill-white" accent={false} />
    </>
  );
}
