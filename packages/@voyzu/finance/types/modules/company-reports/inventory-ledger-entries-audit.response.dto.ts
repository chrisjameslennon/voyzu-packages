import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { CurrencyCode, IsoDate, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const InventoryLedgerEntriesAuditFieldDto = StrictObject({
  label: Type.String(),
  value: Type.Union([Type.String(), Type.Null()]),
});
export type InventoryLedgerEntriesAuditFieldDto = Type.Static<typeof InventoryLedgerEntriesAuditFieldDto>;

export const InventoryLedgerEntriesAuditEntryDto = StrictObject({
  id: Type.String(),
  fields: Type.Array(InventoryLedgerEntriesAuditFieldDto),
});
export type InventoryLedgerEntriesAuditEntryDto = Type.Static<typeof InventoryLedgerEntriesAuditEntryDto>;

export const InventoryLedgerEntriesAuditResponseDto = StrictObject({
  companyId: PositiveId,
  companyName: NonBlankText,
  companyReportLine1: Type.Union([Type.String(), Type.Null()]),
  companyReportLine2: Type.Union([Type.String(), Type.Null()]),
  companyReportFooter: Type.Union([Type.String(), Type.Null()]),
  baseCurrencyCode: CurrencyCode,
  fromDate: IsoDate,
  toDate: IsoDate,
  entries: Type.Array(InventoryLedgerEntriesAuditEntryDto),
});
export type InventoryLedgerEntriesAuditResponseDto = Type.Static<typeof InventoryLedgerEntriesAuditResponseDto>;

