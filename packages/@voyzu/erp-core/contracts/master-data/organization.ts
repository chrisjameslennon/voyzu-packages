// File: master-data/organization.ts

export interface OrganizationMasterData {
  id: string;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";

  countryCode?: string;
  currencyCode?: string;
}