import type { OrganizationMasterData } from "./organization";
import type { OrganizationFinanceMasterData } from "./organization-extension-finance";
export interface OrganizationComposedMasterData {
  organization: OrganizationMasterData;
  extensions: { finance?: OrganizationFinanceMasterData };
}
