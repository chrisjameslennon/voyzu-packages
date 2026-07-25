import type { CompanyResponseDto } from "../companies/company.response.dto";
import type { ArInvoiceDetailedInvoiceDto } from "../financial-document-types/ar-invoice.response.dto";

export interface ArInvoiceStatementTransactionDto {
  code: string;
  journalCode: string;
  postingDate: string;
  documentDate: string;
  documentTypeCode: string;
  documentTypeLabel: string;
  documentId: string;
  documentRef: string;
  memo: string | null;
  amount: number;
}

export interface ArInvoiceStatementResponseDto {
  company: CompanyResponseDto;
  invoiceEntryCode: string;
  invoice: ArInvoiceDetailedInvoiceDto;
  counterpartyCode: string;
  counterpartyName: string;
  invoiceAmount: number;
  appliedAmount: number;
  openBalance: number;
  transactions: ArInvoiceStatementTransactionDto[];
}

