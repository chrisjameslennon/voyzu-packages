import { getDb } from "@voyzu/capability/db";
import type { TaxActivityReconciliationResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { TaxActivityReconciliationRepo } from "../db/tax-activity-reconciliation.repo";
import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function getTaxActivityReconciliationUnchecked(
  companyId: number,
  periodStartDate: string,
  periodEndDate: string,
  periodLabel: string,
  taxAuthorityCode?: string | null,
): Promise<TaxActivityReconciliationResponseDto> {
  const db = getDb();
  const repo = new TaxActivityReconciliationRepo(db);
  const [company, taxAuthorityOptions] = await Promise.all([
    getCompanyReportContext(db, companyId),
    repo.listTaxAuthoritiesForCompany(companyId),
  ]);
  const selectedTaxAuthority = taxAuthorityOptions.find((option) => option.taxAuthorityCode === taxAuthorityCode)
    ?? taxAuthorityOptions[0]
    ?? null;
  const allLines = await repo.getAccrualLinesForPeriod(companyId, periodStartDate, periodEndDate);
  const lines = selectedTaxAuthority
    ? allLines.filter((line) => line.taxAuthorityCode === selectedTaxAuthority.taxAuthorityCode)
    : [];
  const [total, trialBalanceTaxMovement] = await Promise.all([
    Promise.resolve(repo.total(lines)),
    repo.getTrialBalanceTaxMovement(companyId, periodStartDate, periodEndDate),
  ]);
  const allAuthorityTotal = repo.total(allLines);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    taxAuthorityCode: selectedTaxAuthority?.taxAuthorityCode ?? "",
    taxAuthorityName: selectedTaxAuthority?.taxAuthorityName ?? "",
    taxAuthorityOptions,
    periodLabel,
    periodStartDate,
    periodEndDate,
    lines,
    total,
    trialBalanceReconciled: Math.abs(allAuthorityTotal + trialBalanceTaxMovement) < 0.01,
  };
}

export const getTaxActivityReconciliation = getTaxActivityReconciliationUnchecked;
