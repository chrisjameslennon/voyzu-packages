import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const financialDocumentTypesModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default financialDocumentTypesModule;
