import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { NonBlankText } from "../../common/types/constraints";

export const DimensionUpdateRequestDto = StrictObject({
  name: NonBlankText,
});
export type DimensionUpdateRequestDto = Type.Static<typeof DimensionUpdateRequestDto>;
