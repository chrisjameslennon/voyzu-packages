import type { DrCr } from "@voyzu/core/types/modules/core";
import type { BankCashJournalDetailsDto } from "./bank-cash-details.dto";

export interface ArReceiptCompanySnapshotDto {
  code: string;
  base_currency_code: string;
}

export interface ArReceiptCounterpartySnapshotDto {
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
}

export interface ArReceiptDetailedAllocationDto {
  invoice_document_id: string;
  invoice_journal_code: string;
  invoice_ar_subledger_entry_code: string;
  invoice_ar_subledger_entry_id: number;
  invoice_open_amount_before: number;
  requested_amount: number;
  applied_amount: number;
  surplus_to_unapplied_amount: number;
  invoice_open_amount_after: number;
}

export interface ArReceiptDetailedReceiptDto {
  company: ArReceiptCompanySnapshotDto;
  ar_counterparty: ArReceiptCounterpartySnapshotDto;
  document_id: string;
  memo: string | null;
  generated_description: string;
  payment_date: string;
  posting_date: string;
  bank_cash_account_code: string;
  bank_cash_details?: BankCashJournalDetailsDto | null;
  receipt_amount: number;
  allocations: ArReceiptDetailedAllocationDto[];
  applied_amount: number;
  unapplied_amount: number;
}

export interface ArReceiptArSubledgerDetailDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ar_counterparty_code: string;
  control_account_code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH";
  applied_to_ar_subledger_entry_id: number | null;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArReceiptJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "AR_RECEIPT";
  document_id: string;
  generated_description: string;
  posting_engine_code: "AR_RECEIPT";
  company_code: string;
  document_date: string;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  total_debit_base_amount: number;
  total_credit_base_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArReceiptJournalLineDto {
  id: number | null;
  journal_header_id: number | null;
  line_number: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: string | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
}

export interface ArReceiptPostingDetailsDto {
  journal_header: ArReceiptJournalHeaderDto;
  journal_lines: ArReceiptJournalLineDto[];
}

export interface ArReceiptPostingResponseDto {
  detailed_document: ArReceiptDetailedReceiptDto;
  ar_subledger_details: ArReceiptArSubledgerDetailDto[];
  posting_details: ArReceiptPostingDetailsDto;
}
