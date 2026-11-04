"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";

const listingUrl = "https://devhunt.org/tool/slcr";
const bannerId = "devhunt-banner";
const storageKey = "slcr:devhunt-banner-dismissed";
// The launch week ends at the start of Monday, November 9, 2026 (UTC). The
// static export is built ahead of time, so the visitor's clock decides.
const endsAt = Date.UTC(2026, 10, 9);

function shouldHide() {
  if (Date.now() >= endsAt) {
    return true;
  }
  try {
    return localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
}

// Hides the banner during HTML parsing once the launch week is over or for
// visitors who already dismissed it, so it doesn't flash before React
// hydrates. The prerendered HTML can't know either. The script is inert when
// React renders it on the client (see "Preventing flash before hydration" in
// the Next.js docs).
const hideIfDone = `try{if(Date.now()>=${endsAt}||localStorage.getItem(${JSON.stringify(storageKey)})!==null)document.getElementById(${JSON.stringify(bannerId)}).hidden=true}catch(e){}`;

// Site-wide strip above the header announcing the DevHunt launch. Dismissal
// is remembered in localStorage, and the banner hides itself after `endsAt`.
// Remove this component (and its use in app/layout.tsx) when convenient.
export function DevHuntBanner() {
  const [hidden, setHidden] = useState(
    () => typeof window !== "undefined" && shouldHide(),
  );

  function dismiss() {
    setHidden(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // Private mode or storage disabled: hide it for this page view only.
    }
  }

  return (
    <>
      <aside
        id={bannerId}
        aria-label="Announcement"
        hidden={hidden}
        suppressHydrationWarning
        className="bg-cobalt-950 text-sm text-cobalt-100"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-2">
          <p className="flex-1 text-center">
            SLCR is live on DevHunt this week!{" "}
            <a
              href={listingUrl}
              className="font-semibold whitespace-nowrap text-sprout-400 underline-offset-4 hover:text-sprout-300 hover:underline"
            >
              Check out our listing
              <ArrowUpRight
                aria-hidden="true"
                className="ml-0.5 inline size-[0.9em] align-[-0.05em]"
                strokeWidth={2.25}
              />
              <span className="sr-only"> (external site)</span>
            </a>
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="-mr-1.5 p-1.5 transition-colors duration-300 ease-out hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={2.25} />
          </button>
        </div>
      </aside>
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: hideIfDone }}
      />
    </>
  );
}
