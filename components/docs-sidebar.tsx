import { SliceMark } from "@/components/decor";
import { NavLink } from "@/components/nav-link";
import { docHref, getDocSections } from "@/lib/docs";

export function DocsSidebar() {
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6 text-sm">
      <NavLink
        href="/docs"
        className="font-display text-sm font-medium text-slate-950 hover:text-cobalt-800"
      >
        Documentation
      </NavLink>
      {getDocSections().map((section) => (
        <div key={section.key}>
          <p className="flex items-center gap-2 font-mono text-xs font-medium tracking-widest text-slate-500 uppercase">
            <SliceMark className="bg-slate-300" />
            {section.title}
          </p>
          <ul className="mt-2 flex flex-col border-l border-slate-200">
            {section.docs.map((doc) => (
              <li key={doc._meta.path}>
                <NavLink
                  href={docHref(doc)}
                  className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-slate-700 hover:border-slate-400 hover:text-slate-950 aria-[current=page]:border-sprout-500 aria-[current=page]:font-medium aria-[current=page]:text-cobalt-800"
                >
                  {doc.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
