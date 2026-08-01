import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { ApSubledgerEntriesAuditResponseDto } from "@voyzu/core/types/modules/company-reports";

import { ApSubledgerEntriesAuditRepo } from "../db/ap-subledger-entries-audit.repo";

async function fetchCompany(companyId: number): Promise<{
  name: string;
  reportLine1: string | null;
  reportLine2: string | null;
  reportFooter: string | null;
  baseCurrencyCode: string;
}> {
  const { rows } = await getDb().query(
    `SELECT name, report_line_1, report_line_2, report_footer, base_currency_code
     FROM company
     WHERE id = $1`,
    [companyId],
  );
  if (!rows[0]) throw new NotFoundError(`Company id ${companyId} not found`);
  const row = rows[0] as Record<string, unknown>;
  return {
    name: String(row.name),
    reportLine1: row.report_line_1 == null ? null : String(row.report_line_1),
    reportLine2: row.report_line_2 == null ? null : String(row.report_line_2),
    reportFooter: row.report_footer == null ? null : String(row.report_footer),
    baseCurrencyCode: String(row.base_currency_code),
  };
}

export async function getApSubledgerEntriesAudit(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<ApSubledgerEntriesAuditResponseDto> {
  const repo = new ApSubledgerEntriesAuditRepo(getDb());
  const [company, entries] = await Promise.all([
    fetchCompany(companyId),
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



