import type { ComponentProps } from "react";

// Element overrides for rendered MDX (docs and content pages). Pass as the
// `components` prop of <MDXContent>.
export const mdxComponents = {
  // Code blocks can overflow sideways; focusable so keyboard users can
  // scroll them (WCAG 2.1.1).
  pre: (props: ComponentProps<"pre">) => <pre tabIndex={0} {...props} />,
};
