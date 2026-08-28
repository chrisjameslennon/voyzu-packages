import type { AccountType } from "@voyzu/finance/types/modules/core";
export interface CompanyPostingContextRow {
  id: number;
  organization_id: number;
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status: string;
}

export interface CounterpartyPostingContextRow {
  id: number;
  finance_organization_id: number;
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
  document_code: "AP_BILL";
  status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_type: AccountType;
  gl_account_status: "ACTIVE" | "INACTIVE";
}

export interface ApBillItemPostingProfileRow {
  item_code: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  item_status: "ACTIVE" | "INACTIVE";
  profile_code: string;
  profile_status: "ACTIVE" | "INACTIVE";
  is_purchased: boolean;
  purchase_gl_account_id: number | null;
  purchase_gl_account_code: string | null;
  purchase_gl_account_name: string | null;
  purchase_gl_account_type: AccountType | null;
  purchase_gl_account_status: "ACTIVE" | "INACTIVE" | null;
}

export interface ControlAccountPostingRow {
  control_account_code: "AP_TRADE_PAYABLES";
  control_account_name: string;
  control_account_status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_status: "ACTIVE" | "INACTIVE";
}

export interface InventoryControlAccountPostingRow {
  control_account_code: "INVENTORY_CONTROL";
  control_account_name: string;
  control_account_status: "ACTIVE" | "INACTIVE";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  gl_account_status: "ACTIVE" | "INACTIVE";
}

export interface TaxMovementControlAccountRow {
  tax_movement_type_code: "TAX_ON_PURCHASES";
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
  code: "AP_BILL";
  status: "ACTIVE" | "INACTIVE";
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
}

export interface TaxRuleRow {
  id: number;
  code: string;
  country_code: string;
  region_code: string | null;
  name: string;
  invoice_label: string;
  report_label: string;
  calculation_method: "NO_TAX" | "CONFIGURED_COMPONENTS" | "CALLER_SUPPLIED";
  component_mode: "NONE" | "CONFIGURED" | "CALLER_SUPPLIED";
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

export interface InsertApSubledgerEntryRow {
  code: string;
  finance_organization_id: number;
  journal_header_id: number;
  ap_counterparty_id: number;
  document_type_code: "AP_BILL";
  document_id: string;
  supplier_invoice_number: string;
  description: string;
  posting_date: string;
  document_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
  memo: string | null;
}

export interface ApSubledgerEntryRow extends InsertApSubledgerEntryRow {
  id: number;
  ap_subledger_entry_code: string;
}

export interface InsertTaxLedgerHeaderRow {
  code: string;
  finance_organization_id: number;
  journal_header_id: number;
  document_type_code: "AP_BILL";
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
  tax_movement_type_code: "TAX_ON_PURCHASES";
  scheme_code: string | null;
  invoice_label: string | null;
  report_label: string | null;
  tax_rate: number;
  taxable_base_currency_amount: number;
  dr_cr: "DR";
  base_currency_amount: number;
}

export interface TaxLedgerEntryRow extends InsertTaxLedgerLineRow {
  id: number;
  tax_ledger_entry_code: string;
}
