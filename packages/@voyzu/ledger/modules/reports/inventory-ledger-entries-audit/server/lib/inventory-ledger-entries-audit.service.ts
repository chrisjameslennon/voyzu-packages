import { getDb } from "@voyzu/capability/db";
import type { InventoryLedgerEntriesAuditResponseDto } from "../../types/inventory-ledger-entries-audit.response.dto";

import { InventoryLedgerEntriesAuditRepo } from "../db/inventory-ledger-entries-audit.repo";
import { getCompanyReportContext } from "../../../server/lib/company-report.service";

async function getInventoryLedgerEntriesAuditUnchecked(
  companyId: number,
  fromDate: string,
  toDate: string,
): Promise<InventoryLedgerEntriesAuditResponseDto> {
  const db = getDb();
  const repo = new InventoryLedgerEntriesAuditRepo(db);
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

export const getInventoryLedgerEntriesAudit = getInventoryLedgerEntriesAuditUnchecked;
