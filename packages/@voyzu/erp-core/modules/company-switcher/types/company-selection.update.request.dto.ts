import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { PositiveId } from "@voyzu/erp-core/types/constraints";

export const CompanySelectionUpdateRequestDto = StrictObject({
  companyId: PositiveId,
});
export type CompanySelectionUpdateRequestDto = Type.Static<typeof CompanySelectionUpdateRequestDto>;
