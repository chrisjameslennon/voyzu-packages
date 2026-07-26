import type { InventoryItemUpdateRequestDto } from "./inventory-item.update.request.dto";

export type InventoryItemPatchRequestDto = Partial<InventoryItemUpdateRequestDto> & {
  item_code?: string;
};
