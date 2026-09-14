import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const apSubledgerStatementsModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default apSubledgerStatementsModule;
