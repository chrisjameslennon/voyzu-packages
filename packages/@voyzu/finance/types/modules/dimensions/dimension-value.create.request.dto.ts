import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { DimensionValueStatus } from "./dimension-value.response.dto";
import { DimensionValueName } from "@voyzu/finance/types/constraints";

export const DimensionValueCreateRequestDto = StrictObject({
  name: DimensionValueName,
  status: Type.Optional(DimensionValueStatus),
});
export type DimensionValueCreateRequestDto = Type.Static<typeof DimensionValueCreateRequestDto>;
