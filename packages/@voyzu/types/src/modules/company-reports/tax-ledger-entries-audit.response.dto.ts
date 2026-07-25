export interface TaxLedgerEntriesAuditFieldDto {
  label: string;
  value: string | null;
}

export interface TaxLedgerEntriesAuditEntryDto {
  id: string;
  fields: TaxLedgerEntriesAuditFieldDto[];
}

export interface TaxLedgerEntriesAuditResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  entries: TaxLedgerEntriesAuditEntryDto[];
}
