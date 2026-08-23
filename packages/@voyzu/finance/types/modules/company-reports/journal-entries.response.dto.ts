import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const JournalEntriesFieldDto = StrictObject({
  label: Type.String(),
  value: Type.Union([Type.String(), Type.Null()]),
});
export type JournalEntriesFieldDto = Type.Static<typeof JournalEntriesFieldDto>;

export const JournalEntriesLineDto = StrictObject({
  id: Type.String(),
  headerFields: Type.Array(JournalEntriesFieldDto),
  lineFields: Type.Array(JournalEntriesFieldDto),
});
export type JournalEntriesLineDto = Type.Static<typeof JournalEntriesLineDto>;

export const JournalEntriesResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  lines: Type.Array(JournalEntriesLineDto),
});
export type JournalEntriesResponseDto = Type.Static<typeof JournalEntriesResponseDto>;
