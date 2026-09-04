import type { DbExecutor } from "@voyzu/capability/db";
import type { OperationalInventoryItem } from "../../../common/server/operational-inventory";

import type {
  CompanyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  GlAccountPostingRow,
  InsertInventoryLedgerHeaderRow,
  InsertInventoryLedgerLineRow,
  InventoryBalanceRow,
  InventoryControlAccountPostingRow,
  InventoryItemPostingRow,
  InventoryLedgerHeaderRow,
  InventoryLedgerLineRow,
} from "./inventory-processing.row.types";

function dateString(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

function companyRow(row: Record<string, unknown>): CompanyPostingContextRow {
  return {
    id: Number(row.id),
    organization_id: Number(row.organization_id),
    code: String(row.code),
    name: String(row.name),
    base_currency_code: String(row.base_currency_code),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function documentProcessorRow(row: Record<string, unknown>): DocumentProcessorValidationRow {
  return {
    code: row.code as DocumentProcessorValidationRow["code"],
    status: row.status as "ACTIVE" | "INACTIVE",
    supports_dimensions: Boolean(row.supports_dimensions),
    cash_movement: Boolean(row.cash_movement),
    supports_items: Boolean(row.supports_items),
  };
}

function fiscalPeriodRow(row: Record<string, unknown>): FiscalPostingPeriodRow {
  return {
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_year_status: row.financial_year_status as "OPEN" | "CLOSED",
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
    financial_period_status: row.financial_period_status as "OPEN" | "CLOSED",
    period_start_date: dateString(row.period_start_date),
    period_end_date: dateString(row.period_end_date),
  };
}

function glAccount(prefix: string, row: Record<string, unknown>): GlAccountPostingRow | null {
  const id = row[`${prefix}_gl_account_id`];
  if (id == null) return null;
  return {
    id: Number(id),
    code: String(row[`${prefix}_gl_account_code`]),
    name: String(row[`${prefix}_gl_account_name`]),
    account_type: row[`${prefix}_gl_account_type`] as GlAccountPostingRow["account_type"],
    status: row[`${prefix}_gl_account_status`] as "ACTIVE" | "INACTIVE",
  };
}

function inventoryControlAccountRow(row: Record<string, unknown>): InventoryControlAccountPostingRow {
  const gl = glAccount("control", row);
  if (!gl) throw new Error("Inventory control account row is missing GL account");
  return {
    code: row.code as "INVENTORY_CONTROL",
    name: String(row.name),
    status: row.status as "ACTIVE" | "INACTIVE",
    gl_account: gl,
  };
}

function inventoryItemRow(row: Record<string, unknown>): InventoryItemPostingRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    description: String(row.description),
    item_type: row.item_type as InventoryItemPostingRow["item_type"],
    is_sold: Boolean(row.is_sold),
    is_purchased: Boolean(row.is_purchased),
    is_consumed: Boolean(row.is_consumed),
    status: row.status as "ACTIVE" | "INACTIVE",
    posting_profile_code: String(row.posting_profile_code),
    posting_profile_name: String(row.posting_profile_name),
    posting_profile_status: row.posting_profile_status as "ACTIVE" | "INACTIVE",
    cogs_gl_account: glAccount("cogs", row),
    consumption_gl_account: glAccount("consumption", row),
    adjustment_gain_gl_account: glAccount("adjustment_gain", row),
    adjustment_loss_gl_account: glAccount("adjustment_loss", row),
  };
}

function dimensionValueRow(row: Record<string, unknown>): DimensionValueLookupRow {
  return {
    dimension_id: Number(row.dimension_id),
    dimension_code: String(row.dimension_code),
    dimension_name: String(row.dimension_name),
    dimension_status: row.dimension_status as "ACTIVE" | "INACTIVE",
    dimension_value_id: Number(row.dimension_value_id),
    dimension_value_name: String(row.dimension_value_name),
    dimension_value_status: row.dimension_value_status as "ACTIVE" | "INACTIVE",
  };
}

export class InventoryProcessingRepo {
  constructor(private readonly db: DbExecutor) { }

  async reserveJournalHeaderId(): Promise<number> {
    const { rows } = await this.db.query(`SELECT nextval(pg_get_serial_sequence('journal_header', 'id')) AS id`);
    return Number(rows[0].id);
  }

  async getCompanyByCode(code: string): Promise<CompanyPostingContextRow | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id, c.id AS organization_id, c.code, c.name, c.base_currency_code, c.status
       FROM finance_organization fc JOIN organization c ON c.id = fc.organization_id
       WHERE c.code = $1`,
      [code],
    );
    return rows[0] ? companyRow(rows[0] as Record<string, unknown>) : null;
  }

  async getDocumentProcessor(code: DocumentProcessorValidationRow["code"]): Promise<DocumentProcessorValidationRow | null> {
    const { rows } = await this.db.query(
      `SELECT code, status, supports_dimensions, cash_movement, supports_items FROM financial_document_type WHERE code = $1`,
      [code],
    );
    return rows[0] ? documentProcessorRow(rows[0] as Record<string, unknown>) : null;
  }

  async getOpenFiscalPeriod(companyId: number, postingDate: string): Promise<FiscalPostingPeriodRow | null> {
    const { rows } = await this.db.query(
      `SELECT
         fy.id AS financial_year_id, fy.code AS financial_year_code, fy.status AS financial_year_status,
         fp.id AS financial_period_id, fp.code AS financial_period_code, fp.status AS financial_period_status,
         fp.start_date AS period_start_date, fp.end_date AS period_end_date
       FROM fiscal_period fp
       JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id
       WHERE fp.finance_organization_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date
       ORDER BY CASE WHEN fy.status = 'OPEN' AND fp.status = 'OPEN' THEN 0 ELSE 1 END, fp.start_date ASC
       LIMIT 1`,
      [companyId, postingDate],
    );
    return rows[0] ? fiscalPeriodRow(rows[0] as Record<string, unknown>) : null;
  }

  async getInventoryControlAccount(companyId: number): Promise<InventoryControlAccountPostingRow | null> {
    const { rows } = await this.db.query(
      `SELECT ca.code, ca.name, ca.status,
              ga.id AS control_gl_account_id,
              ga.code AS control_gl_account_code,
              ga.name AS control_gl_account_name,
              ga.account_type AS control_gl_account_type,
              ga.status AS control_gl_account_status
       FROM inventory_control_account ca
       JOIN gl_account ga ON ga.finance_organization_id = ca.finance_organization_id AND ga.id = ca.gl_account_id
       WHERE ca.finance_organization_id = $1
         AND ca.code = 'INVENTORY_CONTROL'`,
      [companyId],
    );
    return rows[0] ? inventoryControlAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async listInventoryItems(companyId: number, items: OperationalInventoryItem[]): Promise<InventoryItemPostingRow[]> {
    const profileIds = items.flatMap((item) => item.itemPostingProfileId == null ? [] : [item.itemPostingProfileId]);
    if (profileIds.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT ipp.id::int AS posting_profile_id,
              ipp.is_sold, ipp.is_purchased, ipp.is_consumed,
              ipp.code AS posting_profile_code,
              ipp.name AS posting_profile_name,
              ipp.status AS posting_profile_status,
              cogs.id AS cogs_gl_account_id,
              cogs.code AS cogs_gl_account_code,
              cogs.name AS cogs_gl_account_name,
              cogs.account_type AS cogs_gl_account_type,
              cogs.status AS cogs_gl_account_status,
              consumption.id AS consumption_gl_account_id,
              consumption.code AS consumption_gl_account_code,
              consumption.name AS consumption_gl_account_name,
              consumption.account_type AS consumption_gl_account_type,
              consumption.status AS consumption_gl_account_status,
              adjustment_gain.id AS adjustment_gain_gl_account_id,
              adjustment_gain.code AS adjustment_gain_gl_account_code,
              adjustment_gain.name AS adjustment_gain_gl_account_name,
              adjustment_gain.account_type AS adjustment_gain_gl_account_type,
              adjustment_gain.status AS adjustment_gain_gl_account_status,
              adjustment_loss.id AS adjustment_loss_gl_account_id,
              adjustment_loss.code AS adjustment_loss_gl_account_code,
              adjustment_loss.name AS adjustment_loss_gl_account_name,
              adjustment_loss.account_type AS adjustment_loss_gl_account_type,
              adjustment_loss.status AS adjustment_loss_gl_account_status
       FROM item_posting_profile ipp
       LEFT JOIN gl_account cogs ON cogs.finance_organization_id = ipp.finance_organization_id AND cogs.id = ipp.cogs_gl_account_id
       LEFT JOIN gl_account consumption ON consumption.finance_organization_id = ipp.finance_organization_id AND consumption.id = ipp.consumption_gl_account_id
       LEFT JOIN gl_account adjustment_gain ON adjustment_gain.finance_organization_id = ipp.finance_organization_id AND adjustment_gain.id = ipp.adjustment_gain_gl_account_id
       LEFT JOIN gl_account adjustment_loss ON adjustment_loss.finance_organization_id = ipp.finance_organization_id AND adjustment_loss.id = ipp.adjustment_loss_gl_account_id
       WHERE ipp.finance_organization_id = $1
         AND ipp.id = ANY($2::bigint[])`,
      [companyId, profileIds],
    );
    const profiles = new Map(rows.map((row: Record<string, unknown>) => [Number(row.posting_profile_id), row]));
    return items.flatMap((item) => {
      const profile = item.itemPostingProfileId == null ? undefined : profiles.get(item.itemPostingProfileId);
      if (!profile) return [];
      return [inventoryItemRow({
        ...profile,
        id: item.id,
        code: item.sku,
        name: item.name,
        description: item.description,
        item_type: item.quantityTracked ? "INVENTORY" : "NON_INVENTORY",
        status: item.status,
      })];
    });
  }

  async listCurrentBalances(companyId: number, itemIds: number[]): Promise<InventoryBalanceRow[]> {
    if (itemIds.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT DISTINCT ON (l.item_id)
              l.item_id::int,
              l.qty_balance::float8 AS qty_balance,
              l.avg_unit_value::float8 AS avg_unit_value,
              l.book_value_balance::float8 AS book_value_balance
       FROM inventory_ledger_entry_line l
       JOIN inventory_ledger_entry_header h ON h.id = l.inventory_ledger_entry_header_id
       WHERE h.finance_organization_id = $1 AND l.item_id = ANY($2::bigint[])
       ORDER BY l.item_id, h.posting_date DESC, h.id DESC, l.line_number DESC, l.id DESC`,
      [companyId, itemIds],
    );
    return rows.map((row: Record<string, unknown>) => ({
      item_id: Number(row.item_id),
      qty_balance: Number(row.qty_balance),
      avg_unit_value: Number(row.avg_unit_value),
      book_value_balance: Number(row.book_value_balance),
    }));
  }

  async listDimensionValues(companyId: number, pairs: Array<{ dimensionCode: string; valueName: string }>): Promise<DimensionValueLookupRow[]> {
    if (pairs.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT d.id AS dimension_id, d.code AS dimension_code, d.name AS dimension_name, d.status AS dimension_status,
              dv.id AS dimension_value_id, dv.name AS dimension_value_name, dv.status AS dimension_value_status
       FROM dimension_value dv
       JOIN dimension d ON d.finance_organization_id = dv.finance_organization_id AND d.id = dv.dimension_id
       WHERE dv.finance_organization_id = $1
         AND (d.code, dv.name) IN (SELECT * FROM unnest($2::text[], $3::text[]))`,
      [companyId, pairs.map((pair) => pair.dimensionCode), pairs.map((pair) => pair.valueName)],
    );
    return rows.map((row: Record<string, unknown>) => dimensionValueRow(row));
  }

  async insertInventoryLedgerHeader(row: InsertInventoryLedgerHeaderRow): Promise<InventoryLedgerHeaderRow> {
    const { rows } = await this.db.query(
      `INSERT INTO inventory_ledger_entry_header
         (code, finance_organization_id, journal_header_id, source_document_type_code, document_id,
          description, memo, document_date, posting_date, financial_year_id,
          financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'POSTED',now(),'SYSTEM')
       RETURNING id`,
      [
        row.code, row.finance_organization_id, row.journal_header_id, row.source_document_type_code,
        row.document_id, row.description, row.memo, row.document_date, row.posting_date,
        row.financial_year_id, row.financial_period_id, row.base_currency_code,
      ],
    );
    return { ...row, id: Number(rows[0].id) };
  }

  async insertInventoryLedgerLine(row: InsertInventoryLedgerLineRow): Promise<InventoryLedgerLineRow> {
    const { rows } = await this.db.query(
      `INSERT INTO inventory_ledger_entry_line
         (inventory_ledger_entry_header_id, line_number, movement_type_code, item_id, item_code, item_name,
          description, inventory_control_account_code, qty_delta, unit_value_supplied,
          book_value_delta, qty_balance, avg_unit_value, book_value_balance,
          memo, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,now(),'SYSTEM')
       RETURNING id`,
      [
        row.inventory_ledger_entry_header_id, row.line_number, row.movement_type_code,
        row.item_id, row.item_code, row.item_name, row.description, row.inventory_control_account_code, row.qty_delta,
        row.unit_value_supplied, row.book_value_delta, row.qty_balance, row.avg_unit_value,
        row.book_value_balance, row.memo,
      ],
    );
    return { ...row, id: Number(rows[0].id) };
  }

  async updateItemDerivedBalance(_itemId: number, _balance: { qty_balance: number; avg_unit_value: number; book_value_balance: number }): Promise<void> {
    // Operational inventory owns its own derived quantities. Finance retains the valued ledger.
  }

  async countJournalsByDocumentId(documentId: string): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT COUNT(*)::text AS count FROM journal_header WHERE document_id = $1`,
      [documentId],
    );
    return Number(rows[0].count);
  }

  async deleteArtifactsByDocumentIds(documentIds: string[]): Promise<void> {
    if (documentIds.length === 0) return;
    const journalIds = await this.db.query(
      `SELECT id FROM journal_header WHERE document_id = ANY($1::text[])`,
      [documentIds],
    );
    const ids = journalIds.rows.map((row) => Number(row.id));
    if (ids.length) {
      await this.db.query(`SET session_replication_role = replica`);
      try {
        await this.db.query(
          `DELETE FROM inventory_ledger_entry_line
           WHERE inventory_ledger_entry_header_id IN (
             SELECT id
             FROM inventory_ledger_entry_header
             WHERE journal_header_id = ANY($1::bigint[])
           )`,
          [ids],
        );
        await this.db.query(`DELETE FROM inventory_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await this.db.query(
          `DELETE FROM journal_line_dimension
           WHERE journal_line_id IN (SELECT id FROM journal_line WHERE journal_header_id = ANY($1::bigint[]))`,
          [ids],
        );
        await this.db.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
        await this.db.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
      } finally {
        await this.db.query(`SET session_replication_role = DEFAULT`);
      }
    }
  }
}
