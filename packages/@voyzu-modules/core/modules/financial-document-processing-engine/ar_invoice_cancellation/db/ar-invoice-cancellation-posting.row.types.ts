export interface InvoiceCancellationCompanyContextRow {
  id: number;
  code: string;
  name: string;
  base_currency_code: string;
  status: string;
}

export interface InvoiceCancellationCounterpartyContextRow {
  id: number;
  company_id: number;
  code: string;
  name: string;
  status: string;
}

export interface InvoiceCancellationFiscalPeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
}

export interface InvoiceCancellationControlAccountRow {
  control_account_code: string;
  control_account_name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

export interface InvoiceCancellationTaxMovementControlAccountRow {
  tax_movement_type_code: string;
  tax_movement_type_name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

export interface InvoiceCancellationPostingCodeAccountRow {
  id: number;
  code: string;
  name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

export interface InvoiceCancellationDimensionValueLookupRow {
  dimension_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_id: number;
  dimension_value_name: string;
}

export interface InvoiceCancellationOpenInvoiceRow {
  ar_subledger_entry_id: number;
  ar_subledger_entry_code: string;
  journal_header_id: number;
  journal_code: string;
  ar_counterparty_id: number;
  posting_date: string;
  base_currency_code: string;
  base_currency_amount: number;
  applied_amount: number;
  open_amount: number;
  document_id: string | null;
}

export interface InsertInvoiceCancellationArSubledgerEntryRow {
  ar_subledger_entry_code: string;
  company_id: number;
  journal_header_id: number;
  ar_counterparty_id: number;
  control_account_code: "AR_TRADE_RECEIVABLES";
  applied_to_ar_subledger_entry_id: number;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  memo: string | null;
}

export interface InvoiceCancellationArSubledgerEntryRow extends InsertInvoiceCancellationArSubledgerEntryRow {
  id: number;
}

export interface InsertInvoiceCancellationTaxLedgerHeaderRow {
  code: string;
  company_id: number;
  journal_header_id: number;
  document_type_code: "AR_INVOICE_CANCELLATION";
  document_id: string;
  description: string;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
}

export interface InvoiceCancellationTaxLedgerHeaderRow extends InsertInvoiceCancellationTaxLedgerHeaderRow {
  id: number;
}

export interface InsertInvoiceCancellationTaxLedgerEntryRow {
  tax_ledger_entry_header_id: number;
  line_number: number;
  tax_rule_id: number;
  tax_component_id: number | null;
  tax_authority_id: number;
  tax_movement_type_code: "TAX_ON_SALES";
  scheme_code: string | null;
  invoice_label: string | null;
  report_label: string | null;
  tax_rate: number;
  taxable_base_currency_amount: number;
  dr_cr: "DR";
  base_currency_amount: number;
}

export interface InvoiceCancellationTaxLedgerEntryRow extends InsertInvoiceCancellationTaxLedgerEntryRow {
  id: number;
  tax_ledger_entry_code: string;
}
