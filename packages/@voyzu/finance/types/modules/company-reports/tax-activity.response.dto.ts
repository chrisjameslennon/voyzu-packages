import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const TaxActivityAuthorityColumnDto = StrictObject({
  taxAuthorityCode: BusinessCode,
  taxAuthorityName: NonBlankText,
});
export type TaxActivityAuthorityColumnDto = Type.Static<typeof TaxActivityAuthorityColumnDto>;

export const TaxActivityLineDto = StrictObject({
  key: Type.Union([Type.Literal("OUTPUT_TAX_PAYABLE"), Type.Literal("INPUT_TAX_RECEIVABLE"), Type.Literal("TAX_ADJUSTMENTS"), Type.Literal("TAX_PAYMENTS"), Type.Literal("TAX_REFUNDS")]),
  label: Type.String(),
  amountsByAuthority: Type.Record(Type.String(), Type.Number()),
  total: Type.Number(),
});
export type TaxActivityLineDto = Type.Static<typeof TaxActivityLineDto>;

export const TaxActivityResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  periodLabel: Type.String(),
  periodStartDate: IsoDate,
  periodEndDate: IsoDate,
  authorityColumns: Type.Array(TaxActivityAuthorityColumnDto),
  returnLines: Type.Array(TaxActivityLineDto),
  settlementLines: Type.Array(TaxActivityLineDto),
  netTaxReturn: Type.Number(),
  closingTaxPositionImpact: Type.Number(),
  trialBalanceReconciled: Type.Boolean(),
});
export type TaxActivityResponseDto = Type.Static<typeof TaxActivityResponseDto>;
