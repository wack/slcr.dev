import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

// Absolute http(s) URLs to any host other than this site. Relative links,
// anchors, and mailto: links are on-site.
function isOffsite(href: string | undefined) {
  if (!href || !/^https?:\/\//i.test(href)) {
    return false;
  }
  const host = new URL(href).hostname;
  return host !== "slcr.dev" && !host.endsWith(".slcr.dev");
}

// Every offsite link gets the same arrow as external buttons
// (components/button.tsx), so authors never add it by hand. The icon follows
// the last word without a line break between them.
function MdxLink({ href, children, ...props }: ComponentProps<"a">) {
  if (!isOffsite(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
      <span className="whitespace-nowrap">
        &#8288;
        <ArrowUpRight
          aria-hidden="true"
          className="ml-0.5 inline size-[0.9em] align-[-0.05em]"
          strokeWidth={2.25}
        />
      </span>
      <span className="sr-only"> (external site)</span>
    </a>
  );
}

// Element overrides for rendered MDX (docs and content pages). Pass as the
// `components` prop of <MDXContent>.
export const mdxComponents = {
  a: MdxLink,
  // Code blocks can overflow sideways; focusable so keyboard users can
  // scroll them (WCAG 2.1.1).
  pre: (props: ComponentProps<"pre">) => <pre tabIndex={0} {...props} />,
};
