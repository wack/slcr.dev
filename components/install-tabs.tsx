"use client";

import { Check, Copy } from "lucide-react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

// TODO: placeholders until the CLI, skill, and MCP server are published.
const options = [
  {
    label: "Prompt",
    command:
      "Set up SLCR requirements for this project by following https://slcr.dev/docs/getting-started/quickstart",
    mono: false,
  },
  { label: "CLI", command: "cargo install slcr", mono: true },
  { label: "Skill", command: "npx skills add wack/slcr", mono: true },
  { label: "MCP", command: "claude mcp add slcr -- slcr mcp", mono: true },
];

// Tabs of copy-paste commands, one per way to get started. Follows the WAI-ARIA
// tabs pattern: arrow keys, Home, and End move between tabs, and Tab moves on
// to the copy button. The copy result is announced through a live region.
export function InstallTabs() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function select(index: number) {
    setSelected(index);
    setStatus("idle");
    tabs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = options.length - 1;
    const next = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(options[selected].command);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Ways to get started"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-center gap-1"
      >
        {options.map((option, i) => {
          const active = i === selected;
          // The chip is clipped on an inner span: clip-path would also clip
          // the button's focus outline.
          return (
            <button
              key={option.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={active}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(i)}
              className="group/tab"
            >
              <span
                className={`clip-slice-corner block px-3 py-1 transition-colors duration-200 [--slice-size:8px] ${
                  active
                    ? "bg-cobalt-950 text-white"
                    : "text-slate-600 group-hover/tab:bg-slate-100 group-hover/tab:text-slate-950"
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="mt-3 h-0.5 bg-linear-to-r from-sprout-500 via-lagoon-500 to-cobalt-800 mask-r-from-40%"
      />

      {/* Every panel sits in the same grid cell and the inactive ones are
          only made invisible, so the box keeps the height of the tallest
          command and switching tabs doesn't resize the hero. */}
      <div className="grid">
        {options.map((option, i) => (
          <div
            key={option.label}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            className={`col-start-1 row-start-1 flex items-start justify-between gap-4 pt-3 ${
              i === selected ? "" : "invisible"
            }`}
          >
            <p
              className={`py-1.5 text-slate-950 [overflow-wrap:anywhere] ${option.mono ? "font-mono text-sm" : ""}`}
            >
              {option.command}
            </p>
            <button
              type="button"
              onClick={copy}
              aria-label={`Copy ${option.label} command`}
              className="grid size-9 shrink-0 place-items-center text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950"
            >
              <Copy
                aria-hidden="true"
                strokeWidth={2}
                className={`col-start-1 row-start-1 size-4.5 transition-[opacity,scale] duration-200 ${
                  status === "copied" ? "scale-50 opacity-0" : ""
                }`}
              />
              <Check
                aria-hidden="true"
                strokeWidth={2.5}
                className={`col-start-1 row-start-1 size-4.5 text-sprout-700 transition-[opacity,scale] duration-200 ${
                  status === "copied" ? "" : "scale-50 opacity-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <p role="status" className="sr-only">
        {status === "copied" && "Copied to clipboard"}
        {status === "failed" &&
          "Couldn't copy. Select the command and copy it manually."}
      </p>
    </div>
  );
}
