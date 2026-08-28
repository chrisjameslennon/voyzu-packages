import { getDb } from "@voyzu/capability/db";
import type { TrialBalanceResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { TrialBalanceRepo } from "../db/trial-balance.repo";
import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function getTrialBalanceUnchecked(
  companyId: number,
  asAtDate?: string | null,
): Promise<TrialBalanceResponseDto> {
  const db = getDb();
  const repo = new TrialBalanceRepo(db);

  const [company, lines] = await Promise.all([
    getCompanyReportContext(db, companyId),
    repo.getLines(companyId, asAtDate),
  ]);

  const totalDebit = lines.reduce((s, l) => s + l.debitTotal, 0);
  const totalCredit = lines.reduce((s, l) => s + l.creditTotal, 0);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    asAtDate: asAtDate ?? null,
    lines,
    totalDebit,
    totalCredit,
  };
}

export const getTrialBalance = getTrialBalanceUnchecked;
