// File: contracts/master-data/master-data-map.ts

import type { OrganizationMasterData } from "./organization";
import type { OrganizationFinanceMasterData } from "./organization-extension-finance";

export interface MasterDataMap {
  "erp.organization": OrganizationMasterData;
  "erp.organization.finance": OrganizationFinanceMasterData;
}