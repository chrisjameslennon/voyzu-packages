import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { GlAccountUpdateRequestDto } from "./gl-account.update.request.dto";
import { BusinessCode14 } from "@voyzu/finance/types/constraints";

export const GlAccountBatchUpdateRequestDto = StrictObject({
  ...GlAccountUpdateRequestDto.properties,
  code: BusinessCode14,
});
export type GlAccountBatchUpdateRequestDto = Type.Static<typeof GlAccountBatchUpdateRequestDto>;
