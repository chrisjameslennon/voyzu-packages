import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DimensionPatchRequestDto } from "./dimension.patch.request.dto";
import { BusinessCode14 } from "@voyzu/core/types/constraints";

export const DimensionBatchPatchRequestDto = StrictObject({
  ...DimensionPatchRequestDto.properties,
  code: BusinessCode14,
});
export type DimensionBatchPatchRequestDto = Type.Static<typeof DimensionBatchPatchRequestDto>;
