import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, NonBlankText } from "@voyzu/finance/types/constraints";

export const ApCounterpartySummaryResponseDto = StrictObject({
  counterpartyCode: BusinessCode,
  counterpartyName: NonBlankText,
  openBillsAmount: Type.Number(),
  unappliedPaymentsAmount: Type.Number(),
  netBalance: Type.Number(),
});
export type ApCounterpartySummaryResponseDto = Type.Static<typeof ApCounterpartySummaryResponseDto>;
