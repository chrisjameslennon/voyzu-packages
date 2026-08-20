import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryItemUpdateRequestDto } from "./inventory-item.update.request.dto";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const InventoryItemBatchUpdateRequestDto = StrictObject({
  ...InventoryItemUpdateRequestDto.properties,
  item_code: BusinessCode,
});
export type InventoryItemBatchUpdateRequestDto = Type.Static<typeof InventoryItemBatchUpdateRequestDto>;
