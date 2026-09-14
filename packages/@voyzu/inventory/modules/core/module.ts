import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const coreModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default coreModule;
