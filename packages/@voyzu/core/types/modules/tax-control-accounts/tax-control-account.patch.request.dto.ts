import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "@voyzu/core/types/constraints";

export const TaxControlAccountPatchRequestDto = StrictObject({
  glAccountId: Type.Optional(PositiveId),
}, { minProperties: 1 });
export type TaxControlAccountPatchRequestDto = Type.Static<typeof TaxControlAccountPatchRequestDto>;
