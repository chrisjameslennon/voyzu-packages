export interface InventoryDocumentSourceDto {
  source_document: string;
  source_document_id?: string | null;
  source_type?: string | null;
  source_line_id?: number | null;
}

export interface InventoryReceiptLineRequestDto {
  line_id?: number | null;
  inventory_item_code: string;
  description?: string | null;
  quantity_delta: number | string;
  valuation_method: "SUPPLIED_UNIT_BOOK_VALUE" | "CURRENT_AVERAGE_BOOK_VALUE" | "SOURCE_LINE_UNIT_VALUE";
  unit_book_value?: number | string | null;
  dimensions?: Record<string, string> | null;
}

export interface InventoryReceiptRequestDto {
  document_type: "INVENTORY_RECEIPT";
  company_code: string;
  document_id?: string | null;
  memo?: string | null;
  receipt_date: string;
  posting_date?: string | null;
  source: InventoryDocumentSourceDto;
  lines: InventoryReceiptLineRequestDto[];
}
