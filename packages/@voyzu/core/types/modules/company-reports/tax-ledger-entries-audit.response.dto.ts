import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const TaxLedgerEntriesAuditFieldDto = StrictObject({
  label: Type.String(),
  value: Type.Union([Type.String(), Type.Null()]),
});
export type TaxLedgerEntriesAuditFieldDto = Type.Static<typeof TaxLedgerEntriesAuditFieldDto>;

export const TaxLedgerEntriesAuditEntryDto = StrictObject({
  id: Type.String(),
  fields: Type.Array(TaxLedgerEntriesAuditFieldDto),
});
export type TaxLedgerEntriesAuditEntryDto = Type.Static<typeof TaxLedgerEntriesAuditEntryDto>;

export const TaxLedgerEntriesAuditResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  entries: Type.Array(TaxLedgerEntriesAuditEntryDto),
});
export type TaxLedgerEntriesAuditResponseDto = Type.Static<typeof TaxLedgerEntriesAuditResponseDto>;
