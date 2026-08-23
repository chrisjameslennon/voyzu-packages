import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { FinancialYearStatus } from "./financial-year.response.dto";
import { BusinessCode14, IsoDate, TrimmedText120 } from "@voyzu/finance/types/constraints";

export const FinancialYearCreateRequestDto = StrictObject({
  code: BusinessCode14,
  name: Type.Optional(TrimmedText120),
  startDate: IsoDate,
  endDate: IsoDate,
  status: FinancialYearStatus,
});
export type FinancialYearCreateRequestDto = Type.Static<typeof FinancialYearCreateRequestDto>;
