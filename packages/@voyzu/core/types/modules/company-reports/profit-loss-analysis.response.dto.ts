import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { ProfitLossSection } from "./profit-loss.response.dto";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ProfitLossDimensionSelectionDto = StrictObject({
  dimensionCode: BusinessCode,
  dimensionName: NonBlankText,
  valueNames: Type.Array(Type.String()),
});
export type ProfitLossDimensionSelectionDto = Type.Static<typeof ProfitLossDimensionSelectionDto>;

export const ProfitLossBreakdownDto = StrictObject({
  dimensionCode: BusinessCode,
  dimensionName: NonBlankText,
  valueNames: Type.Array(Type.String()),
});
export type ProfitLossBreakdownDto = Type.Static<typeof ProfitLossBreakdownDto>;

export const ProfitLossAnalysisLineDto = StrictObject({
  glAccountId: PositiveId,
  glAccountCode: BusinessCode,
  glAccountName: NonBlankText,
  section: ProfitLossSection,
  amount: Type.Number(),
  amountsByColumn: Type.Record(Type.String(), Type.Number()),
  categoryCode: Type.Optional(Type.Union([BusinessCode, Type.Null()])),
  categoryName: Type.Optional(Type.Union([NonBlankText, Type.Null()])),
  categorySequence: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});
export type ProfitLossAnalysisLineDto = Type.Static<typeof ProfitLossAnalysisLineDto>;

export const ProfitLossAnalysisResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  dimensionFilters: Type.Array(ProfitLossDimensionSelectionDto),
  breakdown: Type.Union([ProfitLossBreakdownDto, Type.Null()]),
  breakdownColumns: Type.Array(Type.String()),
  incomeLines: Type.Array(ProfitLossAnalysisLineDto),
  expenseLines: Type.Array(ProfitLossAnalysisLineDto),
  totalIncome: Type.Number(),
  totalExpenses: Type.Number(),
  netProfit: Type.Number(),
});
export type ProfitLossAnalysisResponseDto = Type.Static<typeof ProfitLossAnalysisResponseDto>;
