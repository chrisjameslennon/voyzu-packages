import "server-only";

import { getSingletonHighlighter } from "shiki";

import { ByoDependenciesClient } from "./ByoDependenciesClient";

const packageJsonExample = `// package.json
{
  "dependencies": {
    "cat-names": "^4.0.0"
  }
}`;

export async function ByoDependenciesPage() {
  const highlighter = await getSingletonHighlighter({
    themes: ["dark-plus"],
    langs: ["jsonc"],
  });
  const packageJsonHtml = highlighter.codeToHtml(packageJsonExample, {
    lang: "jsonc",
    theme: "dark-plus",
  });

  return <ByoDependenciesClient packageJsonHtml={packageJsonHtml} />;
}
