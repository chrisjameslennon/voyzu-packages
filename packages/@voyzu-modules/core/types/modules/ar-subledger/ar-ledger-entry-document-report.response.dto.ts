import type { CompanyResponseDto } from "../companies/company.response.dto";

export interface ArLedgerEntryDocumentReportLineDto {
  line: string;
  description: string;
  quantity: number | null;
  unitAmount: number | null;
  netAmount: number | null;
  taxAmount: number | null;
  grossAmount: number;
}

export interface ArLedgerEntryDocumentReportTransactionDto {
  code: string;
  postingDate: string;
  documentDate: string;
  documentTypeLabel: string;
  documentId: string;
  amount: number;
}

export interface ArLedgerEntryDocumentReportApplicationDto {
  sourceDocumentId: string | null;
  targetDocumentId: string | null;
  targetDocumentType: string | null;
  amount: number;
  sourceOpenAmountBefore?: number | null;
  sourceOpenAmountAfter?: number | null;
  targetOpenAmountBefore?: number | null;
  targetOpenAmountAfter?: number | null;
}

export interface ArLedgerEntryDocumentReportTotalDto {
  label: string;
  amount: number;
}

export interface ArLedgerEntryDocumentReportResponseDto {
  company: CompanyResponseDto;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentDate: string | null;
  postingDate: string | null;
  memo: string | null;
  description: string | null;
  counterpartyCode: string | null;
  counterpartyName: string | null;
  counterpartyCountryCode: string | null;
  lines: ArLedgerEntryDocumentReportLineDto[];
  totals: ArLedgerEntryDocumentReportTotalDto[];
  appliedTransactions: ArLedgerEntryDocumentReportTransactionDto[];
  applications: ArLedgerEntryDocumentReportApplicationDto[];
}
