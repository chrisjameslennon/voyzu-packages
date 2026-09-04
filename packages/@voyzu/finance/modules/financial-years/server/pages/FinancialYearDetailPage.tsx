import "server-only";

import { notFound } from "next/navigation";

import { FinancialYearDetail } from "../../client";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { getFinancialYear, listFinancialYears } from "../lib/financial-year.service";
import { listPeriods } from "../periods/lib/financial-period.service";

export async function FinancialYearDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const [year, financialYears, readOnly] = await Promise.all([
    getFinancialYear(company.id, decodeURIComponent(code)),
    listFinancialYears(company.id),
    getCompanySettingsUiState(company.id).then((state) => state.readOnly),
  ]);
  if (!year) notFound();
  const periods = await listPeriods(year.id);
  return <FinancialYearDetail year={year} financialYears={financialYears} periods={periods} readOnly={readOnly} />;
}
