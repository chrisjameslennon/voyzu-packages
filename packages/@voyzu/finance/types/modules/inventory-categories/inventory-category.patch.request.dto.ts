import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryCategoryUpdateRequestDto } from "./inventory-category.update.request.dto";
import { NormalizableBusinessCode } from "@voyzu/finance/types/constraints";

export const InventoryCategoryPatchRequestDto = StrictObject({
  ...Type.Partial(InventoryCategoryUpdateRequestDto).properties,
  code: Type.Optional(NormalizableBusinessCode),
}, { minProperties: 1 });
export type InventoryCategoryPatchRequestDto = Type.Static<typeof InventoryCategoryPatchRequestDto>;
