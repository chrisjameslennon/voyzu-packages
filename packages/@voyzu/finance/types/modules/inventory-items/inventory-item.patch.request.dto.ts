import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryItemUpdateRequestDto } from "./inventory-item.update.request.dto";
import { NormalizableBusinessCode } from "@voyzu/finance/types/constraints";

export const InventoryItemPatchRequestDto = StrictObject({
  ...Type.Partial(InventoryItemUpdateRequestDto).properties,
  item_code: Type.Optional(NormalizableBusinessCode),
}, { minProperties: 1 });
export type InventoryItemPatchRequestDto = Type.Static<typeof InventoryItemPatchRequestDto>;
