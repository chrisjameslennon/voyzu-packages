import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { apiDefinitions } from "./api.routes";
import { operations } from "./operations";
import { pageRoutes } from "./pages.routes";

export const financeTemplateModule = {
  pageRoutes,
  apiDefinitions,
  operations,
} as const satisfies VoyzuPackageModuleDefinition;

export default financeTemplateModule;
