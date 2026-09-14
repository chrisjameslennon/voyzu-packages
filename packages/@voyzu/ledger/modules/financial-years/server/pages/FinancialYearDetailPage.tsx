import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { FinancialYearDetail } from "../../client/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { getSelectedCompany } from "../../../journals/server/index";
import { getFinancialYear, listFinancialYears } from "../lib/financial-year.service";
import { listPeriods } from "../periods/lib/financial-period.service";

export async function FinancialYearDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const [year, financialYears, readOnly] = await Promise.all([
    getFinancialYear(company.id, code),
    listFinancialYears(company.id),
    getCompanySettingsUiState(company.id).then((state) => state.readOnly),
  ]);
  if (!year) notFound();
  const periods = await listPeriods(year.id);
  return <FinancialYearDetail year={year} financialYears={financialYears} periods={periods} readOnly={readOnly} />;
}
