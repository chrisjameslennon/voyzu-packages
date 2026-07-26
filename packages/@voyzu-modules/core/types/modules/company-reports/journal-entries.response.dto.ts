export interface JournalEntriesFieldDto {
  label: string;
  value: string | null;
}

export interface JournalEntriesLineDto {
  id: string;
  headerFields: JournalEntriesFieldDto[];
  lineFields: JournalEntriesFieldDto[];
}

export interface JournalEntriesResponseDto {
  companyId: number;
  companyName: string;
  companyReportLine1: string | null;
  companyReportLine2: string | null;
  companyReportFooter: string | null;
  baseCurrencyCode: string;
  fromDate: string;
  toDate: string;
  lines: JournalEntriesLineDto[];
}
