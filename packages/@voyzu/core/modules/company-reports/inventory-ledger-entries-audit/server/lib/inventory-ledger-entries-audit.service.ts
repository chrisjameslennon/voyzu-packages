import { withResponseValidation } from "@voyzu/capability/validation";
import { getDb } from "@voyzu/capability/db";
import { NotFoundError } from "@voyzu/capability/errors";
import type { InventoryLedgerEntriesAuditResponseDto } from "@voyzu/core/types/modules/company-reports";

import { InventoryLedgerEntriesAuditRepo } from "../db/inventory-ledger-entries-audit.repo";

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

async function getInventoryLedgerEntriesAuditUnchecked(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<InventoryLedgerEntriesAuditResponseDto> {
  const repo = new InventoryLedgerEntriesAuditRepo(getDb());
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

export const getInventoryLedgerEntriesAudit = withResponseValidation(getInventoryLedgerEntriesAuditUnchecked, "getInventoryLedgerEntriesAudit");
