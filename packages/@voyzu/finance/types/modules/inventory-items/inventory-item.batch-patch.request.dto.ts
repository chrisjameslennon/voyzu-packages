import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryItemPatchRequestDto } from "./inventory-item.patch.request.dto";
import { BusinessCode } from "@voyzu/finance/types/constraints";

export const InventoryItemBatchPatchRequestDto = StrictObject({
  ...InventoryItemPatchRequestDto.properties,
  item_code: BusinessCode,
});
export type InventoryItemBatchPatchRequestDto = Type.Static<typeof InventoryItemBatchPatchRequestDto>;
