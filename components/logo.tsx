// The SLCR mark. public/slcr-logo.svg is the full-color logo and
// public/slcr-logo-white.svg the one-color version for dark surfaces.
// `decorative` hides it from screen readers, for when "SLCR" is already in
// adjacent text.
export function Logo({
  variant = "color",
  decorative = false,
  className = "size-9",
}: {
  variant?: "color" | "white";
  decorative?: boolean;
  className?: string;
}) {
  return (
    // A plain <img>: the SVG needs no optimization, and next/image's default
    // loader is unavailable in a static export.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={variant === "white" ? "/slcr-logo-white.svg" : "/slcr-logo.svg"}
      alt={decorative ? "" : "SLCR"}
      width={164}
      height={164}
      className={className}
    />
  );
}
