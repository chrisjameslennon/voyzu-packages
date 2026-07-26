import type { InventoryDocumentSourceDto } from "./inventory-receipt.request.dto";

export interface InventoryAdjustmentLineRequestDto {
  line_id?: number | null;
  inventory_item_code: string;
  description?: string | null;
  adjustment_type: "QUANTITY_ADJUSTMENT" | "VALUE_ADJUSTMENT";
  quantity_delta?: number | string | null;
  unit_book_value?: number | string | null;
  book_value_delta?: number | string | null;
  reason_code?: string | null;
  dimensions?: Record<string, string> | null;
}

export interface InventoryAdjustmentRequestDto {
  document_type: "INVENTORY_ADJUSTMENT";
  company_code: string;
  document_id?: string | null;
  memo?: string | null;
  adjustment_date: string;
  posting_date?: string | null;
  source: InventoryDocumentSourceDto;
  lines: InventoryAdjustmentLineRequestDto[];
}
