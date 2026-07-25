import type { AccountType } from "@voyzu/types/modules/core";
export interface CompanyPostingContextRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status: string;
}

export interface CounterpartyPostingContextRow {
  id: number;
  company_id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
  country_currency_code: string;
}

export interface UpsertCounterpartyResultRow extends CounterpartyPostingContextRow {
  was_created: boolean;
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

export interface PostingCodeAccountRow {
  code: string;
  document_code: "AR_INVOICE";
  status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_type: AccountType;
  gl_account_status: "ACTIVE" | "INACTIVE";
}

export interface ArInvoiceItemPostingProfileRow {
  item_code: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  item_status: "ACTIVE" | "INACTIVE";
  profile_code: string;
  profile_status: "ACTIVE" | "INACTIVE";
  is_sold: boolean;
  revenue_gl_account_id: number | null;
  revenue_gl_account_code: string | null;
  revenue_gl_account_name: string | null;
  revenue_gl_account_type: AccountType | null;
  revenue_gl_account_status: "ACTIVE" | "INACTIVE" | null;
}

export interface ControlAccountPostingRow {
  control_account_code: "AR_TRADE_RECEIVABLES";
  control_account_name: string;
  control_account_status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_status: "ACTIVE" | "INACTIVE";
}

export interface TaxMovementControlAccountRow {
  tax_movement_type_code: "TAX_ON_SALES";
  tax_movement_type_name: string;
  tax_movement_type_status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_status: "ACTIVE" | "INACTIVE";
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

export interface DocumentProcessorValidationRow {
  code: "AR_INVOICE";
  status: "ACTIVE" | "INACTIVE";
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
}

export type TaxRuleCalculationMethod = "NO_TAX" | "CONFIGURED_COMPONENTS" | "CALLER_SUPPLIED";
export type TaxComponentMode = "NONE" | "CONFIGURED" | "CALLER_SUPPLIED";

export interface TaxRuleRow {
  id: number;
  code: string;
  country_code: string;
  region_code: string | null;
  name: string;
  invoice_label: string;
  report_label: string;
  calculation_method: TaxRuleCalculationMethod;
  component_mode: TaxComponentMode;
  component_count: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TaxComponentRow {
  id: number;
  code: string;
  tax_rule_country_code: string;
  tax_rule_code: string;
  tax_authority_code: string;
  tax_authority_id: number;
  tax_authority_name: string;
  scheme_code: string;
  invoice_label: string;
  report_label: string;
  rate: number;
  base_amount_type: "LINE_NET_AMOUNT";
  calculation_order: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TaxAuthorityRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  region_code: string | null;
  jurisdiction_level: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface InsertArSubledgerEntryRow {
  code: string;
  company_id: number;
  journal_header_id: number;
  ar_counterparty_id: number;
  document_type_code: "AR_INVOICE";
  document_id: string;
  description: string;
  posting_date: string;
  document_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
  memo: string | null;
}

export interface ArSubledgerEntryRow extends InsertArSubledgerEntryRow {
  id: number;
  ar_subledger_entry_code: string;
}

export interface InsertTaxLedgerHeaderRow {
  code: string;
  company_id: number;
  journal_header_id: number;
  document_type_code: "AR_INVOICE";
  document_id: string;
  description: string;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
}

export interface TaxLedgerHeaderRow extends InsertTaxLedgerHeaderRow {
  id: number;
}

export interface InsertTaxLedgerLineRow {
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
  dr_cr: "CR";
  base_currency_amount: number;
}

export interface TaxLedgerEntryRow extends InsertTaxLedgerLineRow {
  id: number;
  tax_ledger_entry_code: string;
}
