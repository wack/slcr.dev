import type { Metadata } from "next";
import { Geist_Mono, Spline_Sans, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Headings. Exposed to Tailwind as `font-display` in globals.css.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

// Body text. Exposed to Tailwind as `font-sans`.
const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SLCR",
    template: "%s | SLCR",
  },
  description:
    "SLCR (Sliceable, Linked, Checkable Requirements) is an open standard for writing software requirements documents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${splineSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only z-50 bg-cobalt-950 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div
          id="content"
          tabIndex={-1}
          className="flex flex-1 flex-col outline-none"
        >
          {children}
        </div>
        <SiteFooter />
        <ScrollReveal />
        <Analytics />
      </body>
    </html>
  );
}
