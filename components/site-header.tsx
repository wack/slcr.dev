import Link from "next/link";
import { GitHubLink } from "@/components/github-link";
import { Logo } from "@/components/logo";
import { NavLink } from "@/components/nav-link";

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="SLCR home">
          <Logo className="size-10" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              matchNested
              className="bg-linear-to-r from-sprout-500 to-sprout-500 bg-size-[0%_2px] bg-bottom-left bg-no-repeat py-1 text-slate-700 transition-[background-size,color] duration-300 ease-out hover:bg-size-[100%_2px] hover:text-cobalt-800 aria-[current=page]:bg-size-[100%_2px] aria-[current=page]:text-cobalt-800"
            >
              {item.label}
            </NavLink>
          ))}
          <GitHubLink className="text-slate-700 hover:text-cobalt-800" />
        </nav>
      </div>
    </header>
  );
}
