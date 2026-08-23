import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "@voyzu/finance/types/constraints";

export const InventoryControlAccountPatchRequestDto = StrictObject({
  glAccountId: Type.Optional(PositiveId),
}, { minProperties: 1 });
export type InventoryControlAccountPatchRequestDto = Type.Static<typeof InventoryControlAccountPatchRequestDto>;
