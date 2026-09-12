import { getDb } from "@voyzu/capability/db";
import type { TaxPositionResponseDto } from "../../types/tax-position.response.dto";

import { TaxPositionRepo } from "../db/tax-position.repo";
import { getCompanyReportContext } from "../../../server/lib/company-report.service";

async function getTaxPositionUnchecked(companyId: number, asAtDate: string): Promise<TaxPositionResponseDto> {
  const db = getDb();
  const repo = new TaxPositionRepo(db);

  const [company, lines] = await Promise.all([
    getCompanyReportContext(db, companyId),
    repo.getLines(companyId, asAtDate),
  ]);
  const summary = repo.summarize(lines);
  const trialBalanceTaxPosition = await repo.getTrialBalanceTaxPosition(companyId, asAtDate);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    asAtDate,
    ...summary,
    trialBalanceReconciled: Math.abs(summary.netTaxPosition + trialBalanceTaxPosition) < 0.01,
  };
}

export const getTaxPosition = getTaxPositionUnchecked;
