import Link from "next/link";
import { SliceDivider } from "@/components/decor";
import { Logo } from "@/components/logo";

const links = [{ href: "/code-of-conduct", label: "Code of Conduct" }];

export function SiteFooter() {
  return (
    <footer className="mt-16">
      <SliceDivider to="fill-cobalt-950" />
      <div className="bg-cobalt-950 text-cobalt-100">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 pt-6 pb-12 text-sm">
          <div className="flex items-center gap-4">
            <Logo variant="white" decorative className="size-8" />
            <p>SLCR is an open standard.</p>
          </div>
          <nav aria-label="Footer" className="flex gap-6">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-block py-1 underline-offset-4 hover:text-white hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
