import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";

export const operationsInvoicesModule = {
  pageRoutes,
  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
