import { allPages } from "content-collections";

export function getPage(name: string) {
  const page = allPages.find((p) => p.name === name);
  if (!page) {
    throw new Error(`content/pages/${name}.mdx is missing`);
  }
  return page;
}
