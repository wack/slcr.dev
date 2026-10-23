// Doc titles and descriptions are plain frontmatter strings, but may wrap
// commands in backticks, e.g. "Troubleshoot `slcr check`". Odd-numbered parts
// of a split on "`" are the code spans, styled like inline code in MDX prose
// (see `proseClasses` in lib/styles.ts).
export function CodeSpans({ text }: { text: string }) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-slate-100 px-[0.25em] py-[0.1em] font-mono text-[0.9em] font-normal"
      >
        {part}
      </code>
    ) : (
      part
    ),
  );
}

// The text without backticks, for <title>, meta tags, and other places that
// can't hold markup.
export function plainText(text: string) {
  return text.replaceAll("`", "");
}
