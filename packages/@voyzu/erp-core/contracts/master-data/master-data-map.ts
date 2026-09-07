import { OrganizationMasterData } from "./organization";
import { OrganizationFinanceMasterData } from "./organization-extension-finance";
export const masterDataContracts = {
  "erp.organization": { id: OrganizationMasterData.properties.id, data: OrganizationMasterData, key: "organization" },
  "erp.organization.finance": { id: OrganizationMasterData.properties.id, data: OrganizationFinanceMasterData, extends: { root: "erp.organization", key: "finance" } },
} as const;
