import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode14, NonBlankText } from "@voyzu/finance/types/constraints";

export const DimensionCreateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
});
export type DimensionCreateRequestDto = Type.Static<typeof DimensionCreateRequestDto>;
