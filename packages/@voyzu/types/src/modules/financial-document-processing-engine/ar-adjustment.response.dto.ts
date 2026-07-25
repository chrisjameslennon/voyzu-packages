import type { DrCr, EntryType } from "../core";
import type { ArInvoiceDetailedTaxComponentDto } from "./ar-invoice.response.dto";
import type { BankCashJournalDetailsDto } from "./bank-cash-details.dto";

export type ArAdjustmentDocumentType = "AR_CREDIT_NOTE" | "AR_OPENING_BALANCE" | "AR_REFUND" | "AR_WRITE_OFF";

export interface ArAdjustmentCompanySnapshotDto {
  code: string;
  base_currency_code: string;
}

export interface ArAdjustmentCounterpartySnapshotDto {
  code: string;
  name: string;
  status?: "ACTIVE" | "INACTIVE";
  country_code?: string;
  tax_region_or_province?: string | null;
}

export interface ArCreditNoteDetailedLineDto {
  line_id: number;
  line_description: string;
  quantity: number | null;
  net_unit_price: number | null;
  revenue_posting_code: string;
  tax_rule: string;
  raw_net_line_total: number;
  net_line_total: number;
  tax_components: ArInvoiceDetailedTaxComponentDto[];
  tax_amount: number;
  gross_line_total: number;
  dimensions: Record<string, string>;
}

export interface ArCreditNoteDetailedAllocationDto {
  invoice_document_id: string;
  invoice_journal_code: string;
  invoice_ar_subledger_entry_code: string;
  invoice_ar_subledger_entry_id: number;
  invoice_open_amount_before: number;
  requested_amount: number;
  applied_amount: number;
  invoice_open_amount_after: number;
}

export interface ArOpeningBalanceDetailedItemDto {
  line_id: number;
  external_reference: string | null;
  description: string;
  original_invoice_date: string | null;
  due_date: string | null;
  amount: number;
}

export interface ArWriteOffDetailedApplicationDto {
  target_invoice_document_id: string;
  target_invoice_journal_code: string;
  target_invoice_ar_subledger_entry_code: string;
  target_invoice_ar_subledger_entry_id: number;
  target_invoice_open_amount_before: number;
  target_invoice_open_amount_after: number;
  amount: number;
}

export type ArAdjustmentDetailedDocumentDto =
  | {
    document_type: "AR_CREDIT_NOTE";
    company: ArAdjustmentCompanySnapshotDto;
    ar_counterparty: ArAdjustmentCounterpartySnapshotDto;
    document_id: string;
    memo: string | null;
    generated_description: string;
    credit_note_date: string;
    posting_date: string;
    lines: ArCreditNoteDetailedLineDto[];
    allocations: ArCreditNoteDetailedAllocationDto[];
    net_amount: number;
    tax_amount: number;
    gross_amount: number;
    applied_amount: number;
    unapplied_amount: number;
  }
  | {
    document_type: "AR_OPENING_BALANCE";
    company: ArAdjustmentCompanySnapshotDto;
    ar_counterparty: ArAdjustmentCounterpartySnapshotDto;
    document_id: string;
    memo: string | null;
    generated_description: string;
    opening_balance_date: string;
    posting_date: string;
    opening_balance_equity_posting_code: string;
    items: ArOpeningBalanceDetailedItemDto[];
    total_amount: number;
  }
  | {
    document_type: "AR_REFUND";
    company: ArAdjustmentCompanySnapshotDto;
    ar_counterparty: ArAdjustmentCounterpartySnapshotDto;
    document_id: string;
    memo: string | null;
    generated_description: string;
    refund_date: string;
    posting_date: string;
    bank_cash_account_code: string;
    bank_cash_details?: BankCashJournalDetailsDto | null;
    refund_amount: number;
    unapplied_balance_before: number;
    unapplied_balance_after: number;
  }
  | {
    document_type: "AR_WRITE_OFF";
    company: ArAdjustmentCompanySnapshotDto;
    ar_counterparty: ArAdjustmentCounterpartySnapshotDto;
    document_id: string;
    memo: string | null;
    generated_description: string;
    write_off_date: string;
    posting_date: string;
    write_off_expense_posting_code: string;
    applications: ArWriteOffDetailedApplicationDto[];
    total_write_off_amount: number;
  };

export interface ArAdjustmentArSubledgerDetailDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ar_counterparty_code: string;
  control_account_code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH";
  source_entry_header_id?: number | null;
  applied_to_ar_subledger_entry_id?: number | null;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArAdjustmentTaxLedgerDetailDto {
  id: number | null;
  code: string | null;
  tax_rule: string;
  tax_component_id: number | null;
  tax_authority_code: string;
  tax_authority_name?: string;
  tax_movement_type_code: "TAX_ON_SALES";
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
  entry_type: "DEBIT";
  base_currency_amount: number;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArAdjustmentJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: ArAdjustmentDocumentType;
  document_id: string;
  generated_description: string;
  posting_engine_code: ArAdjustmentDocumentType;
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

export interface ArAdjustmentJournalLineDto {
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
  dimensions?: Array<{ dimension_code: string; dimension_name: string; dimension_value_name: string }>;
}

export interface ArAdjustmentPostingResponseDto {
  detailed_document: ArAdjustmentDetailedDocumentDto;
  ar_subledger_details: ArAdjustmentArSubledgerDetailDto[];
  tax_ledger_details?: ArAdjustmentTaxLedgerDetailDto[];
  posting_details: {
    journal_header: ArAdjustmentJournalHeaderDto;
    journal_lines: ArAdjustmentJournalLineDto[];
  };
}
