import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const inventoryControlAccountsModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default inventoryControlAccountsModule;
