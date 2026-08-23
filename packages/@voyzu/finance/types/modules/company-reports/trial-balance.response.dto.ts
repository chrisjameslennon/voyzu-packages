import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const TrialBalanceLineDto = StrictObject({
  glAccountId: PositiveId,
  glAccountCode: BusinessCode,
  glAccountName: NonBlankText,
  accountType: AccountType,
  debitTotal: Type.Number(),
  creditTotal: Type.Number(),
});
export type TrialBalanceLineDto = Type.Static<typeof TrialBalanceLineDto>;

export const TrialBalanceResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  asAtDate: Type.Union([IsoDate, Type.Null()]),
  lines: Type.Array(TrialBalanceLineDto),
  totalDebit: Type.Number(),
  totalCredit: Type.Number(),
});
export type TrialBalanceResponseDto = Type.Static<typeof TrialBalanceResponseDto>;

