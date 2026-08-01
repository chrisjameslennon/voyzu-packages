import type { InventoryItemUpdateRequestDto } from "./inventory-item.update.request.dto";

export interface InventoryItemBatchUpdateRequestDto extends InventoryItemUpdateRequestDto {
  item_code: string;
}
