import type { DrCr } from "@voyzu/core/types/modules/core";
export interface ApBillCompanySnapshotDto {
  code: string;
  base_currency_code: string;
}

export interface ApBillCounterpartySnapshotDto {
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
}

export interface ApBillApCounterpartyDetailsDto extends ApBillCounterpartySnapshotDto {
  id: number | null;
  company_code: string;
  was_created: boolean;
}

export interface ApBillDetailedTaxComponentDto {
  tax_rule: string;
  tax_rule_id?: number;
  tax_component_id?: number | null;
  tax_authority_id?: number;
  tax_authority_code: string;
  tax_authority_name?: string;
  scheme_code?: string | null;
  invoice_label?: string | null;
  report_label?: string | null;
  tax_rate: number;
  taxable_amount: number;
  raw_tax_amount: number;
  tax_amount: number;
  tax_recoverable: boolean;
}

export interface ApBillDetailedLineDto {
  line_id: number;
  line_description: string;
  quantity: number | null;
  purchase_posting_code: string;
  inventory_item_code: string | null;
  net_amount: number;
  tax_rule: string;
  tax_amount: number;
  gross_amount: number;
  recoverable_tax_amount: number;
  non_recoverable_tax_amount: number;
  purchase_amount: number;
  tax_components: ApBillDetailedTaxComponentDto[];
  dimensions: Record<string, string>;
}

export interface ApBillDetailedDocumentDto {
  company: ApBillCompanySnapshotDto;
  ap_counterparty: ApBillCounterpartySnapshotDto;
  document_id: string;
  supplier_invoice_number: string;
  memo: string | null;
  generated_description: string;
  bill_date: string;
  posting_date: string;
  lines: ApBillDetailedLineDto[];
  net_amount: number;
  recoverable_tax_amount: number;
  non_recoverable_tax_amount: number;
  tax_amount: number;
  gross_amount: number;
}

export interface ApBillApSubledgerDetailsDto {
  id: number | null;
  code: string | null;
  company_code: string;
  journal_header_id: number | null;
  ap_counterparty_code: string;
  control_account_code: "AP_TRADE_PAYABLES";
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: "CREDIT";
  base_currency_amount: number;
  open_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ApBillTaxLedgerDetailDto {
  id: number | null;
  code: string | null;
  tax_rule: string;
  tax_component_id: number | null;
  tax_authority_code: string;
  tax_authority_name?: string;
  tax_movement_type_code: "TAX_ON_PURCHASES";
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
  entry_type: "DEBIT";
  base_currency_amount: number;
  status: "POSTED" | "EPHEMERAL";
}

export interface ApBillJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "AP_BILL";
  document_id: string;
  generated_description: string;
  posting_engine_code: "AP_BILL";
  company_code: string;
  document_date: string;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  total_debit_base_amount: number;
  total_credit_base_amount: number;
  memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface ApBillJournalLineDimensionDto {
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface ApBillJournalLineDto {
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
  memo: string | null;
  dimensions?: ApBillJournalLineDimensionDto[];
}

export interface ApBillPostingDetailsDto {
  journal_header: ApBillJournalHeaderDto;
  journal_lines: ApBillJournalLineDto[];
}

export interface ApBillPostingResponseDto {
  detailed_document: ApBillDetailedDocumentDto;
  ap_subledger_details: ApBillApSubledgerDetailsDto;
  ap_counterparty_details: ApBillApCounterpartyDetailsDto;
  tax_ledger_details: ApBillTaxLedgerDetailDto[];
  posting_details: ApBillPostingDetailsDto;
}
