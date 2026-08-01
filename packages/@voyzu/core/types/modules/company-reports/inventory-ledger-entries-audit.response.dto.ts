export interface InventoryLedgerEntriesAuditFieldDto {
  label: string;
  value: string | null;
}

export interface InventoryLedgerEntriesAuditEntryDto {
  id: string;
  fields: InventoryLedgerEntriesAuditFieldDto[];
}

export interface InventoryLedgerEntriesAuditResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  entries: InventoryLedgerEntriesAuditEntryDto[];
}

