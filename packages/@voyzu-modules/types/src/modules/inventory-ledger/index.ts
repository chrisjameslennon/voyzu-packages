import type { AuditMetadataDto } from "@voyzu/types/modules/core";

export interface InventoryLedgerControlAccountBalanceDto {
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  balance: number;
}

export interface InventoryLedgerEntryResponseDto {
  id: number;
  code: string;
  journalHeaderId: number;
  journalCode: string;
  postingDate: string;
  sourceDocument: string;
  movement: string;
  documentId: string;
  itemCode: string;
  itemName: string;
  qtyDelta: number;
  unitValueSupplied: number | null;
  bookValueDelta: number;
  qtyBalance: number;
  avgUnitValue: number;
  bookValueBalance: number;
  baseCurrencyCode: string;
  status: "POSTED";
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  controlAccountBalances: InventoryLedgerControlAccountBalanceDto[];
  audit: AuditMetadataDto;
}

export interface InventoryLedgerEntryDetailLineDto {
  id: number;
  lineNumber: number;
  movement: string;
  itemCode: string;
  itemName: string;
  qtyDelta: number;
  unitValueSupplied: number | null;
  bookValueDelta: number;
  qtyBalance: number;
  avgUnitValue: number;
  bookValueBalance: number;
  description: string | null;
  memo: string | null;
}

export interface InventoryLedgerEntryDetailResponseDto {
  id: number;
  code: string;
  journalHeaderId: number;
  journalCode: string;
  postingDate: string;
  documentDate: string;
  sourceDocument: string;
  documentId: string;
  upstreamDocumentTypeCode: string | null;
  upstreamDocumentId: string | null;
  description: string | null;
  memo: string | null;
  baseCurrencyCode: string;
  status: "POSTED";
  controlAccountCode: string;
  controlAccountName: string;
  glAccountCode: string;
  glAccountName: string;
  controlAccountBalances: InventoryLedgerControlAccountBalanceDto[];
  documentSnapshot: Record<string, unknown>;
  detailedDocumentSnapshot: Record<string, unknown>;
  audit: AuditMetadataDto;
  lines: InventoryLedgerEntryDetailLineDto[];
}
