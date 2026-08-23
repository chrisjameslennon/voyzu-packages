import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DimensionValueStatus } from "./dimension-value.response.dto";
import { DimensionValueName } from "@voyzu/finance/types/constraints";

export const DimensionValuePatchRequestDto = StrictObject({
  name: Type.Optional(DimensionValueName),
  status: Type.Optional(DimensionValueStatus),
}, { minProperties: 1 });
export type DimensionValuePatchRequestDto = Type.Static<typeof DimensionValuePatchRequestDto>;
