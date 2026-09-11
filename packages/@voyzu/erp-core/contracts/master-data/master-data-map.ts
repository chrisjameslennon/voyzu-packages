import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { OrganizationMasterData } from "./organization";
import { OrganizationFinanceMasterData } from "./organization-extension-finance";
import { CountryFinanceMasterData } from "./country-extension-finance";
import { inventoryDataContracts } from "./inventory";
export const semanticDataContracts = {
  "country.finance": {
    extends: "country",
    dataDefinition: CountryFinanceMasterData,
  },
  organization: {
    identifier: "id", identifierDataDefinition: OrganizationMasterData.properties.id,
    dataDefinition: Type.Omit(OrganizationMasterData, ["id"]),
    queries: { all: { inputDataDefinition: StrictObject({}) } },
  },
  "organization.finance": {
    extends: "organization",
    dataDefinition: OrganizationFinanceMasterData,
  },
  "country.withFinance": { extends: "country", extensions: ["country.finance"] },
  "organization.withFinance": { extends: "organization", extensions: ["organization.finance"] },
  ...inventoryDataContracts,
} as const;
