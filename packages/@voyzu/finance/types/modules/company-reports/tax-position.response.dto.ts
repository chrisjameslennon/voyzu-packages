import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BusinessCode, CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const TaxPositionAuthorityColumnDto = StrictObject({
  taxAuthorityCode: BusinessCode,
  taxAuthorityName: NonBlankText,
});
export type TaxPositionAuthorityColumnDto = Type.Static<typeof TaxPositionAuthorityColumnDto>;

export const TaxPositionLineDto = StrictObject({
  key: Type.Union([Type.Literal("OUTPUT_TAX_PAYABLE"), Type.Literal("INPUT_TAX_RECEIVABLE")]),
  label: Type.String(),
  amountsByAuthority: Type.Record(Type.String(), Type.Number()),
  total: Type.Number(),
});
export type TaxPositionLineDto = Type.Static<typeof TaxPositionLineDto>;

export const TaxPositionResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  asAtDate: IsoDate,
  authorityColumns: Type.Array(TaxPositionAuthorityColumnDto),
  lines: Type.Array(TaxPositionLineDto),
  netTaxPosition: Type.Number(),
  trialBalanceReconciled: Type.Boolean(),
});
export type TaxPositionResponseDto = Type.Static<typeof TaxPositionResponseDto>;
