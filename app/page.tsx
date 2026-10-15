import type { ReactNode } from "react";
import { ButtonLink } from "@/components/button";
import { InstallTabs } from "@/components/install-tabs";
import {
  Eyebrow,
  reveal,
  SliceCorner,
  SliceDivider,
  SliceField,
} from "@/components/decor";

const githubUrl = "https://github.com/wack/slcr";
const specHref = "/docs/reference/specification";

const principles = [
  {
    letter: "S",
    glyph: "text-sprout-600",
    corner: "bg-sprout-500",
    title: "Sliceable",
    body: "Hand an agent one requirement and the context it links to. The rest of the spec stays out of its context window.",
  },
  {
    letter: "L",
    glyph: "text-lagoon-600",
    corner: "bg-lagoon-500",
    title: "Linked",
    body: "Requirements refine and depend on each other, and combine with AND, OR, and XOR.",
  },
  {
    letter: "C",
    glyph: "text-cobalt-800",
    corner: "bg-cobalt-800",
    title: "Checkable",
    body: (
      <>
        Acceptance criteria map to validators such as tests, linters, and agent
        checks. <code>slcr check</code> reports what&apos;s met.
      </>
    ),
  },
  {
    letter: "R",
    glyph: "text-slate-600",
    corner: "bg-slate-500",
    title: "Requirements",
    body: "As agents write more code, teams are moving to spec-driven development. SLCR makes the spec a first-class artifact with a standard format.",
  },
];

// Outline of the example spec. Rows in the agent slice carry `linked`: the
// classes that highlight the row while its slice node is hovered. (Written
// out in full so Tailwind can find them.)
const outline: {
  id: string;
  title: string;
  depth: number;
  linked?: string;
}[] = [
  { id: "SEC-002", title: "Views", depth: 0 },
  { id: "REQ-001", title: "TodoListItem endpoint", depth: 1 },
  {
    id: "REQ-002",
    title: "POST creates an item",
    depth: 2,
    linked: "group-has-[[data-node=REQ-002]:hover]/views:bg-lagoon-100",
  },
  {
    id: "REQ-004",
    title: "Request is authenticated",
    depth: 2,
    linked: "group-has-[[data-node=REQ-004]:hover]/views:bg-lagoon-100",
  },
  {
    id: "REQ-003",
    title: "GET reads an item",
    depth: 2,
    linked: "group-has-[[data-node=REQ-003]:hover]/views:bg-lagoon-100",
  },
  { id: "SEC-003", title: "Controllers", depth: 0 },
  { id: "REQ-005", title: "TodoListItem controller", depth: 1 },
  { id: "REQ-006", title: "Validates the request payload", depth: 2 },
  { id: "SEC-004", title: "Models", depth: 0 },
  { id: "REQ-007", title: "Table todo_list_item exists", depth: 1 },
];

// `linked` highlights the node while its outline row is hovered.
const slice = [
  {
    id: "REQ-004",
    title: "Request is authenticated",
    meta: "MUST · refines REQ-002, REQ-003",
    body: "The request MUST be authenticated.",
    focus: true,
    linked: "group-has-[[data-row=REQ-004]:hover]/views:bg-lagoon-50",
  },
  {
    id: "REQ-002",
    title: "POST creates an item",
    meta: "MUST · refines REQ-001",
    linked: "group-has-[[data-row=REQ-002]:hover]/views:bg-lagoon-50",
  },
  {
    id: "REQ-003",
    title: "GET reads an item",
    meta: "MUST · refines REQ-001",
    linked: "group-has-[[data-row=REQ-003]:hover]/views:bg-lagoon-50",
  },
];

const steps: { title: string; body: ReactNode; code: string }[] = [
  {
    title: "Write a requirement",
    body: "In JSON, TOML, or YAML, with acceptance criteria.",
    code: `# SPEC.slcr.yaml (excerpt)
- kind: requirement
  id: REQ-007
  title: Table todo_list_item exists
  body: There MUST be a table \`todo_list_item\`.
  modality: MUST
  acceptanceCriteria:
    - kind: acceptanceCriterion
      id: AC-001
      title: Table schema is declared`,
  },
  {
    title: "Attach a validator",
    body: "Use any tool you declare: tests, linters, browser tests, or agents.",
    code: `# db/.validators.slcr.toml (excerpt)
[[validator]]
requirement = "todo-api/REQ-007"
criterion = "AC-001"
tool = "ast-grep"
with = { rule = "rules/todo-table.yml" }`,
  },
  {
    title: "Run the check",
    body: (
      <>
        <span className="text-red-300">Red</span> before you build it,{" "}
        <span className="text-sprout-400">green</span> after. Runs in CI.
      </>
    ),
    code: `$ slcr init
$ slcr check`,
  },
];

