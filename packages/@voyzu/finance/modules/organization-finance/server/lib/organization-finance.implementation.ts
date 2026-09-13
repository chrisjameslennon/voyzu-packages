import type { OrganizationFinanceMethods } from "@voyzu/types/business-objects/organization-finance";
import { getOrganizationFinance, createFinancialEntity } from "./finance-company.service";

export const organizationFinanceMethods = {
  async get({ organization_id }) {
    const record = await getOrganizationFinance(organization_id);
    if (!record) return null;
    const { financeCompanyId, financeEnabled, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings } = record;
    return { organization_id, financeCompanyId, financeEnabled, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings };
  },
  createFinancialEntity: ({ organization_id }) => createFinancialEntity({ organizationId: organization_id }),
} satisfies OrganizationFinanceMethods;
