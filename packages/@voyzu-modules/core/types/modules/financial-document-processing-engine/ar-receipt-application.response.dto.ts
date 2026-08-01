import type { DrCr, EntryType } from "@voyzu-modules/core/types/modules/core";
export interface ArReceiptApplicationCompanySnapshotDto {
  code: string;
  base_currency_code: string;
}

export interface ArReceiptApplicationCounterpartySnapshotDto {
  code: string;
  name: string;
}

export interface ArReceiptApplicationDetailedLineDto {
  source_receipt_document_id: string;
  source_receipt_journal_code: string;
  source_receipt_ar_subledger_entry_code: string;
  source_receipt_ar_subledger_entry_id: number;
  source_receipt_open_amount_before: number;
  source_receipt_open_amount_after: number;
  target_invoice_document_id: string;
  target_invoice_journal_code: string;
  target_invoice_ar_subledger_entry_code: string;
  target_invoice_ar_subledger_entry_id: number;
  target_invoice_open_amount_before: number;
  target_invoice_open_amount_after: number;
  amount: number;
}

export interface ArReceiptApplicationDetailedDto {
  company: ArReceiptApplicationCompanySnapshotDto;
  ar_counterparty: ArReceiptApplicationCounterpartySnapshotDto;
  document_id: string;
  document_memo: string | null;
  generated_description: string;
  application_date: string;
  posting_date: string;
  applications: ArReceiptApplicationDetailedLineDto[];
  total_application_amount: number;
}

export interface ArReceiptApplicationArSubledgerDetailDto {
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
  entry_type: EntryType;
  base_currency_amount: number;
  document_memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArReceiptApplicationJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "AR_RECEIPT_APPLICATION";
  document_id: string;
  generated_description: string;
  posting_engine_code: "AR_RECEIPT_APPLICATION";
  company_code: string;
  document_date: string;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  total_debit_base_amount: number;
  total_credit_base_amount: number;
  document_memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArReceiptApplicationJournalLineDto {
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
  document_memo: string | null;
}

export interface ArReceiptApplicationPostingDetailsDto {
  journal_header: ArReceiptApplicationJournalHeaderDto;
  journal_lines: ArReceiptApplicationJournalLineDto[];
}

export interface ArReceiptApplicationPostingResponseDto {
  detailed_document: ArReceiptApplicationDetailedDto;
  ar_subledger_details: ArReceiptApplicationArSubledgerDetailDto[];
  posting_details: ArReceiptApplicationPostingDetailsDto;
}
