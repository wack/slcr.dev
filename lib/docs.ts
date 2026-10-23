import { allDocs } from "content-collections";

export type Doc = (typeof allDocs)[number];

export type DocSection = {
  // Directory name under content/docs, or "" for top-level docs.
  key: string;
  title: string;
  docs: Doc[];
};

export function docHref(doc: Doc) {
  return `/docs/${doc.slug.join("/")}`;
}

export function findDoc(slug: string[]) {
  return allDocs.find((doc) => doc.slug.join("/") === slug.join("/"));
}

// "getting-started" -> "Getting started"
function sentenceCase(name: string) {
  const words = name.split("-").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function compareDocs(a: Doc, b: Doc) {
  const orderA = a.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a._meta.path.localeCompare(b._meta.path);
}

// Groups docs by their top-level directory. Sections appear in the order of
// their first doc, so a section's position is set by its lowest `order`.
export function getDocSections(): DocSection[] {
  const sections = new Map<string, DocSection>();
  for (const doc of [...allDocs].sort(compareDocs)) {
    const key = doc.slug.length > 1 ? doc.slug[0] : "";
    let section = sections.get(key);
    if (!section) {
      section = { key, title: key ? sentenceCase(key) : "Overview", docs: [] };
      sections.set(key, section);
    }
    section.docs.push(doc);
  }
  return [...sections.values()];
}
