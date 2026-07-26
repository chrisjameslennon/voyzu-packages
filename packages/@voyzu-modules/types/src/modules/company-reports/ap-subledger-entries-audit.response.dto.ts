export interface ApSubledgerEntriesAuditFieldDto {
  label: string;
  value: string | null;
}

export interface ApSubledgerEntriesAuditEntryDto {
  id: string;
  fields: ApSubledgerEntriesAuditFieldDto[];
}

export interface ApSubledgerEntriesAuditResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  entries: ApSubledgerEntriesAuditEntryDto[];
}

