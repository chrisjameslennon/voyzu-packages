import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const ArSubledgerEntriesAuditFieldDto = StrictObject({
  label: Type.String(),
  value: Type.Union([Type.String(), Type.Null()]),
});
export type ArSubledgerEntriesAuditFieldDto = Type.Static<typeof ArSubledgerEntriesAuditFieldDto>;

export const ArSubledgerEntriesAuditEntryDto = StrictObject({
  id: Type.String(),
  fields: Type.Array(ArSubledgerEntriesAuditFieldDto),
});
export type ArSubledgerEntriesAuditEntryDto = Type.Static<typeof ArSubledgerEntriesAuditEntryDto>;

export const ArSubledgerEntriesAuditResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  entries: Type.Array(ArSubledgerEntriesAuditEntryDto),
});
export type ArSubledgerEntriesAuditResponseDto = Type.Static<typeof ArSubledgerEntriesAuditResponseDto>;
