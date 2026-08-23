export interface ReceiptApplicationCompanyContextRow {
  id: number;
  code: string;
  name: string;
  base_currency_code: string;
  status: string;
}

export interface ReceiptApplicationCounterpartyContextRow {
  id: number;
  finance_organization_id: number;
  code: string;
  name: string;
  status: string;
}

export interface ReceiptApplicationFiscalPeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
}

export interface ReceiptApplicationControlAccountRow {
  control_account_code: string;
  control_account_name: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

export interface ReceiptApplicationOpenItemRow {
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

export interface InsertReceiptApplicationArSubledgerEntryRow {
  ar_subledger_entry_code: string;
  finance_organization_id: number;
  journal_header_id: number;
  ar_counterparty_id: number;
  control_account_code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH";
  applied_to_ar_subledger_entry_id: number | null;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
  memo: string | null;
}

export interface ReceiptApplicationArSubledgerEntryRow extends InsertReceiptApplicationArSubledgerEntryRow {
  id: number;
  ar_subledger_entry_code: string;
}
