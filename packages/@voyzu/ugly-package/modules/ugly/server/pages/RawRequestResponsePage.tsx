import "server-only";

import { getSingletonHighlighter } from "shiki";

import { RawRequestResponseClient } from "../../client";

const pageExample = `// voyzu.package.ts
contracts: {
  pageRouting: {
    roots: ["/ugly-package"],
    routes: {
      "ugly-package.items.detail": {
        path: "/ugly-package/items/[id]",
        pathParams: { id: { type: "string" } },
        queryParams: { view: { type: "string", default: "details" } },
        pageTitle: "Item",
        loadPage: () => import("./ItemPage").then(module => module.ItemPage),
      },
    },
  },
}

// ItemPage.tsx
export function ItemPage({ context }) {
  return (
    <main>
      <h1>Item {context.pathParams.id}</h1>
      <p>View: {context.queryParams.view}</p>
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
