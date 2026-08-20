import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "@voyzu/core/types/constraints";

export const ControlAccountPatchRequestDto = StrictObject({
  glAccountId: Type.Optional(PositiveId),
}, { minProperties: 1 });
export type ControlAccountPatchRequestDto = Type.Static<typeof ControlAccountPatchRequestDto>;
