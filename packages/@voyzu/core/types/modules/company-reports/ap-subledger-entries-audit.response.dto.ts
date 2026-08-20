import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const ApSubledgerEntriesAuditFieldDto = StrictObject({
  label: Type.String(),
  value: Type.Union([Type.String(), Type.Null()]),
});
export type ApSubledgerEntriesAuditFieldDto = Type.Static<typeof ApSubledgerEntriesAuditFieldDto>;

export const ApSubledgerEntriesAuditEntryDto = StrictObject({
  id: Type.String(),
  fields: Type.Array(ApSubledgerEntriesAuditFieldDto),
});
export type ApSubledgerEntriesAuditEntryDto = Type.Static<typeof ApSubledgerEntriesAuditEntryDto>;

export const ApSubledgerEntriesAuditResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  entries: Type.Array(ApSubledgerEntriesAuditEntryDto),
});
export type ApSubledgerEntriesAuditResponseDto = Type.Static<typeof ApSubledgerEntriesAuditResponseDto>;

