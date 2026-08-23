import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode14, NonBlankText } from "@voyzu/finance/types/constraints";

export const DimensionPatchRequestDto = StrictObject({
  code: Type.Optional(BusinessCode14),
  name: Type.Optional(NonBlankText),
}, { minProperties: 1 });
export type DimensionPatchRequestDto = Type.Static<typeof DimensionPatchRequestDto>;
