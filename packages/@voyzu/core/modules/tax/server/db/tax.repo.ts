import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";

import type {
  ApplicableTaxAuthorityRow,
  InsertTaxAuthorityRow,
  InsertTaxComponentRow,
  InsertTaxRuleRow,
  PatchTaxAuthorityRow,
  PatchTaxComponentRow,
  PatchTaxRuleRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxRuleRow,
  UpdateTaxAuthorityRow,
  UpdateTaxComponentRow,
  UpdateTaxRuleRow,
} from "./tax.row.types";

const AUDIT_COLUMNS = [
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const UPDATE_AUDIT_COLUMNS = ["updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id"] as const;

const AUTHORITY_COLUMNS = [
  "id", "code", "name", "country_code", "region_code", "jurisdiction_level", "tax_family_code", "description", "status",
  ...AUDIT_COLUMNS,
];
const AUTHORITY_MUTABLE = ["name", "country_code", "region_code", "jurisdiction_level", "tax_family_code", "description", "status", ...UPDATE_AUDIT_COLUMNS];

const RULE_COLUMNS = [
  "id", "code", "country_code", "region_code", "name", "invoice_label", "report_label",
  "calculation_method", "component_mode", "component_count", "description", "status",
  ...AUDIT_COLUMNS,
];
const RULE_MUTABLE = [
  "country_code", "region_code", "name", "invoice_label", "report_label",
  "calculation_method", "component_mode", "component_count", "description", "status",
  ...UPDATE_AUDIT_COLUMNS,
];

const COMPONENT_COLUMNS = [
  "id", "code", "tax_rule_code", "tax_authority_code", "scheme_code", "invoice_label", "report_label", "rate",
  "base_amount_type", "calculation_order", "description", "status",
  ...AUDIT_COLUMNS,
];
const COMPONENT_MUTABLE = [
  "tax_rule_code", "tax_authority_code", "scheme_code", "invoice_label", "report_label", "rate",
  "base_amount_type", "calculation_order", "description", "status",
  ...UPDATE_AUDIT_COLUMNS,
];

function assertColumn(field: string, columns: readonly string[]): void {
  if (!columns.includes(field)) throw new Error(`Unknown column: ${field}`);
}

function buildInsert(table: string, row: Record<string, unknown>, columns: readonly string[]): { sql: string; vals: unknown[] } {
  const cols: string[] = [];
  const vals: unknown[] = [];
  for (const [key, value] of Object.entries(row)) {
    if (value !== undefined) {
      assertColumn(key, columns);
      cols.push(key);
      vals.push(value);
    }
  }
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
  return { sql: `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`, vals };
}

function buildUpdate(table: string, code: string, row: Record<string, unknown>, mutableColumns: readonly string[]): { sql: string; vals: unknown[] } {
  const vals: unknown[] = [];
  const sets = mutableColumns.map((col) => {
    vals.push(row[col] ?? null);
    if (col === "updated_actor_type") return `${col} = $${vals.length}::actor_type`;
    if (col === "updated_date") return `${col} = $${vals.length}::timestamptz`;
    if (col === "updated_mutation_id") return `${col} = $${vals.length}::uuid`;
    return `${col} = $${vals.length}`;
  });
  vals.push(code);
  return { sql: `UPDATE ${table} SET ${sets.join(", ")} WHERE code = $${vals.length} RETURNING *`, vals };
}

function buildPatch(table: string, code: string, row: Record<string, unknown>, columns: readonly string[]): { sql: string; vals: unknown[] } | null {
  const vals: unknown[] = [];
  const sets: string[] = [];
  for (const [key, value] of Object.entries(row)) {
    if (value !== undefined) {
      assertColumn(key, columns);
      vals.push(value);
      if (key === "updated_actor_type") {
        sets.push(`${key} = $${vals.length}::actor_type`);
      } else if (key === "updated_date") {
        sets.push(`${key} = $${vals.length}::timestamptz`);
      } else if (key === "updated_mutation_id") {
        sets.push(`${key} = $${vals.length}::uuid`);
      } else {
        sets.push(`${key} = $${vals.length}`);
      }
    }
  }
  if (!sets.length) return null;
  vals.push(code);
  return { sql: `UPDATE ${table} SET ${sets.join(", ")} WHERE code = $${vals.length} RETURNING *`, vals };
}

function mapAudit(row: Record<string, unknown>) {
  return {
    ...row,
    id: Number(row.id),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
  };
}

function mapTaxAuthority(row: Record<string, unknown>): TaxAuthorityRow {
  return mapAudit(row) as TaxAuthorityRow;
}

function mapTaxRule(row: Record<string, unknown>): TaxRuleRow {
  return { ...mapAudit(row), component_count: Number(row.component_count) } as TaxRuleRow;
}

function mapTaxComponent(row: Record<string, unknown>): TaxComponentRow {
  return { ...mapAudit(row), rate: Number(row.rate), calculation_order: Number(row.calculation_order) } as TaxComponentRow;
}

export class TaxRepo {
  constructor(private readonly db: DbExecutor) { }

  async insertAuthority(row: InsertTaxAuthorityRow): Promise<TaxAuthorityRow> {
    const built = buildInsert("tax_authority", row, AUTHORITY_COLUMNS);
    const { rows } = await this.db.query(built.sql, built.vals);
    return mapTaxAuthority(rows[0]);
  }

  async getAuthority(code: string): Promise<TaxAuthorityRow | null> {
    const { rows } = await this.db.query("SELECT * FROM tax_authority WHERE code = $1 AND status != 'DELETED'", [code]);
    return rows[0] ? mapTaxAuthority(rows[0]) : null;
  }

  async listAuthorities(countryCode?: string): Promise<TaxAuthorityRow[]> {
    const params: unknown[] = [];
    const where = countryCode ? `WHERE country_code = $${params.push(countryCode)} AND status != 'DELETED'` : "WHERE status != 'DELETED'";
    const { rows } = await this.db.query(`SELECT * FROM tax_authority ${where} ORDER BY country_code ASC, region_code ASC NULLS FIRST, code ASC`, params);
    return rows.map((r: Record<string, unknown>) => mapTaxAuthority(r));
  }

  async listApplicableAuthorities(companyId: number): Promise<ApplicableTaxAuthorityRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         ta.*,
         SUM(CASE WHEN l.dr_cr = 'CR' THEN l.base_currency_amount ELSE -l.base_currency_amount END)::float AS balance
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       WHERE e.company_id = $1
         AND e.status != 'DELETED'
         AND ta.status != 'DELETED'
       GROUP BY
         ta.id,
         ta.code,
         ta.name,
         ta.country_code,
         ta.region_code,
         ta.jurisdiction_level,
         ta.tax_family_code,
         ta.description,
         ta.status,
         ta.creation_date,
         ta.creation_actor_type,
         ta.creation_user_id,
         ta.creation_mutation_id,
         ta.updated_date,
         ta.updated_actor_type,
         ta.updated_user_id,
         ta.updated_mutation_id
       ORDER BY ta.code ASC`,
      [companyId],
    );
    return rows.map((row: Record<string, unknown>) => ({
      ...mapTaxAuthority(row),
      balance: Number(row.balance),
    }));
  }

  async updateAuthority(code: string, row: UpdateTaxAuthorityRow): Promise<TaxAuthorityRow> {
    const built = buildUpdate("tax_authority", code, row, AUTHORITY_MUTABLE);
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax authority ${code} not found`);
    return mapTaxAuthority(rows[0]);
  }

  async patchAuthority(code: string, row: PatchTaxAuthorityRow): Promise<TaxAuthorityRow> {
    const built = buildPatch("tax_authority", code, row, AUTHORITY_MUTABLE);
    if (!built) {
      const existing = await this.getAuthority(code);
      if (!existing) throw new DataError(`Tax authority ${code} not found`);
      return existing;
    }
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax authority ${code} not found`);
    return mapTaxAuthority(rows[0]);
  }

  async deleteAuthority(code: string): Promise<void> {
    await this.db.query("DELETE FROM tax_authority WHERE code = $1", [code]);
  }

  async insertRule(row: InsertTaxRuleRow): Promise<TaxRuleRow> {
    const built = buildInsert("tax_rule", row, RULE_COLUMNS);
    const { rows } = await this.db.query(built.sql, built.vals);
    return mapTaxRule(rows[0]);
  }

  async getRule(code: string): Promise<TaxRuleRow | null> {
    const { rows } = await this.db.query("SELECT * FROM tax_rule WHERE code = $1 AND status != 'DELETED'", [code]);
    return rows[0] ? mapTaxRule(rows[0]) : null;
  }

  async listRules(countryCode?: string): Promise<TaxRuleRow[]> {
    const params: unknown[] = [];
    const where = countryCode ? `WHERE country_code = $${params.push(countryCode)} AND status != 'DELETED'` : "WHERE status != 'DELETED'";
    const { rows } = await this.db.query(`SELECT * FROM tax_rule ${where} ORDER BY country_code ASC, region_code ASC NULLS FIRST, code ASC`, params);
    return rows.map((r: Record<string, unknown>) => mapTaxRule(r));
  }

  async updateRule(code: string, row: UpdateTaxRuleRow): Promise<TaxRuleRow> {
    const built = buildUpdate("tax_rule", code, row, RULE_MUTABLE);
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax rule ${code} not found`);
    return mapTaxRule(rows[0]);
  }

  async patchRule(code: string, row: PatchTaxRuleRow): Promise<TaxRuleRow> {
    const built = buildPatch("tax_rule", code, row, RULE_MUTABLE);
    if (!built) {
      const existing = await this.getRule(code);
      if (!existing) throw new DataError(`Tax rule ${code} not found`);
      return existing;
    }
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax rule ${code} not found`);
    return mapTaxRule(rows[0]);
  }

  async deleteRule(code: string): Promise<void> {
    await this.db.query("DELETE FROM tax_rule WHERE code = $1", [code]);
  }

  async insertComponent(row: InsertTaxComponentRow): Promise<TaxComponentRow> {
    const built = buildInsert("tax_component", row, COMPONENT_COLUMNS);
    const { rows } = await this.db.query(built.sql, built.vals);
    return mapTaxComponent(rows[0]);
  }

  async getComponent(code: string): Promise<TaxComponentRow | null> {
    const { rows } = await this.db.query("SELECT * FROM tax_component WHERE code = $1 AND status != 'DELETED'", [code]);
    return rows[0] ? mapTaxComponent(rows[0]) : null;
  }

  async listComponents(countryCode?: string): Promise<TaxComponentRow[]> {
    const params: unknown[] = [];
    const join = countryCode ? "JOIN tax_rule tr ON tr.code = tc.tax_rule_code" : "";
    const where = countryCode ? `WHERE tr.country_code = $${params.push(countryCode)} AND tc.status != 'DELETED'` : "WHERE tc.status != 'DELETED'";
    const { rows } = await this.db.query(`SELECT tc.* FROM tax_component tc ${join} ${where} ORDER BY tc.tax_rule_code ASC, tc.calculation_order ASC, tc.code ASC`, params);
    return rows.map((r: Record<string, unknown>) => mapTaxComponent(r));
  }

  async updateComponent(code: string, row: UpdateTaxComponentRow): Promise<TaxComponentRow> {
    const built = buildUpdate("tax_component", code, row, COMPONENT_MUTABLE);
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax component ${code} not found`);
    return mapTaxComponent(rows[0]);
  }

  async patchComponent(code: string, row: PatchTaxComponentRow): Promise<TaxComponentRow> {
    const built = buildPatch("tax_component", code, row, COMPONENT_MUTABLE);
    if (!built) {
      const existing = await this.getComponent(code);
      if (!existing) throw new DataError(`Tax component ${code} not found`);
      return existing;
    }
    const { rows } = await this.db.query(built.sql, built.vals);
    if (!rows[0]) throw new DataError(`Tax component ${code} not found`);
    return mapTaxComponent(rows[0]);
  }

  async deleteComponent(code: string): Promise<void> {
    await this.db.query("DELETE FROM tax_component WHERE code = $1", [code]);
  }
}
