import type { AccountType } from "@voyzu/core/types/modules/core";
export interface ReceiptCompanyContextRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status: string;
}

export interface ReceiptCounterpartyContextRow {
  id: number;
  company_id: number;
  code: string;
  name: string;
  status: string;
  country_code: string;
  tax_region_or_province: string | null;
  country_currency_code: string;
}

export interface ReceiptFiscalPeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
  period_start_date: string;
  period_end_date: string;
}

export interface ReceiptPostingCodeAccountRow {
  id: number;
  code: string;
  name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_type: AccountType;
}

export interface ReceiptControlAccountRow {
  control_account_code: string;
  control_account_name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

export interface InvoiceOpenItemRow {
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

export interface InsertReceiptArSubledgerEntryRow {
  ar_subledger_entry_code: string;
  company_id: number;
  journal_header_id: number;
  ar_counterparty_id: number;
  control_account_code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH";
  applied_to_ar_subledger_entry_id: number | null;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  memo: string | null;
}

export interface ReceiptArSubledgerEntryRow extends InsertReceiptArSubledgerEntryRow {
  id: number;
  ar_subledger_entry_code: string;
}
