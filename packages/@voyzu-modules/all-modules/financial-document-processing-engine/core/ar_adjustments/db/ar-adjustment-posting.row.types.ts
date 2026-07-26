import type { DrCr } from "@voyzu/types/modules/core";
import type { ArInvoiceDetailedInvoiceDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import type { DbExecutor } from "@voyzu/capability/db";

export type ArAdjustmentDocumentType = "AR_CREDIT_NOTE" | "AR_OPENING_BALANCE" | "AR_REFUND" | "AR_WRITE_OFF";

export interface CompanyRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status: string;
}

export interface DocumentProcessorRow {
  code: ArAdjustmentDocumentType;
  name: string;
  status: string;
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
}

export interface CounterpartyRow {
  id: number;
  company_id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
  country_currency_code: string;
  was_created?: boolean;
}

export interface PeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
}

export interface AccountRow {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  code?: string;
  bank_cash_control_account_code?: string;
  control_account_code?: string;
  control_account_name?: string;
}

export interface TaxMovementAccountRow {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  tax_movement_type_code: string;
}

export interface TaxRuleRow {
  id: number;
  code: string;
  calculation_method: string;
  invoice_label?: string | null;
  report_label?: string | null;
}

export interface TaxComponentRow {
  id: number;
  tax_rule_code: string;
  tax_authority_id: number;
  tax_authority_code: string;
  tax_authority_name: string;
  scheme_code?: string | null;
  invoice_label?: string | null;
  report_label?: string | null;
  rate: number;
}

export interface TaxAuthorityRow {
  id: number;
  code: string;
  name: string;
}

export interface DimensionValueRow {
  dimension_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_status: "ACTIVE" | "INACTIVE";
  dimension_value_id: number;
  dimension_value_name: string;
  dimension_value_status: "ACTIVE" | "INACTIVE";
}

export interface OpenItemRow {
  ar_subledger_entry_id: number;
  ar_subledger_entry_code: string;
  document_id: string;
  journal_code: string;
  open_amount: number;
  original_invoice?: ArInvoiceDetailedInvoiceDto | null;
}

export interface InsertArHeaderInput {
  code: string;
  company_id: number;
  journal_header_id: number;
  ar_counterparty_id: number;
  document_type_code: ArAdjustmentDocumentType;
  document_id: string;
  description: string;
  memo: string | null;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
}

export interface InsertArLineInput {
  ar_subledger_entry_header_id: number;
  line_number: number;
  line_type: string;
  description: string;
  control_account_code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH";
  dr_cr: DrCr;
  quantity?: number | null;
  unit_amount?: number | null;
  net_amount?: number | null;
  tax_amount?: number | null;
  gross_amount: number;
  revenue_posting_code?: string | null;
  tax_rule_code?: string | null;
  source_entry_header_id?: number | null;
  target_entry_header_id?: number | null;
  base_currency_amount: number;
  memo: string | null;
}

export interface InsertTaxHeaderInput {
  code: string;
  company_id: number;
  journal_header_id: number;
  document_type_code: ArAdjustmentDocumentType;
  document_id: string;
  description: string;
  document_date: string;
  posting_date: string;
  financial_year_id: number;
  financial_period_id: number;
  base_currency_code: string;
}

export interface InsertTaxLineInput {
  tax_ledger_entry_header_id: number;
  line_number: number;
  tax_rule_id: number;
  tax_component_id: number | null;
  tax_authority_id: number;
  tax_movement_type_code: "TAX_ON_SALES";
  scheme_code?: string | null;
  invoice_label?: string | null;
  report_label?: string | null;
  tax_rate: number;
  taxable_base_currency_amount: number;
  dr_cr: DrCr;
  base_currency_amount: number;
}

export type ArAdjustmentDb = DbExecutor;
