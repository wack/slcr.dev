import Link from "next/link";
import { SliceDivider } from "@/components/decor";
import { GitHubLink } from "@/components/github-link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/security", label: "Security" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16">
      <SliceDivider to="fill-cobalt-950" />
      <div className="bg-cobalt-950 text-cobalt-100">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 pt-6 pb-12 text-sm">
          <div className="flex items-center gap-4">
            <Logo variant="white" decorative className="size-8" />
            <p>SLCR is an open standard for agent-native software requirements.</p>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-6">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-block py-1 underline-offset-4 hover:text-white hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <GitHubLink className="hover:text-white" />
          </nav>
          <div className="basis-full">
            <a
              href="https://launchnest.io/p/slcr-sliceable-linked-checkable-requirements"
              target="_blank"
              rel="noopener"
              className="inline-block"
            >
              {/* A plain <img>: the badge is a remote image, and next/image's
                default loader needs a server, which the static export lacks.
                180px wide is the smallest size at which the badge's small
                "LISTED ON" caption stays legible. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://launchnest.io/badge/slcr-sliceable-linked-checkable-requirements.svg?variant=listed&theme=light"
                alt="SLCR (Sliceable, Linked, Checkable Requirements) on LaunchNest"
                width={180}
                height={46}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
