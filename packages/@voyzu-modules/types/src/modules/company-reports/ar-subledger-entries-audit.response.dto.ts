export interface ArSubledgerEntriesAuditFieldDto {
  label: string;
  value: string | null;
}

export interface ArSubledgerEntriesAuditEntryDto {
  id: string;
  fields: ArSubledgerEntriesAuditFieldDto[];
}

export interface ArSubledgerEntriesAuditResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  entries: ArSubledgerEntriesAuditEntryDto[];
}
