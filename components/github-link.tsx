export const githubUrl = "https://github.com/wack/slcr";

// lucide-react no longer ships brand icons, so this is GitHub's Octicon mark.
function GitHubMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

// Icon-only link to the SLCR repository, for the header and footer.
export function GitHubLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={githubUrl}
      aria-label="SLCR on GitHub"
      className={`inline-flex p-1 transition-colors duration-300 ease-out ${className}`}
    >
      <GitHubMark className="size-5" />
    </a>
  );
}

// Compact "Star on GitHub" button for the header, styled like the selected
// tab in the hero's InstallTabs: a cobalt-950 chip with a small sliced corner
// that widens on hover. The chip is clipped on an inner span because
// clip-path would also clip the link's focus outline. Below `sm` the label
// shortens to "Star" so the nav still fits on a phone.
export function GitHubStarButton() {
  return (
    <a href={githubUrl} aria-label="Star SLCR on GitHub" className="group">
      <span className="clip-slice-corner flex items-center gap-2 bg-cobalt-950 px-3 py-1 text-white transition-[background-color,--slice-size] duration-300 ease-out [--slice-size:8px] group-hover:bg-cobalt-800 group-hover:[--slice-size:12px]">
        <GitHubMark className="size-4" />
        <span>
          Star<span className="hidden sm:inline"> on GitHub</span>
        </span>
      </span>
    </a>
  );
}
