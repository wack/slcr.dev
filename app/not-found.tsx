import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { PageHeader } from "@/components/page-header";

// Served as out/404.html for every unknown URL. Next.js adds
// <meta name="robots" content="noindex"> itself.
export const metadata: Metadata = {
  title: "Page not found",
};

// Where most visitors who hit a dead link were probably headed.
const suggestions = [
  { href: "/docs/overview", label: "What is SLCR?" },
  { href: "/docs/getting-started/quickstart", label: "Quickstart" },
  { href: "/docs/getting-started/installation", label: "Installation" },
  { href: "/docs/reference/cli", label: "CLI reference" },
];

export default function NotFound() {
  return (
    <main>
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="There's nothing at this address. The page may have moved, or the link may have a typo."
      />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/docs">Browse the docs</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Go to the home page
          </ButtonLink>
        </div>
        <h2 className="mt-12 text-lg">Popular pages</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-medium text-cobalt-700 underline decoration-sprout-500 decoration-2 underline-offset-4 hover:text-cobalt-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
