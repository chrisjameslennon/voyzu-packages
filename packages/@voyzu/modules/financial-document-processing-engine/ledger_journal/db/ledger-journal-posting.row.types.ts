export interface CompanyPostingContextRow {
  id: number;
  code: string;
  name: string;
  base_currency_code: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface DocumentProcessorValidationRow {
  code: "LEDGER_JOURNAL" | "LEDGER_JOURNAL_REVERSAL";
  status: "ACTIVE" | "INACTIVE";
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
}

export interface FiscalPostingPeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_year_status: "OPEN" | "CLOSED";
  financial_period_id: number;
  financial_period_code: string;
  financial_period_status: "OPEN" | "CLOSED";
  period_start_date: string;
  period_end_date: string;
}

export interface GlAccountPostingRow {
  id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProtectedGlAccountLinkRow {
  gl_account_code: string;
  source: "POSTING_CODE" | "CONTROL_ACCOUNT" | "TAX_CONTROL_ACCOUNT" | "BANK_CASH";
  source_code: string;
  source_status: "ACTIVE" | "INACTIVE";
}

export interface DimensionValueLookupRow {
  dimension_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_status: "ACTIVE" | "INACTIVE";
  dimension_value_id: number;
  dimension_value_name: string;
  dimension_value_status: "ACTIVE" | "INACTIVE";
}

export interface SourceJournalHeaderRow {
  id: number;
  code: string;
  company_id: number;
  company_code: string;
  company_name: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  document_memo: string | null;
  generated_description: string;
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
  status: string;
  reversal_of_journal_id: number | null;
  reversed_by_journal_id: number | null;
}
