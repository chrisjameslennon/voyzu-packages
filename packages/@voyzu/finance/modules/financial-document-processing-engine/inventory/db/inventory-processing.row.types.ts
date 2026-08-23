import type { AccountType } from "@voyzu/finance/types/modules/core";
export interface CompanyPostingContextRow {
  id: number;
  code: string;
  name: string;
  base_currency_code: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface DocumentProcessorValidationRow {
  code: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
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

export interface DimensionValueLookupRow {
  dimension_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_status: "ACTIVE" | "INACTIVE";
  dimension_value_id: number;
  dimension_value_name: string;
  dimension_value_status: "ACTIVE" | "INACTIVE";
}

export interface GlAccountPostingRow {
  id: number;
  code: string;
  name: string;
  account_type: AccountType;
  status: "ACTIVE" | "INACTIVE";
}

export interface InventoryControlAccountPostingRow {
  code: "INVENTORY_CONTROL";
  name: string;
  status: "ACTIVE" | "INACTIVE";
  gl_account: GlAccountPostingRow;
}

export interface InventoryItemPostingRow {
  id: number;
  code: string;
  name: string;
  description: string;
  item_type: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  is_sold: boolean;
  is_purchased: boolean;
  is_consumed: boolean;
  status: "ACTIVE" | "INACTIVE";
  posting_profile_code: string;
  posting_profile_name: string;
  posting_profile_status: "ACTIVE" | "INACTIVE";
  cogs_gl_account: GlAccountPostingRow | null;
  consumption_gl_account: GlAccountPostingRow | null;
  adjustment_gain_gl_account: GlAccountPostingRow | null;
  adjustment_loss_gl_account: GlAccountPostingRow | null;
}

export interface InventoryBalanceRow {
  item_id: number;
  qty_balance: number;
  avg_unit_value: number;
  book_value_balance: number;
}

export interface InsertInventoryLedgerHeaderRow {
  code: string;
  finance_company_id: number;
  journal_header_id: number;
  source_document_type_code: string;
  document_id: string;
  description: string;
  memo: string | null;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
}

export interface InventoryLedgerHeaderRow extends InsertInventoryLedgerHeaderRow {
  id: number;
}

export interface InsertInventoryLedgerLineRow {
  inventory_ledger_entry_header_id: number;
  line_number: number;
  movement_type_code: string;
  item_id: number;
  description: string;
  inventory_control_account_code: "INVENTORY_CONTROL";
  qty_delta: number;
  unit_value_supplied: number | null;
  book_value_delta: number;
  qty_balance: number;
  avg_unit_value: number;
  book_value_balance: number;
  memo: string | null;
}

export interface InventoryLedgerLineRow extends InsertInventoryLedgerLineRow {
  id: number;
}
