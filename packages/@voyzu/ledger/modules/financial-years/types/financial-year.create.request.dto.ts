import Type from "typebox";
import { StrictObject } from "@voyzu/types/http-api";
import { FinancialYearStatus } from "./financial-year.response.dto";
import { BusinessCode14, IsoDate, TrimmedText120 } from "../../common/types/constraints";

export const FinancialYearCreateRequestDto = StrictObject({
  code: BusinessCode14,
  name: Type.Optional(TrimmedText120),
  startDate: IsoDate,
  endDate: IsoDate,
  status: FinancialYearStatus,
});
export type FinancialYearCreateRequestDto = Type.Static<typeof FinancialYearCreateRequestDto>;
