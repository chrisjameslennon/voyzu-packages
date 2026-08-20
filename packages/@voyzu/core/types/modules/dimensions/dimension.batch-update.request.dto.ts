import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DimensionUpdateRequestDto } from "./dimension.update.request.dto";
import { BusinessCode14 } from "@voyzu/core/types/constraints";

export const DimensionBatchUpdateRequestDto = StrictObject({
  ...DimensionUpdateRequestDto.properties,
  code: BusinessCode14,
});
export type DimensionBatchUpdateRequestDto = Type.Static<typeof DimensionBatchUpdateRequestDto>;
