import type { DrCr } from "@voyzu/core/types/modules/core";
export interface ArInvoiceCompanySnapshotDto {
  code: string;
  base_currency_code: string;
}

export interface ArInvoiceCounterpartySnapshotDto {
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
}

export interface ArInvoiceArCounterpartyDetailsDto extends ArInvoiceCounterpartySnapshotDto {
  id: number | null;
  company_code: string;
  was_created: boolean;
}

export interface ArInvoiceDetailedTaxComponentDto {
  tax_rule: string;
  tax_rule_id?: number;
  tax_component_id?: number | null;
  tax_authority_id?: number;
  tax_authority_code: string;
  tax_authority_name?: string;
  scheme_code?: string;
  invoice_label?: string | null;
  report_label?: string | null;
  tax_rate: number;
  taxable_amount: number;
  raw_tax_amount: number;
  tax_amount: number;
}

export interface ArInvoiceDetailedLineDto {
  line_id: number;
  line_description: string;
  quantity: number | null;
  net_unit_price: number | null;
  revenue_posting_code: string;
  inventory_item_code: string | null;
  tax_rule: string;
  raw_net_line_total: number;
  net_line_total: number;
  tax_components: ArInvoiceDetailedTaxComponentDto[];
  tax_amount: number;
  gross_line_total: number;
  dimensions: Record<string, string>;
}

export interface ArInvoiceDetailedInvoiceDto {
  company: ArInvoiceCompanySnapshotDto;
  ar_counterparty: ArInvoiceCounterpartySnapshotDto;
  document_id: string;
  document_memo: string | null;
  generated_description: string;
  invoice_date: string;
  posting_date: string;
  lines: ArInvoiceDetailedLineDto[];
  net_amount: number;
  tax_amount: number;
  gross_amount: number;
}

export interface ArInvoiceArSubledgerDetailsDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ar_counterparty_code: string;
  control_account_code: "AR_TRADE_RECEIVABLES";
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: "DEBIT";
  base_currency_amount: number;
  open_amount: number;
  document_memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArInvoiceTaxLedgerDetailDto {
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
  entry_type: "CREDIT";
  base_currency_amount: number;
  status: "POSTED" | "EPHEMERAL";
}

export interface ArInvoiceJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "AR_INVOICE";
  document_id: string;
  generated_description: string;
  posting_engine_code: "AR_INVOICE";
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

export interface ArInvoiceJournalLineDimensionDto {
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ArInvoiceJournalLineDto {
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
  dimensions?: ArInvoiceJournalLineDimensionDto[];
}

export interface ArInvoicePostingDetailsDto {
  journal_header: ArInvoiceJournalHeaderDto;
  journal_lines: ArInvoiceJournalLineDto[];
}

export interface ArInvoicePostingResponseDto {
  detailed_document: ArInvoiceDetailedInvoiceDto;
  ar_subledger_details: ArInvoiceArSubledgerDetailsDto;
  ar_counterparty_details: ArInvoiceArCounterpartyDetailsDto;
  tax_ledger_details: ArInvoiceTaxLedgerDetailDto[];
  posting_details: ArInvoicePostingDetailsDto;
}
