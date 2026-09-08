import { OrganizationMasterData } from "./organization";
import { OrganizationFinanceMasterData } from "./organization-extension-finance";
import Type from "typebox";
import { CountryFinanceMasterData } from "./country-extension-finance";
export const masterDataContracts = {
  "erp.country.finance": {
    id: Type.String({ pattern: "^[A-Z0-9][A-Z0-9_-]*$" }),
    data: CountryFinanceMasterData,
    extends: { root: "platform.country", key: "finance" },
  },
  "erp.organization": { id: OrganizationMasterData.properties.id, data: OrganizationMasterData, key: "organization", list: true },
  "erp.organization.finance": { id: OrganizationMasterData.properties.id, data: OrganizationFinanceMasterData, extends: { root: "erp.organization", key: "finance" } },
} as const;
