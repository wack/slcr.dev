// Typography for rendered MDX (docs and content pages). Headings use the
// display font at >= 120% line height; body text keeps prose's 175%.
export const proseClasses = [
  "prose prose-slate",
  "prose-headings:font-display prose-headings:font-medium prose-headings:leading-tight prose-headings:tracking-tight",
  // Breathing room above a heading jumped to from the table of contents.
  "prose-headings:scroll-mt-8",
  "prose-h2:text-xl prose-h3:text-lg",
  "prose-a:font-medium prose-a:text-cobalt-700 prose-a:decoration-sprout-500 prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-cobalt-900",
  "prose-strong:text-slate-900",
  "prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
  // Shiki sets the theme's background inline on <pre>; keep ours.
  "prose-pre:rounded-none prose-pre:bg-slate-900!",
  // prose-code also matches the <code> inside <pre>; undo the inline-code chip there.
  "[&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "prose-blockquote:border-l-sprout-500",
  "marker:text-sprout-600",
].join(" ");
