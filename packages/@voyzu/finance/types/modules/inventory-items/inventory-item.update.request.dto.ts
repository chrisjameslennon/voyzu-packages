import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryItemCreateRequestDto } from "./inventory-item.create.request.dto";

export const InventoryItemUpdateRequestDto = Type.Omit(InventoryItemCreateRequestDto, ["item_code"], {
  additionalProperties: false,
});
export type InventoryItemUpdateRequestDto = Type.Static<typeof InventoryItemUpdateRequestDto>;
