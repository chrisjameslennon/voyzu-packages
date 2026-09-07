// File: master-data/extensions/organization-finance.ts

export interface OrganizationFinanceMasterData {
  organizationId: string;

  enabled: boolean;
  baseCurrencyCode: string;

  taxNumber?: string;
  taxAccountingBasis?: "INVOICE" | "CASH" | "PAYMENTS";
}

/*

const finance = await masterData.get(
  "erp.organization.finance",
  organizationId,
);

*/