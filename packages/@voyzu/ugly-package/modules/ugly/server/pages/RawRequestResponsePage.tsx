import "server-only";

import { getSingletonHighlighter } from "shiki";

import { RawRequestResponseClient } from "../../client";

const pageExample = `// module.ts
pageRoutes: {
  item: {
    path: "/ugly-package/items/[id]",
    Page: ItemPage,
  },
}

// ItemPage.tsx
export function ItemPage({ id, surface }) {
  return (
    <main>
      <h1>Item {id}</h1>
      <p>View: {surface.searchParams.view}</p>
    </main>
  );
}`;

export async function RawRequestResponsePage() {
  const highlighter = await getSingletonHighlighter({
    themes: ["dark-plus"],
    langs: ["tsx"],
  });
  const pageExampleHtml = highlighter.codeToHtml(pageExample, {
    lang: "tsx",
    theme: "dark-plus",
  });

  return <RawRequestResponseClient pageExampleHtml={pageExampleHtml} />;
}
