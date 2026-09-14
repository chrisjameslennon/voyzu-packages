import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const templateModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default templateModule;
