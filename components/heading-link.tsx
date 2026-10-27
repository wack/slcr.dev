"use client";

import { Check, LinkIcon } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";

type Level = "h2" | "h3" | "h4";

// A heading with a link to itself after its text, shown while the heading is
// hovered or the link is focused (and always on touch screens). Clicking
// follows the link as usual, so the address bar gets the #fragment, and also
// copies the full URL. Without JS it is a plain anchor link.
export function LinkedHeading({
  as: Tag,
  id,
  className,
  children,
  ...props
}: ComponentProps<Level> & { as: Level }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  // Headings always get an id (lib/headings.ts), but don't link to nothing.
  if (!id) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const onClick = () => {
    const url = new URL(`#${id}`, window.location.href).href;
    navigator.clipboard?.writeText(url).then(
      () => setCopied(true),
      // Clipboard access can be denied; the link still works.
      () => {},
    );
  };

  const Icon = copied ? Check : LinkIcon;

  return (
    <Tag id={id} className={`group ${className ?? ""}`} {...props}>
      {children}
      {/* The icon follows the last word without a line break between them. */}
      <span className="whitespace-nowrap">
        &#8288;
        <a
          href={`#${id}`}
          onClick={onClick}
          className="not-prose ml-2 inline-flex align-middle text-slate-400 opacity-0 hover:text-cobalt-700 focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100 motion-safe:transition-opacity"
        >
          <Icon
            aria-hidden="true"
            className={`size-[0.8em] ${copied ? "text-sprout-600" : ""}`}
            strokeWidth={2.25}
          />
          <span className="sr-only">Link to this section</span>
        </a>
      </span>
      <span role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </Tag>
  );
}
