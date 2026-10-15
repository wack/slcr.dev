"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Fades `data-reveal` elements up once as they scroll into view (styles in
 * globals.css). Rendered once in the root layout; reruns on navigation.
 *
 * Elements start visible in the prerendered HTML. Only those below the fold
 * are hidden, after hydration, so nothing on screen flickers and the page
 * still works without JS. Skipped entirely for reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.dataset.reveal === "shown") {
        continue;
      }
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.dataset.reveal = "shown";
        continue;
      }
      el.dataset.reveal = "hidden";
      observer.observe(el);
    }
    // A focused element must never stay invisible (WCAG 2.4.7).
    const onFocus = (event: FocusEvent) => {
      const el = (event.target as Element).closest<HTMLElement>(
        '[data-reveal="hidden"]',
      );
      if (el) {
        // Show it at once rather than fading in under the focus ring.
        el.style.transition = "none";
        el.setAttribute("data-reveal", "shown");
        observer.unobserve(el);
      }
    };
    document.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
