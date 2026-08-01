import type { ActorType } from "@voyzu/core/types/modules/core";
export interface JournalHeaderRow {
  id: number;
  code: string;
  ar_subledger_entry_code: string | null;
  ap_subledger_entry_code: string | null;
  tax_ledger_entry_code: string | null;
  company_id: number;
  company_code: string;
  company_name: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  description: string;
  document_snapshot_json: Record<string, unknown>;
  detailed_document_snapshot_json: Record<string, unknown>;
  posting_engine_code: string;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
  base_currency_code: string;
  number_lines: number;
  total_debit_base_amount: number | null;
  total_credit_base_amount: number | null;
  memo: string | null;
  status: string;
  reversal_of_journal_id: number | null;
  reversal_of_journal_code: string | null;
  reversed_by_journal_id: number | null;
  reversed_by_journal_code: string | null;
  bank_cash_account_id: number | null;
  bank_cash_code: string | null;
  bank_cash_type: string | null;
  bank_cash_gl_account_id: number | null;
  bank_cash_gl_account_code: string | null;
  bank_cash_gl_account_name: string | null;
  bank_cash_bank_name: string | null;
  bank_cash_bank_branch_name: string | null;
  bank_cash_account_identifier: string | null;
  bank_cash_cash_account_identifier: string | null;
  bank_cash_tx_id: string | null;
  bank_cash_tx_code: string | null;
  bank_cash_tx_ref: string | null;
  bank_cash_tx_details: string | null;
  bank_cash_payment_ref: string | null;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertJournalHeaderRow {
  id?: number;
  company_id: number;
  company_code: string;
  company_name: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  description: string;
  document_snapshot_json?: unknown;
  detailed_document_snapshot_json?: unknown;
  posting_engine_code: string;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
  base_currency_code: string;
  memo?: string | null;
  reversal_of_journal_id?: number | null;
  bank_cash_account_id?: number | null;
  bank_cash_code?: string | null;
  bank_cash_type?: string | null;
  bank_cash_gl_account_id?: number | null;
  bank_cash_gl_account_code?: string | null;
  bank_cash_gl_account_name?: string | null;
  bank_cash_bank_name?: string | null;
  bank_cash_bank_branch_name?: string | null;
  bank_cash_account_identifier?: string | null;
  bank_cash_cash_account_identifier?: string | null;
  bank_cash_tx_id?: string | null;
  bank_cash_tx_code?: string | null;
  bank_cash_tx_ref?: string | null;
  bank_cash_tx_details?: string | null;
  bank_cash_payment_ref?: string | null;
  creation_user_id?: string | null;
}

export type PatchJournalHeaderRow = {
  financial_year_id?: number;
  financial_year_code?: string;
  financial_period_id?: number;
  financial_period_code?: string;
  posting_date?: string;
  memo?: string | null;
  updated_user_id?: string | null;
};

export interface JournalLineRow {
  id: number;
  journal_header_id: number;
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: string | null;
  source_control_account: string | null;
  description: string;
  memo: string | null;
  dr_cr: string;
  base_currency_amount: number;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
}

export interface InsertJournalLineRow {
  journal_header_id: number;
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger?: string | null;
  source_control_account?: string | null;
  description: string;
  memo?: string | null;
  dr_cr: string;
  base_currency_amount: number;
  creation_user_id?: string | null;
}

export interface JournalLineDimensionRow {
  id: number;
  journal_line_id: number;
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
}

export interface InsertJournalLineDimensionRow {
  journal_line_id: number;
  dimension_id: number;
  dimension_value_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
  creation_user_id?: string | null;
}
