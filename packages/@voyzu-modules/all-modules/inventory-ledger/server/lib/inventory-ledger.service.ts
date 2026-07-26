import type {
  InventoryLedgerEntryDetailResponseDto,
  InventoryLedgerEntryResponseDto,
} from "@voyzu-modules/types/modules/inventory-ledger";
import { getDb } from "@voyzu/capability/db";

import { InventoryLedgerRepo } from "../db/inventory-ledger.repo";
import type { InventoryLedgerEntryRow } from "../db/inventory-ledger.row.types";

function toDto(row: InventoryLedgerEntryRow): InventoryLedgerEntryResponseDto {
  return {
    id: row.line_id,
    code: row.code,
    journalHeaderId: row.journal_header_id,
    journalCode: row.journal_code,
    postingDate: row.posting_date,
    sourceDocument: row.source_document,
    movement: row.movement,
    documentId: row.document_id,
    itemCode: row.item_code,
    itemName: row.item_name,
    qtyDelta: row.qty_delta,
    unitValueSupplied: row.unit_value_supplied,
    bookValueDelta: row.book_value_delta,
    qtyBalance: row.qty_balance,
    avgUnitValue: row.avg_unit_value,
    bookValueBalance: row.book_value_balance,
    baseCurrencyCode: row.base_currency_code,
    status: row.status,
    controlAccountCode: row.control_account_code,
    controlAccountName: row.control_account_name,
    glAccountCode: row.gl_account_code,
    glAccountName: row.gl_account_name,
    controlAccountBalances: row.control_account_balances_json,
    audit: {
      created: {
        date: row.creation_date ?? "",
      },
      updated: {
        date: row.updated_date ?? "",
      },
    },
  };
}

export async function listInventoryLedgerEntries(companyId: number): Promise<InventoryLedgerEntryResponseDto[]> {
  return (await new InventoryLedgerRepo(getDb()).listEntries(companyId)).map(toDto);
}

function toDetailDto(rows: InventoryLedgerEntryRow[]): InventoryLedgerEntryDetailResponseDto | null {
  const first = rows[0];
  if (!first) return null;
  return {
    id: first.id,
    code: first.code,
    journalHeaderId: first.journal_header_id,
    journalCode: first.journal_code,
    postingDate: first.posting_date,
    documentDate: first.document_date,
    sourceDocument: first.source_document,
    documentId: first.document_id,
    upstreamDocumentTypeCode: first.upstream_document_type_code,
    upstreamDocumentId: first.upstream_document_id,
    description: first.description,
    memo: first.memo,
    baseCurrencyCode: first.base_currency_code,
    status: first.status,
    controlAccountCode: first.control_account_code,
    controlAccountName: first.control_account_name,
    glAccountCode: first.gl_account_code,
    glAccountName: first.gl_account_name,
    controlAccountBalances: first.control_account_balances_json,
    documentSnapshot: first.document_snapshot_json ?? {},
    detailedDocumentSnapshot: first.detailed_document_snapshot_json ?? {},
    audit: {
      created: {
        date: first.creation_date ?? "",
      },
      updated: {
        date: first.updated_date ?? "",
      },
    },
    lines: rows.map((row) => ({
      id: row.line_id,
      lineNumber: row.line_number,
      movement: row.movement,
      itemCode: row.item_code,
      itemName: row.item_name,
      qtyDelta: row.qty_delta,
      unitValueSupplied: row.unit_value_supplied,
      bookValueDelta: row.book_value_delta,
      qtyBalance: row.qty_balance,
      avgUnitValue: row.avg_unit_value,
      bookValueBalance: row.book_value_balance,
      description: row.line_description,
      memo: row.line_memo,
    })),
  };
}

export async function getInventoryLedgerEntry(companyId: number, code: string): Promise<InventoryLedgerEntryDetailResponseDto | null> {
  return toDetailDto(await new InventoryLedgerRepo(getDb()).getEntry(companyId, code));
}
