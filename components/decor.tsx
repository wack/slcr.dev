// Decorative "slice" shapes. All are aria-hidden and purely visual.
import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";

// A small right triangle, used as a bullet before labels.
export function SliceMark({
  className = "bg-sprout-500",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`clip-tri-br inline-block size-3.5 shrink-0 ${className}`}
    />
  );
}

// A small uppercase label above a heading.
// Use `as="h2"` when the label is the section's only heading.
export function Eyebrow({
  children,
  markClassName,
  className = "text-slate-600",
  as: Tag = "p",
}: {
  children: ReactNode;
  markClassName?: string;
  className?: string;
  as?: "p" | "h2";
}) {
  return (
    <Tag
      className={`flex items-center gap-2.5 font-mono text-sm font-medium tracking-wider uppercase ${className}`}
    >
      <SliceMark className={markClassName} />
      {children}
    </Tag>
  );
}

// A triangle in the corner of a `relative` container, e.g. a card. Include a
// size-* class; add e.g. `group-hover:size-16` to grow it on hover.
export function SliceCorner({
  className = "size-10 bg-sprout-500",
  corner = "tr",
}: {
  className?: string;
  corner?: "tl" | "tr" | "bl" | "br";
}) {
  const position = {
    tl: "top-0 left-0 clip-tri-tl",
    tr: "top-0 right-0 clip-tri-tr",
    bl: "bottom-0 left-0 clip-tri-bl",
    br: "bottom-0 right-0 clip-tri-br",
  }[corner];
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute transition-all duration-300 ease-out ${position} ${className}`}
    />
  );
}

/*
 * A full-width diagonal transition between two sections. The area above the
 * slope is `from` (a bg-* class, transparent by default) and the area below it
 * is `to` (a fill-* class). A thin logo-gradient sliver runs along the slope.
 */
export function SliceDivider({
  from = "",
  to,
  flip = false,
  accent = true,
}: {
  from?: string;
  to: string;
  flip?: boolean;
  accent?: boolean;
}) {
  const gradientId = useId();
  return (
    <div aria-hidden="true" className={from}>
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={`block h-12 w-full md:h-20 ${flip ? "-scale-x-100" : ""}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#60ae00" />
            <stop offset="0.33" stopColor="#00ad0f" />
            <stop offset="0.66" stopColor="#00ad97" />
            <stop offset="1" stopColor="#0028ad" />
          </linearGradient>
        </defs>
        {accent && (
          <polygon points="0,78 0,96 1440,0" fill={`url(#${gradientId})`} />
        )}
        <polygon points="0,96 1440,0 1440,96" className={to} />
      </svg>
    </div>
  );
}

// A half of a SliceGrid cell: a bg-* class (solid or a linear gradient), or
// null for empty. Never a conic gradient: one shape gets one kind of fill.
export type SliceFill = string | null;

export type SliceCell = {
  // "\" splits top-left to bottom-right; "/" splits bottom-left to top-right.
  split: "\\" | "/";
  // Fill of the upper and lower halves.
  upper: SliceFill;
  lower: SliceFill;
};

const halvesBySplit = {
  "\\": ["clip-tri-tr", "clip-tri-bl"],
  "/": ["clip-tri-tl", "clip-tri-br"],
} as const;

/*
 * A grid of squares, each sliced diagonally into two triangles. With
 * `animated`, triangles pop in one after another on load, and some shimmer.
 */
export function SliceGrid({
  cells,
  cols,
  animated = false,
  className = "",
}: {
  cells: SliceCell[];
  cols: number;
  animated?: boolean;
  className?: string;
}) {
  let filled = 0;
  return (
    <div
      aria-hidden="true"
      className={`grid gap-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) => (
        <div key={i} className="relative aspect-square">
          {[cell.upper, cell.lower].map((fill, h) => {
            if (!fill) {
              return null;
            }
            const n = filled++;
            const motion = !animated
              ? ""
              : n % 7 === 3
                ? "motion-safe:animate-slice-shimmer"
                : "motion-safe:animate-slice-in";
            return (
              <span
                key={h}
                className={`absolute inset-0 ${halvesBySplit[cell.split][h]} ${fill} ${motion}`}
                style={
                  animated
                    ? ({
                        "--slice-delay": `${(i % cols) * 70 + Math.floor(i / cols) * 40}ms`,
                      } as CSSProperties)
                    : undefined
                }
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Fills for SliceField, from light to dark in logo order (sprout, lagoon,
// cobalt). Gradients run between neighboring colors so each triangle is one
// soft blend. Full class names, so Tailwind can find them.
const fieldSolids = [
  "bg-sprout-100",
  "bg-sprout-300",
  "bg-sprout-500",
  "bg-leaf-500",
  "bg-lagoon-300",
  "bg-lagoon-500",
  "bg-lagoon-600",
  "bg-cobalt-600",
  "bg-cobalt-800",
  "bg-cobalt-900",
];
const fieldGradients = [
  "bg-linear-to-br from-sprout-300 to-sprout-500",
  "bg-linear-to-br from-sprout-500 to-leaf-500",
  "bg-linear-to-br from-leaf-500 to-lagoon-500",
  "bg-linear-to-br from-lagoon-400 to-lagoon-600",
  "bg-linear-to-br from-lagoon-500 to-cobalt-700",
  "bg-linear-to-br from-cobalt-600 to-cobalt-900",
];

// Small deterministic PRNG, so a field renders the same at build and hydration.
function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/*
 * A procedural SliceGrid: sparse and light on the left, dense and dark on the
 * right, so it fades toward adjacent text. Same `seed`, same pattern.
 */
export function SliceField({
  cols,
  rows,
  seed = 1,
  density = 1,
  animated = false,
  className = "",
}: {
  cols: number;
  rows: number;
  seed?: number;
  density?: number;
  animated?: boolean;
  className?: string;
}) {
  const rand = random(seed);
  const cells: SliceCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cols > 1 ? c / (cols - 1) : 1;
      const y = rows > 1 ? r / (rows - 1) : 0;
      const pick = (): SliceFill => {
        if (rand() > density * (0.06 + 0.8 * x ** 1.4)) {
          return null;
        }
        const t = Math.min(
          0.999,
          Math.max(0, 0.7 * x + 0.3 * y + (rand() - 0.5) * 0.35),
        );
        return rand() < 0.3
          ? fieldGradients[Math.floor(t * fieldGradients.length)]
          : fieldSolids[Math.floor(t * fieldSolids.length)];
      };
      cells.push({
        split: rand() < 0.5 ? "/" : "\\",
        upper: pick(),
        lower: pick(),
      });
    }
  }
  return (
    <SliceGrid
      cells={cells}
      cols={cols}
      animated={animated}
      className={className}
    />
  );
}

// Props that make an element fade up as it scrolls into view. `step` staggers
// siblings. See components/scroll-reveal.tsx.
export function reveal(step = 0) {
  return {
    "data-reveal": "",
    style: { "--reveal-delay": `${step * 90}ms` } as CSSProperties,
  };
}
