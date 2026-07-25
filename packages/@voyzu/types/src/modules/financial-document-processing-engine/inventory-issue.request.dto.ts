import type { InventoryDocumentSourceDto } from "./inventory-receipt.request.dto";

export interface InventoryIssueLineRequestDto {
  line_id?: number | null;
  inventory_item_code: string;
  description?: string | null;
  quantity_delta: number | string;
  issue_purpose: "SOLD" | "CONSUMED";
  dimensions?: Record<string, string> | null;
}

export interface InventoryIssueRequestDto {
  document_type: "INVENTORY_ISSUE";
  company_code: string;
  document_id?: string | null;
  memo?: string | null;
  issue_date: string;
  posting_date?: string | null;
  source: InventoryDocumentSourceDto;
  lines: InventoryIssueLineRequestDto[];
}
