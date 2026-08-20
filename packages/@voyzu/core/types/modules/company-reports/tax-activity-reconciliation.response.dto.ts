import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const TaxActivityReconciliationLineDto = StrictObject({
  sectionKey: Type.Union([Type.Literal("TAX_RETURN"), Type.Literal("SETTLEMENT")]),
  sectionLabel: Type.String(),
  lineKey: Type.Union([Type.Literal("OUTPUT_TAX_PAYABLE"), Type.Literal("INPUT_TAX_RECEIVABLE"), Type.Literal("TAX_ADJUSTMENTS"), Type.Literal("TAX_PAYMENTS"), Type.Literal("TAX_REFUNDS")]),
  lineLabel: Type.String(),
  postingDate: IsoDate,
  documentTypeCode: BusinessCode,
  documentCode: BusinessCode,
  documentRef: Type.Union([Type.String(), Type.Null()]),
  sourceDocumentRef: Type.Union([Type.String(), Type.Null()]),
  taxAuthorityCode: BusinessCode,
  taxAuthorityName: NonBlankText,
  amount: Type.Number(),
});
export type TaxActivityReconciliationLineDto = Type.Static<typeof TaxActivityReconciliationLineDto>;

export const TaxActivityReconciliationAuthorityOptionDto = StrictObject({
  taxAuthorityCode: BusinessCode,
  taxAuthorityName: NonBlankText,
});
export type TaxActivityReconciliationAuthorityOptionDto = Type.Static<typeof TaxActivityReconciliationAuthorityOptionDto>;

export const TaxActivityReconciliationResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  taxAuthorityCode: BusinessCode,
  taxAuthorityName: NonBlankText,
  taxAuthorityOptions: Type.Array(TaxActivityReconciliationAuthorityOptionDto),
  periodLabel: Type.String(),
  periodStartDate: IsoDate,
  periodEndDate: IsoDate,
  lines: Type.Array(TaxActivityReconciliationLineDto),
  total: Type.Number(),
  trialBalanceReconciled: Type.Boolean(),
});
export type TaxActivityReconciliationResponseDto = Type.Static<typeof TaxActivityReconciliationResponseDto>;
