import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const inventoryLedgerModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default inventoryLedgerModule;
