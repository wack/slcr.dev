import { githubUrl } from "@/components/github-link";
import { siteDescription, siteName, siteUrl } from "@/lib/metadata";

// schema.org data rendered with <JsonLd> (components/json-ld.tsx). Check
// changes with https://validator.schema.org/ and Google's Rich Results Test.

const organizationId = "https://wack.run/#organization";

// The home page: the site, its publisher, and the reference CLI. The CLI is
// SoftwareSourceCode, not SoftwareApplication: Google's SoftwareApplication
// rich result requires ratings or reviews, which SLCR doesn't have.
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Wack, Inc.",
      url: "https://wack.run",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: "Sliceable, Linked, Checkable Requirements",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "SoftwareSourceCode",
      name: "slcr",
      description: "The reference command-line implementation of SLCR.",
      codeRepository: githubUrl,
      programmingLanguage: "Rust",
      license: `${githubUrl}/blob/trunk/LICENSE`,
      author: { "@id": organizationId },
    },
  ],
};

// A doc page's trail, which Google shows in place of the URL in results.
// Doc sections have no page of their own, so they're left out.
export function docBreadcrumbJsonLd(title: string, path: string) {
  const crumbs = [
    { name: siteName, path: "/" },
    { name: "Docs", path: "/docs" },
    { name: title, path },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
