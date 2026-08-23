import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const BalanceSheetSection = Type.Union([Type.Literal("ASSET"), Type.Literal("LIABILITY"), Type.Literal("EQUITY")]);
export type BalanceSheetSection = Type.Static<typeof BalanceSheetSection>;

export const BalanceSheetLineDto = StrictObject({
  glAccountId: Type.Union([PositiveId, Type.Null()]),
  glAccountCode: Type.Union([BusinessCode, Type.Null()]),
  glAccountName: NonBlankText,
  section: BalanceSheetSection,
  amount: Type.Number(),
  categoryCode: Type.Optional(Type.Union([BusinessCode, Type.Null()])),
  categoryName: Type.Optional(Type.Union([NonBlankText, Type.Null()])),
  categorySequence: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});
export type BalanceSheetLineDto = Type.Static<typeof BalanceSheetLineDto>;

export const BalanceSheetResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  asAtDate: Type.Union([IsoDate, Type.Null()]),
  assetLines: Type.Array(BalanceSheetLineDto),
  liabilityLines: Type.Array(BalanceSheetLineDto),
  equityLines: Type.Array(BalanceSheetLineDto),
  totalAssets: Type.Number(),
  totalLiabilities: Type.Number(),
  totalEquity: Type.Number(),
  totalLiabilitiesAndEquity: Type.Number(),
});
export type BalanceSheetResponseDto = Type.Static<typeof BalanceSheetResponseDto>;
