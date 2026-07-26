import type { DrCr } from "@voyzu/types/modules/core";
export interface InventoryProcessingLineDimensionDto {
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface InventoryProcessingDetailedLineDto {
  line_id: number;
  inventory_item_code: string;
  inventory_item_name: string;
  item_posting_profile_code: string;
  description: string;
  movement: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_QUANTITY_ADJUSTMENT" | "INVENTORY_VALUE_ADJUSTMENT";
  quantity_delta: number;
  valuation_method: string | null;
  issue_purpose: "SOLD" | "CONSUMED" | null;
  adjustment_type: "QUANTITY_ADJUSTMENT" | "VALUE_ADJUSTMENT" | null;
  unit_book_value_supplied: number | null;
  unit_book_value_used: number | null;
  book_value_delta: number;
  qty_balance: number;
  avg_unit_value: number;
  book_value_balance: number;
  dimensions: Record<string, string>;
}

export interface InventoryProcessingDetailedDocumentDto {
  company: {
    code: string;
    base_currency_code: string;
  };
  document_type: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
  document_id: string;
  memo: string | null;
  source: {
    source_document: string;
    source_document_id: string | null;
    source_type: string | null;
    source_line_id: number | null;
  };
  generated_description: string;
  document_date: string;
  posting_date: string;
  lines: InventoryProcessingDetailedLineDto[];
  total_book_value_increase: number;
  total_book_value_decrease: number;
}

export interface InventoryLedgerLineDetailDto {
  id: number | null;
  inventory_ledger_entry_header_id: number | null;
  line_number: number;
  movement: string;
  inventory_item_code: string;
  inventory_item_name: string;
  inventory_control_account_code: string;
  qty_delta: number;
  unit_value_supplied: number | null;
  book_value_delta: number;
  qty_balance: number;
  avg_unit_value: number;
  book_value_balance: number;
  memo: string | null;
}

export interface InventoryLedgerDetailsDto {
  inventory_ledger_entry_header: {
    id: number | null;
    code: string | null;
    company_code: string;
    journal_header_id: number | null;
    source_document_type_code: string;
    document_id: string;
    generated_description: string;
    document_date: string;
    posting_date: string;
    financial_year_code: string;
    financial_period_code: string;
    base_currency_code: string;
    status: "POSTED" | "EPHEMERAL";
  };
  inventory_ledger_lines: InventoryLedgerLineDetailDto[];
}

export interface InventoryProcessingJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
  document_id: string;
  generated_description: string;
  posting_engine_code: "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
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

export interface InventoryProcessingJournalLineDto {
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
  dimensions?: InventoryProcessingLineDimensionDto[];
}

export interface InventoryProcessingPostingDetailsDto {
  journal_header: InventoryProcessingJournalHeaderDto;
  journal_lines: InventoryProcessingJournalLineDto[];
}

export interface InventoryProcessingPostingResponseDto {
  detailed_document: InventoryProcessingDetailedDocumentDto;
  inventory_ledger_details: InventoryLedgerDetailsDto;
  posting_details: InventoryProcessingPostingDetailsDto;
}
