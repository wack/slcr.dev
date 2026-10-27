"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";

// Display names for fence languages. Anything else is shown as written.
const languageNames: Record<string, string> = {
  bash: "Shell",
  sh: "Shell",
  shell: "Shell",
  console: "Terminal",
  json: "JSON",
  markdown: "Markdown",
  md: "Markdown",
  text: "Text",
  toml: "TOML",
  yaml: "YAML",
  yml: "YAML",
};

// What the copy button copies. For a terminal session that's only the
// commands, without their `$ ` prompts or output; otherwise the whole block.
function copyText(text: string, language: string) {
  if (language === "console") {
    const commands = text
      .split("\n")
      .filter((line) => line.startsWith("$ "))
      .map((line) => line.slice(2));
    if (commands.length > 0) {
      return commands.join("\n");
    }
  }
  return text.trimEnd();
}

// A fenced code block (highlighted by Shiki at build time; see
// content-collections.ts) under a header naming its language, with a button
// that copies its contents. The copy result is announced through a live
// region. Without JS the button does nothing, but the code is all there.
export function CodeBlock({
  "data-language": language = "text",
  className,
  ...props
}: ComponentProps<"pre"> & { "data-language"?: string }) {
  const pre = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  const copy = () => {
    const text = copyText(pre.current?.textContent ?? "", language);
    navigator.clipboard?.writeText(text).then(
      () => setStatus("copied"),
      () => setStatus("failed"),
    );
  };

  const name = languageNames[language] ?? language;

  return (
    <div>
      {/* Takes over the top margin prose gives <pre>. */}
      <div className="not-prose mt-[1.7142857em] flex items-center justify-between bg-slate-800 py-1 pr-1 pl-4">
        <span className="font-mono text-xs text-slate-300">{name}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${name} code`}
          className="grid size-8 place-items-center text-slate-300 motion-safe:transition-colors motion-safe:duration-200 hover:bg-slate-700 hover:text-white"
        >
          <Copy
            aria-hidden="true"
            strokeWidth={2}
            className={`col-start-1 row-start-1 size-4 motion-safe:transition-[opacity,scale] motion-safe:duration-200 ${
              status === "copied" ? "scale-50 opacity-0" : ""
            }`}
          />
          <Check
            aria-hidden="true"
            strokeWidth={2.5}
            className={`col-start-1 row-start-1 size-4 text-sprout-400 motion-safe:transition-[opacity,scale] motion-safe:duration-200 ${
              status === "copied" ? "" : "scale-50 opacity-0"
            }`}
          />
        </button>
      </div>
      {/* Code blocks can overflow sideways; focusable so keyboard users can
          scroll them (WCAG 2.1.1). */}
      <pre
        ref={pre}
        tabIndex={0}
        className={`mt-0! ${className ?? ""}`}
        {...props}
      />
      <p role="status" className="sr-only">
        {status === "copied" && "Copied to clipboard"}
        {status === "failed" &&
          "Couldn't copy. Select the code and copy it manually."}
      </p>
    </div>
  );
}
