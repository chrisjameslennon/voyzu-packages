import type { DbExecutor } from "@voyzu/capability/db";

import type { InventoryLedgerEntryRow } from "./inventory-ledger.row.types";

const INVENTORY_ENTRY_COLUMNS = `
  h.id::int                         AS id,
  l.id::int                         AS line_id,
  h.code                            AS code,
  h.journal_header_id::int          AS journal_header_id,
  jh.code                           AS journal_code,
  l.line_number::int                AS line_number,
  h.posting_date::text              AS posting_date,
  h.document_date::text             AS document_date,
  h.source_document_type_code       AS source_document,
  l.movement_type_code              AS movement,
  h.document_id                     AS document_id,
  CASE
    WHEN h.source_document_type_code IN ('AP_BILL', 'AR_INVOICE') THEN h.source_document_type_code
    ELSE NULL
  END                               AS upstream_document_type_code,
  COALESCE(
    jh.detailed_document_snapshot_json->'source'->>'source_document_id',
    CASE
      WHEN h.source_document_type_code IN ('AP_BILL', 'AR_INVOICE') THEN jh.document_id
      ELSE NULL
    END
  )                                 AS upstream_document_id,
  h.description                     AS description,
  h.memo                            AS memo,
  l.description                     AS line_description,
  l.memo                            AS line_memo,
  item.code                         AS item_code,
  item.name                         AS item_name,
  l.qty_delta::float                AS qty_delta,
  l.unit_value_supplied::float      AS unit_value_supplied,
  l.book_value_delta::float         AS book_value_delta,
  l.qty_balance::float              AS qty_balance,
  l.avg_unit_value::float           AS avg_unit_value,
  l.book_value_balance::float       AS book_value_balance,
  h.base_currency_code,
  h.status,
  l.inventory_control_account_code  AS control_account_code,
  control.name                      AS control_account_name,
  gl.code                           AS gl_account_code,
  gl.name                           AS gl_account_name,
  jh.document_snapshot_json         AS document_snapshot_json,
  jh.detailed_document_snapshot_json AS detailed_document_snapshot_json,
  COALESCE(control_balances.items, '[]'::json) AS control_account_balances_json,
  h.creation_date::text             AS creation_date,
  h.updated_date::text              AS updated_date
`;

export class InventoryLedgerRepo {
  constructor(private readonly db: DbExecutor) {}

  async listEntries(companyId: number): Promise<InventoryLedgerEntryRow[]> {
    const { rows } = await this.db.query(
      `SELECT ${INVENTORY_ENTRY_COLUMNS}
       FROM inventory_ledger_entry_header h
       JOIN journal_header jh ON jh.id = h.journal_header_id
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
       JOIN inventory_item item ON item.id = l.item_id
       JOIN inventory_control_account control ON control.company_id = h.company_id AND control.code = l.inventory_control_account_code
       JOIN gl_account gl ON gl.company_id = h.company_id AND gl.id = control.gl_account_id
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object(
           'controlAccountCode', grouped.control_account_code,
           'controlAccountName', grouped.control_account_name,
           'glAccountCode', grouped.gl_account_code,
           'glAccountName', grouped.gl_account_name,
           'balance', grouped.balance
         ) ORDER BY grouped.control_account_code) AS items
         FROM (
           SELECT line.inventory_control_account_code AS control_account_code,
                  balance_control.name AS control_account_name,
                  balance_gl.code AS gl_account_code,
                  balance_gl.name AS gl_account_name,
                  SUM(line.book_value_delta)::float AS balance
           FROM inventory_ledger_entry_line line
           JOIN inventory_control_account balance_control ON balance_control.company_id = h.company_id AND balance_control.code = line.inventory_control_account_code
           JOIN gl_account balance_gl ON balance_gl.company_id = h.company_id AND balance_gl.id = balance_control.gl_account_id
           WHERE line.inventory_ledger_entry_header_id = h.id
           GROUP BY line.inventory_control_account_code, balance_control.name, balance_gl.code, balance_gl.name
         ) grouped
       ) control_balances ON true
       WHERE h.company_id = $1
       ORDER BY h.posting_date DESC, h.id DESC, l.line_number ASC`,
      [companyId],
    );
    return rows as unknown as InventoryLedgerEntryRow[];
  }

  async getEntry(companyId: number, code: string): Promise<InventoryLedgerEntryRow[]> {
    const { rows } = await this.db.query(
      `SELECT ${INVENTORY_ENTRY_COLUMNS}
       FROM inventory_ledger_entry_header h
       JOIN journal_header jh ON jh.id = h.journal_header_id
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
       JOIN inventory_item item ON item.id = l.item_id
       JOIN inventory_control_account control ON control.company_id = h.company_id AND control.code = l.inventory_control_account_code
       JOIN gl_account gl ON gl.company_id = h.company_id AND gl.id = control.gl_account_id
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object(
           'controlAccountCode', grouped.control_account_code,
           'controlAccountName', grouped.control_account_name,
           'glAccountCode', grouped.gl_account_code,
           'glAccountName', grouped.gl_account_name,
           'balance', grouped.balance
         ) ORDER BY grouped.control_account_code) AS items
         FROM (
           SELECT line.inventory_control_account_code AS control_account_code,
                  balance_control.name AS control_account_name,
                  balance_gl.code AS gl_account_code,
                  balance_gl.name AS gl_account_name,
                  SUM(line.book_value_delta)::float AS balance
           FROM inventory_ledger_entry_line line
           JOIN inventory_control_account balance_control ON balance_control.company_id = h.company_id AND balance_control.code = line.inventory_control_account_code
           JOIN gl_account balance_gl ON balance_gl.company_id = h.company_id AND balance_gl.id = balance_control.gl_account_id
           WHERE line.inventory_ledger_entry_header_id = h.id
           GROUP BY line.inventory_control_account_code, balance_control.name, balance_gl.code, balance_gl.name
         ) grouped
       ) control_balances ON true
       WHERE h.company_id = $1
         AND h.code = $2
       ORDER BY l.line_number ASC`,
      [companyId, code],
    );
    return rows as unknown as InventoryLedgerEntryRow[];
  }
}

