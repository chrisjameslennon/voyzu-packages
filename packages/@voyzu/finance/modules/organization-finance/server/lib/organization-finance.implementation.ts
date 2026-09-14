import type { OrganizationFinanceMethods } from "@voyzu/types/business-objects/organization-finance";
import { getOrganizationFinance, createFinancialEntity, updateOrganizationFinance } from "./finance-company.service";

function toFinance(record: Awaited<ReturnType<typeof updateOrganizationFinance>>) {
  const { financeCompanyId, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings } = record;
  return { organization_id: record.id, financeCompanyId, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings };
}
export const organizationFinanceMethods = {
  async update({ organization_id, changes }) { return toFinance(await updateOrganizationFinance(organization_id, changes)); },
  async get({ organization_id }) {
    const record = await getOrganizationFinance(organization_id);
    if (!record) return null;
    const { financeCompanyId, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings } = record;
    return { organization_id, financeCompanyId, taxFilingAnchorMonth, taxFilingIntervalMonths, reportLine1, reportLine2, reportFooter, hasPostings };
  },
  createFinancialEntity: ({ organization_id }) => createFinancialEntity({ organizationId: organization_id }),
} satisfies OrganizationFinanceMethods;
