import "server-only";

import { FinancialYearsListContent } from "../../client";
import { companyUsesOrganizationStandardSettings } from "../../../common/server/company-standard-settings";
import { getSelectedCompany } from "@voyzu/modules/journals/server";
import { listFinancialYears } from "../lib/financial-year.service";

export async function FinancialYearsListPage() {
  const company = await getSelectedCompany();
  const years = company ? await listFinancialYears(company.id) : [];
  const readOnly = company ? await companyUsesOrganizationStandardSettings(company.id) : false;
  return <FinancialYearsListContent years={years} companyId={company?.id} readOnly={readOnly} />;
}
