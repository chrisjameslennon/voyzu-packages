import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const reportsModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default reportsModule;
