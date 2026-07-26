import type { DrCr, EntryType } from "@voyzu/types/modules/core";
export type ApProcessingDocumentType =
  | "AP_CREDIT_NOTE"
  | "AP_OPENING_BALANCE"
  | "AP_PAYMENT"
  | "AP_PAYMENT_APPLICATION"
  | "AP_REFUND"
  | "AP_WRITE_OFF"
  | "AP_BILL_CANCELLATION";

export interface ApProcessingJournalLineDto {
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

export interface ApProcessingSubledgerDetailDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ap_counterparty_code: string;
  control_account_code: "AP_TRADE_PAYABLES" | "AP_UNAPPLIED_PAYMENTS";
  source_entry_header_id?: number | null;
  applied_to_ap_subledger_entry_id?: number | null;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ApProcessingTaxLedgerDetailDto {
  id: number | null;
  code: string | null;
  tax_rule: string;
  tax_component_id: number | null;
  tax_authority_code: string;
  tax_authority_name?: string;
  tax_movement_type_code: "TAX_ON_PURCHASES";
  description: string;
  scheme_code?: string | null;
  invoice_label?: string | null;
  report_label?: string | null;
  tax_rate: number;
  taxable_amount: number;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  status: "POSTED" | "EPHEMERAL";
}

export interface ApProcessingPostingResponseDto {
  detailed_document: Record<string, unknown>;
  ap_subledger_details: ApProcessingSubledgerDetailDto[];
  tax_ledger_details?: ApProcessingTaxLedgerDetailDto[];
  posting_details: {
    journal_header: {
      id: number | null;
      code: string | null;
      document_type_code: ApProcessingDocumentType;
      document_id: string;
      generated_description: string;
      posting_engine_code: ApProcessingDocumentType;
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
    };
    journal_lines: ApProcessingJournalLineDto[];
  };
}
