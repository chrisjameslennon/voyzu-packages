import type { DrCr } from "../core";
import type { ArInvoiceDetailedInvoiceDto } from "./ar-invoice.response.dto";

export interface ArInvoiceCancellationDetailedDocumentDto {
  company: {
    code: string;
    base_currency_code: string;
  };
  ar_counterparty: {
    code: string;
    name: string;
  };
  document_id: string;
  document_memo: string | null;
  generated_description: string;
  source_invoice_document_id: string;
  source_invoice_journal_code: string;
  source_invoice_ar_subledger_entry_code: string;
  source_invoice_ar_subledger_entry_id: number;
  source_invoice_open_amount_before: number;
  source_invoice_open_amount_after: number;
  cancellation_date: string;
  posting_date: string;
  original_invoice: ArInvoiceDetailedInvoiceDto;
  net_amount: number;
  tax_amount: number;
  gross_amount: number;
}

export interface ArInvoiceCancellationArSubledgerDetailDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ar_counterparty_code: string;
  control_account_code: "AR_TRADE_RECEIVABLES";
  applied_to_ar_subledger_entry_id: number;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  document_memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArInvoiceCancellationTaxLedgerDetailDto {
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

export interface ArInvoiceCancellationJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "AR_INVOICE_CANCELLATION";
  document_id: string;
  generated_description: string;
  posting_engine_code: "AR_INVOICE_CANCELLATION";
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

export interface ArInvoiceCancellationJournalLineDimensionDto {
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ArInvoiceCancellationJournalLineDto {
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
  dimensions?: ArInvoiceCancellationJournalLineDimensionDto[];
}

export interface ArInvoiceCancellationPostingDetailsDto {
  journal_header: ArInvoiceCancellationJournalHeaderDto;
  journal_lines: ArInvoiceCancellationJournalLineDto[];
}

export interface ArInvoiceCancellationPostingResponseDto {
  detailed_document: ArInvoiceCancellationDetailedDocumentDto;
  ar_subledger_details: ArInvoiceCancellationArSubledgerDetailDto;
  tax_ledger_details: ArInvoiceCancellationTaxLedgerDetailDto[];
  posting_details: ArInvoiceCancellationPostingDetailsDto;
}
