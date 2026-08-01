import type { InventoryItemPatchRequestDto } from "./inventory-item.patch.request.dto";

export interface InventoryItemBatchPatchRequestDto extends InventoryItemPatchRequestDto {
  item_code: string;
}
