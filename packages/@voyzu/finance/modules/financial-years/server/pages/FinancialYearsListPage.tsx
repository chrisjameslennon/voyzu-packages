import "server-only";

import { FinancialYearsListContent } from "../../client/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { getSelectedCompany } from "../../../journals/server/index";
import { listFinancialYears } from "../lib/financial-year.service";

export async function FinancialYearsListPage() {
  const company = await getSelectedCompany();
  const years = company ? await listFinancialYears(company.id) : [];
  const readOnly = company ? (await getCompanySettingsUiState(company.id)).readOnly : false;
  return <FinancialYearsListContent years={years} companyId={company?.id} readOnly={readOnly} />;
}
