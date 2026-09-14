import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const glAccountsModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default glAccountsModule;
