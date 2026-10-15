import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Every button is an outer box with a sliced corner around an inner label.
// The corner widens on hover (see `clip-slice-corner` in globals.css).
const outerBase =
  "clip-slice-corner group inline-flex text-sm font-semibold transition-[background-color,--slice-size] duration-300 ease-out hover:[--slice-size:20px] focus-visible:outline-none";
const innerBase = "inline-flex items-center gap-2";

const variants = {
  // The brand's primary action color (#60AE00) needs dark text for contrast.
  primary: {
    outer:
      "bg-sprout-500 text-cobalt-950 hover:bg-sprout-400 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-cobalt-950",
    inner: "px-5 py-3",
  },
  // A 2px cobalt outline that follows the sliced corner: the outer box is the
  // outline and the inner label, cut ~1.17px less, is the fill. That offset
  // keeps the diagonal edge as thick as the straight ones.
  secondary: {
    outer: "bg-cobalt-800 p-0.5 text-cobalt-900",
    inner:
      "clip-slice-corner bg-white px-4.5 py-2.5 transition-[background-color,--slice-size] duration-300 ease-out [--slice-size:10.83px] group-hover:bg-cobalt-50 group-hover:[--slice-size:18.83px] group-focus-visible:bg-cobalt-50 group-focus-visible:ring-3 group-focus-visible:ring-cobalt-600 group-focus-visible:ring-inset",
  },
  // For dark surfaces.
  inverse: {
    outer:
      "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-white",
    inner: "px-5 py-3",
  },
};

export type ButtonVariant = keyof typeof variants;

// A link styled as a button. External URLs render a plain <a> and an
// up-right arrow; internal ones use next/link and a right arrow. The arrow
// nudges in its direction on hover.
export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  const { outer, inner } = variants[variant];
  const external = /^https?:/.test(href);
  const label = (
    <span className={`${innerBase} ${inner}`}>
      {children}
      {external ? (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.25}
        />
      ) : (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
          strokeWidth={2.25}
        />
      )}
    </span>
  );
  const className = `${outerBase} ${outer}`;
  if (external) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
