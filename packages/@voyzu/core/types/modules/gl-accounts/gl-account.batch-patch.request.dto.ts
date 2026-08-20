import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { GlAccountPatchRequestDto } from "./gl-account.patch.request.dto";
import { BusinessCode14 } from "@voyzu/core/types/constraints";

export const GlAccountBatchPatchRequestDto = StrictObject({
  ...GlAccountPatchRequestDto.properties,
  code: BusinessCode14,
});
export type GlAccountBatchPatchRequestDto = Type.Static<typeof GlAccountBatchPatchRequestDto>;