const projectParts: {
  title: string;
  href?: string;
  body: ReactNode;
  mark: string;
}[] = [
  {
    title: "Specification",
    href: specHref,
    body: "JSON Schemas, satisfaction semantics, and slice rules.",
    mark: "border-sprout-500",
  },
  {
    title: "slcr CLI",
    href: githubUrl,
    body: "Reference implementation in Rust.",
    mark: "border-lagoon-500",
  },
  {
    // TODO: link to the agent skill once it is published.
    title: "Agent skill",
    body: "Teaches agents to write SLCR and use the CLI.",
    mark: "border-cobalt-800",
  },
];

const wrap = "mx-auto w-full max-w-6xl px-6";
const muted = "text-slate-600";

function Section({
  label,
  title,
  className = "bg-white",
  children,
}: {
  label: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <div className={`${wrap} py-16`}>
        <div {...reveal()}>
          <Eyebrow>{label}</Eyebrow>
          {title && (
            <h2 className="mt-4 max-w-3xl text-2xl sm:text-3xl">{title}</h2>
          )}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

// Focusable so keyboard users can scroll it when it overflows (WCAG 2.1.1).
function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="overflow-x-auto border border-cobalt-800 bg-cobalt-900 p-4 font-mono text-sm text-cobalt-50 transition-colors duration-300 hover:border-lagoon-500"
    >
      <code>{code}</code>
    </pre>
  );
}

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="bg-triangle-grid absolute inset-0 mask-b-from-50% mask-l-from-60%" />
        {/* Desktop: a field of slices bleeding off the right edge. */}
        <div className="absolute inset-y-0 right-0 hidden w-[44%] items-center lg:flex">
          <SliceField
            cols={8}
            rows={7}
            seed={7}
            animated
            className="w-full translate-x-8"
          />
        </div>
        <div className={`${wrap} relative py-20 lg:py-28`}>
          <div className="max-w-xl xl:max-w-2xl">
            <p className="font-mono text-sm font-medium tracking-wider text-slate-600 uppercase motion-safe:animate-rise">
              Sliceable, Linked, Checkable Requirements
            </p>
            <h1 className="mt-5 text-3xl motion-safe:animate-rise motion-safe:[animation-delay:100ms] sm:text-4xl">
              A specification for software requirements that agents can read in{" "}
              <span className="text-slcr-gradient">slices</span> and tools can
              check.
            </h1>
            <p
              className={`mt-6 text-lg motion-safe:animate-rise motion-safe:[animation-delay:200ms] ${muted}`}
            >
              Give each agent only the requirements its task needs, then verify
              the result with the tools you already use.
            </p>
            <div className="mt-10 max-w-lg motion-safe:animate-rise motion-safe:[animation-delay:300ms]">
              <InstallTabs />
            </div>
          </div>
        </div>
        {/* Mobile and tablet: a strip of slices under the text. */}
        <SliceField
          cols={12}
          rows={2}
          seed={7}
          animated
          className="relative -mt-8 mb-4 w-full px-6 lg:hidden"
        />
      </section>

      <SliceDivider to="fill-slate-50" accent={false} />
      <Section
        label="Why SLCR"
        title="Long prose specs cause context rot, and agent errors compound across tasks"
        className="bg-slate-50"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <div
              key={p.title}
              {...reveal(i + 1)}
              className="relative bg-white p-6 ring-1 ring-slate-200"
            >
              <SliceCorner className={`size-10 ${p.corner}`} />
              <span
                aria-hidden="true"
                className={`font-display text-4xl font-semibold ${p.glyph}`}
              >
                {p.letter}
              </span>
              <h3 className="mt-3 text-lg">{p.title}</h3>
              <p className={`mt-2 ${muted}`}>{p.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <SliceDivider from="bg-slate-50" to="fill-white" flip accent={false} />

      <Section
        label="One source"
        title="Documents for people, slices for agents"
      >
        <figure className="group/views">
          <div className="grid gap-6 md:grid-cols-2">
            <div {...reveal(1)} className="ring-1 ring-slate-200">
              <div className="flex justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs text-slate-500">
                <span className="font-medium text-slate-950">
                  Rendered spec
                </span>
                <span>todo-api</span>
              </div>
              <ul className="py-2 text-sm">
                {outline.map((row) => (
                  <li
                    key={row.id}
                    data-row={row.linked ? row.id : undefined}
                    className={`grid grid-cols-[5rem_1fr] gap-2 px-4 py-1 transition-colors duration-200 ${
                      row.linked
                        ? `bg-lagoon-50 text-slate-950 shadow-[inset_3px_0] shadow-lagoon-500 hover:bg-lagoon-100 ${row.linked}`
                        : row.depth === 0
                          ? "mt-1 font-semibold text-slate-950"
                          : muted
                    }`}
                  >
                    <span
                      className={`font-mono text-xs leading-5 ${row.linked ? "text-lagoon-700" : "text-slate-500"}`}
                    >
                      {row.id}
                    </span>
                    <span
                      style={{
                        paddingLeft: `${Math.max(row.depth - 1, 0)}rem`,
                      }}
                    >
                      {row.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div {...reveal(2)} className="ring-1 ring-slate-200">
              <div className="flex justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs text-slate-500">
                <span className="font-medium text-slate-950">Agent slice</span>
                <span>REQ-004</span>
              </div>
              <div className="flex flex-col gap-2 p-2 text-sm">
                {slice.map((node) => (
                  <div
                    key={node.id}
                    data-node={node.id}
                    className={`flex flex-col gap-0.5 border-l-3 py-1 pr-2 pl-3 transition-colors duration-200 hover:bg-lagoon-50 ${node.linked} ${
                      node.focus ? "border-cobalt-800" : "border-lagoon-500"
                    }`}
                  >
                    <strong className="text-slate-950">
                      {node.id} · {node.title}
                    </strong>
                    <span className="font-mono text-xs text-slate-600">
                      {node.meta}
                    </span>
                    {node.body && <span>{node.body}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <figcaption className="mt-4 text-sm text-slate-500">
            Hover a requirement to see where it sits in the full document.
          </figcaption>
        </figure>
      </Section>

      <SliceDivider to="fill-cobalt-950" />
      <section className="bg-cobalt-950 text-cobalt-100">
        <div className={`${wrap} py-16`}>
          <div {...reveal()}>
            <Eyebrow
              as="h2"
              className="text-cobalt-200"
              markClassName="bg-lagoon-400"
            >
              How it works
            </Eyebrow>
          </div>
          <ol className="mt-10 flex flex-col gap-12">
            {steps.map((step, i) => (
              <li
                key={step.title}
                {...reveal()}
                className="grid gap-5 md:grid-cols-[1fr_2fr]"
              >
                <div>
                  <h3 className="flex items-baseline gap-3 text-lg text-white">
                    <span className="font-mono text-sm text-sprout-400">
                      0{i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-2">{step.body}</p>
                </div>
                <CodeBlock code={step.code} label={`Example: ${step.title}`} />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <SliceDivider from="bg-cobalt-950" to="fill-white" flip accent={false} />

      <Section
        label="The project"
        title="An open standard with a reference implementation"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {projectParts.map((part, i) => (
            <div
              key={part.title}
              {...reveal(i + 1)}
              className={`border-t-3 pt-5 ${part.mark}`}
            >
              <h3 className="text-lg">
                {part.href ? (
                  <a
                    href={part.href}
                    className="underline decoration-sprout-500 decoration-2 underline-offset-4 transition-colors hover:text-cobalt-800 hover:decoration-cobalt-800"
                  >
                    {part.title}
                  </a>
                ) : (
                  part.title
                )}
              </h3>
              <p className={`mt-2 ${muted}`}>{part.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className={`${wrap} pt-4`}>
        <div
          {...reveal()}
          className="relative overflow-hidden bg-sprout-50 px-8 py-12 sm:px-12"
        >
          {/* Two shapes meeting at a hard edge; each has a single fill. */}
          <div
            aria-hidden="true"
            className="clip-tri-br bg-slcr-tri-br absolute inset-y-0 right-0 hidden w-1/3 md:block"
          />
          <div
            aria-hidden="true"
            className="clip-tri-tr absolute top-0 right-0 hidden h-1/2 w-1/6 bg-cobalt-900 md:block"
          />
          <div className="relative max-w-xl">
            <Eyebrow markClassName="bg-sprout-600">Contribute</Eyebrow>
            <h2 className="mt-4 text-2xl sm:text-3xl">
              SLCR is early. Try it and tell us what breaks.
            </h2>
            <p className="mt-4 text-slate-700">
              Issues, format feedback, tool descriptors, and pull requests are
              all welcome.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={githubUrl}>View on GitHub</ButtonLink>
              <ButtonLink href={`${githubUrl}/issues`} variant="secondary">
                Open an issue
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
