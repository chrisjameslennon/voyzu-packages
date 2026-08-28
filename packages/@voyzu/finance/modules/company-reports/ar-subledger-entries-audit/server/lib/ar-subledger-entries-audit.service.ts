import { getDb } from "@voyzu/capability/db";
import type { ArSubledgerEntriesAuditResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { ArSubledgerEntriesAuditRepo } from "../db/ar-subledger-entries-audit.repo";
import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function getArSubledgerEntriesAuditUnchecked(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<ArSubledgerEntriesAuditResponseDto> {
  const db = getDb();
  const repo = new ArSubledgerEntriesAuditRepo(db);
  const [company, entries] = await Promise.all([
    getCompanyReportContext(db, companyId),
    repo.getEntries(companyId, fromDate, toDate),
  ]);

  return {
    companyId,
    companyName: company.name,
    companyReportLine1: company.reportLine1,
    companyReportLine2: company.reportLine2,
    companyReportFooter: company.reportFooter,
    baseCurrencyCode: company.baseCurrencyCode,
    fromDate,
    toDate,
    entries,
  };
}

export const getArSubledgerEntriesAudit = getArSubledgerEntriesAuditUnchecked;
