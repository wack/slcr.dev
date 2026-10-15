import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <DocsSidebar />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
