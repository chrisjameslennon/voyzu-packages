import { getDb } from "@voyzu/capability/db";
import type { TaxActivityResponseDto } from "../../types/tax-activity.response.dto";

import { TaxActivityRepo } from "../db/tax-activity.repo";
import { getCompanyReportContext } from "../../../server/lib/company-report.service";

async function getTaxActivityUnchecked(
  companyId: number,
  periodStartDate: string,
  periodEndDate: string,
  periodLabel: string,
): Promise<TaxActivityResponseDto> {
  const db = getDb();
  const repo = new TaxActivityRepo(db);

  const company = await getCompanyReportContext(db, companyId);
  const lines = await repo.getAccrualLinesForPeriod(companyId, periodStartDate, periodEndDate);
  const summary = repo.summarize(lines);
  const trialBalanceTaxMovement = await repo.getTrialBalanceTaxMovement(companyId, periodStartDate, periodEndDate);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    periodLabel,
    periodStartDate,
    periodEndDate,
    ...summary,
    trialBalanceReconciled: Math.abs(summary.closingTaxPositionImpact + trialBalanceTaxMovement) < 0.01,
  };
}

export const getTaxActivity = getTaxActivityUnchecked;
