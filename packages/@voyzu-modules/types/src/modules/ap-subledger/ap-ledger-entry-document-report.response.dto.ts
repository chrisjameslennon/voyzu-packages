import type { CompanyResponseDto } from "../companies/company.response.dto";

export interface ApLedgerEntryDocumentReportLineDto {
  line: string;
  description: string;
  quantity: number | null;
  unitAmount: number | null;
  netAmount: number | null;
  taxAmount: number | null;
  grossAmount: number;
}

export interface ApLedgerEntryDocumentReportTaxSummaryDto {
  taxAuthorityCode: string;
  taxAuthorityName: string;
  invoiceLabel: string | null;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface ApLedgerEntryDocumentReportTransactionDto {
  code: string;
  postingDate: string;
  documentDate: string;
  documentTypeLabel: string;
  documentId: string;
  amount: number;
}

export interface ApLedgerEntryDocumentReportApplicationDto {
  sourceDocumentId: string | null;
  targetDocumentId: string | null;
  targetDocumentType: string | null;
  amount: number;
  sourceOpenAmountBefore?: number | null;
  sourceOpenAmountAfter?: number | null;
  targetOpenAmountBefore?: number | null;
  targetOpenAmountAfter?: number | null;
}

export interface ApLedgerEntryDocumentReportTotalDto {
  label: string;
  amount: number;
}

export interface ApLedgerEntryDocumentReportResponseDto {
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
  lines: ApLedgerEntryDocumentReportLineDto[];
  taxSummary: ApLedgerEntryDocumentReportTaxSummaryDto[];
  totals: ApLedgerEntryDocumentReportTotalDto[];
  appliedTransactions: ApLedgerEntryDocumentReportTransactionDto[];
  applications: ApLedgerEntryDocumentReportApplicationDto[];
}

