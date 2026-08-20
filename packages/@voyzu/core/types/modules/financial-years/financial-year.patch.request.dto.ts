import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode14, IsoDate, TrimmedText120 } from "@voyzu/core/types/constraints";

export const FinancialYearPatchRequestDto = StrictObject({
  code: Type.Optional(BusinessCode14),
  name: Type.Optional(TrimmedText120),
  startDate: Type.Optional(IsoDate),
  endDate: Type.Optional(IsoDate),
}, { minProperties: 1 });
export type FinancialYearPatchRequestDto = Type.Static<typeof FinancialYearPatchRequestDto>;
