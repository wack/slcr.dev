"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link> & {
  href: string;
  // Also mark the link current on any page below `href`.
  matchNested?: boolean;
};

// A Link that sets aria-current="page" when it points at the current page.
// Style the current state with Tailwind's `aria-[current=page]:` variant.
export function NavLink({ href, matchNested, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const current =
    pathname === href || (matchNested && pathname.startsWith(`${href}/`));
  return (
    <Link href={href} aria-current={current ? "page" : undefined} {...props} />
  );
}
