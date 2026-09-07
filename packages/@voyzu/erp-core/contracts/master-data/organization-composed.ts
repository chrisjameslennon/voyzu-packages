// File: contracts/master-data/organization-composed.ts

import type { OrganizationMasterData } from "./organization";
import type { OrganizationFinanceMasterData } from "./organization-extension-finance";

export interface OrganizationComposedMasterData {
  organization: OrganizationMasterData;

  extensions: {
    finance?: OrganizationFinanceMasterData;
  };
}

/*



const organization = await masterData.composed(
  "erp.organization",
  organizationId,
);

// returns:

{
  organization: {
    id: "10000",
    code: "INSTOCK",
    name: "stocky",
    status: "ACTIVE",
    countryCode: "NZ",
    currencyCode: "NZD"
  },

  extensions: {
    finance: {
      organizationId: "10000",
      enabled: true,
      baseCurrencyCode: "NZD",
      taxAccountingBasis: "INVOICE"
    }
  }
}



*/