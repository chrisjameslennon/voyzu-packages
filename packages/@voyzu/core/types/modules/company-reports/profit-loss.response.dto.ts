import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ProfitLossSection = Type.Union([Type.Literal("INCOME"), Type.Literal("EXPENSE")]);
export type ProfitLossSection = Type.Static<typeof ProfitLossSection>;

export const ProfitLossLineDto = StrictObject({
  glAccountId: PositiveId,
  glAccountCode: BusinessCode,
  glAccountName: NonBlankText,
  section: ProfitLossSection,
  amount: Type.Number(),
  categoryCode: Type.Optional(Type.Union([BusinessCode, Type.Null()])),
  categoryName: Type.Optional(Type.Union([NonBlankText, Type.Null()])),
  categorySequence: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});
export type ProfitLossLineDto = Type.Static<typeof ProfitLossLineDto>;

export const ProfitLossResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  incomeLines: Type.Array(ProfitLossLineDto),
  expenseLines: Type.Array(ProfitLossLineDto),
  totalIncome: Type.Number(),
  totalExpenses: Type.Number(),
  netProfit: Type.Number(),
});
export type ProfitLossResponseDto = Type.Static<typeof ProfitLossResponseDto>;
