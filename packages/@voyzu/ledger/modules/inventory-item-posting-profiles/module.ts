import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { pageRoutes } from "./pages.routes";

export const inventoryItemPostingProfilesModule = {
  pageRoutes } as const satisfies VoyzuPackageModuleDefinition;

export default inventoryItemPostingProfilesModule;
