import { getDb } from "@voyzu/capability/db";
import type { JournalEntriesResponseDto } from "@voyzu/finance/types/modules/company-reports";

import { JournalEntriesRepo } from "../db/journal-entries.repo";
import { getCompanyReportContext } from "../../../common/server/lib/company-report.service";

async function getJournalEntriesUnchecked(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<JournalEntriesResponseDto> {
  const db = getDb();
  const repo = new JournalEntriesRepo(db);
  const [company, lines] = await Promise.all([
    getCompanyReportContext(db, companyId),
    repo.getLines(companyId, fromDate, toDate),
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
    lines,
  };
}

export const getJournalEntries = getJournalEntriesUnchecked;
