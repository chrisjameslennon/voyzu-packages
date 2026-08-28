import type { DbExecutor } from "@voyzu/capability/db";
import type { AccountType } from "@voyzu/finance/types/modules/core";
import type { OperationalInventoryItem } from "../../../common/server/operational-inventory";

import type {
  ApSubledgerEntryRow,
  CompanyPostingContextRow,
  ControlAccountPostingRow,
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  InsertApSubledgerEntryRow,
  InventoryControlAccountPostingRow,
  InsertTaxLedgerHeaderRow,
  InsertTaxLedgerLineRow,
  PostingCodeAccountRow,
  ApBillItemPostingProfileRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxLedgerEntryRow,
  TaxLedgerHeaderRow,
  TaxMovementControlAccountRow,
  TaxRuleRow,
  UpsertCounterpartyResultRow,
} from "./ap-bill-posting.row.types";

interface CounterpartyInputRow {
  finance_organization_id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
}

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateString(value: unknown): string {
  return value instanceof Date ? localDateString(value) : String(value);
}

function companyRow(row: Record<string, unknown>): CompanyPostingContextRow {
  return {
    id: Number(row.id),
    organization_id: Number(row.organization_id),
    code: String(row.code),
    name: String(row.name),
    country_code: String(row.country_code),
    base_currency_code: String(row.base_currency_code),
    status: String(row.status),
  };
}

function counterpartyRow(row: Record<string, unknown>): CounterpartyPostingContextRow {
  return {
    id: Number(row.id),
    finance_organization_id: Number(row.finance_organization_id),
    code: String(row.code),
    name: String(row.name),
    status: row.status as "ACTIVE" | "INACTIVE",
    country_code: String(row.country_code),
    tax_region_or_province: row.tax_region_or_province == null ? null : String(row.tax_region_or_province),
    country_currency_code: String(row.country_currency_code),
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

function postingCodeAccountRow(row: Record<string, unknown>): PostingCodeAccountRow {
  return {
    code: String(row.code),
    document_code: row.document_code as "AP_BILL",
    status: row.status as "ACTIVE" | "INACTIVE",
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    gl_account_type: String(row.gl_account_type) as AccountType,
    gl_account_status: row.gl_account_status as "ACTIVE" | "INACTIVE",
  };
}

function controlAccountRow(row: Record<string, unknown>): ControlAccountPostingRow {
  return {
    control_account_code: row.control_account_code as "AP_TRADE_PAYABLES",
    control_account_name: String(row.control_account_name),
    control_account_status: row.control_account_status as "ACTIVE" | "INACTIVE",
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    gl_account_status: row.gl_account_status as "ACTIVE" | "INACTIVE",
  };
}

function inventoryControlAccountRow(row: Record<string, unknown>): InventoryControlAccountPostingRow {
  return {
    control_account_code: row.control_account_code as "INVENTORY_CONTROL",
    control_account_name: String(row.control_account_name),
    control_account_status: row.control_account_status as "ACTIVE" | "INACTIVE",
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    gl_account_status: row.gl_account_status as "ACTIVE" | "INACTIVE",
  };
}

function taxMovementControlAccountRow(row: Record<string, unknown>): TaxMovementControlAccountRow {
  return {
    tax_movement_type_code: row.tax_movement_type_code as "TAX_ON_PURCHASES",
    tax_movement_type_name: String(row.tax_movement_type_name),
    tax_movement_type_status: row.tax_movement_type_status as "ACTIVE" | "INACTIVE",
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    gl_account_status: row.gl_account_status as "ACTIVE" | "INACTIVE",
  };
}

function documentProcessorRow(row: Record<string, unknown>): DocumentProcessorValidationRow {
  return {
    code: row.code as "AP_BILL",
    status: row.status as "ACTIVE" | "INACTIVE",
    supports_dimensions: Boolean(row.supports_dimensions),
    cash_movement: Boolean(row.cash_movement),
    supports_items: Boolean(row.supports_items),
  };
}

function taxRuleRow(row: Record<string, unknown>): TaxRuleRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    country_code: String(row.country_code),
    region_code: row.region_code == null ? null : String(row.region_code),
    name: String(row.name),
    invoice_label: String(row.invoice_label),
    report_label: String(row.report_label),
    calculation_method: row.calculation_method as TaxRuleRow["calculation_method"],
    component_mode: row.component_mode as TaxRuleRow["component_mode"],
    component_count: Number(row.component_count),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function taxComponentRow(row: Record<string, unknown>): TaxComponentRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    tax_rule_country_code: String(row.tax_rule_country_code),
    tax_rule_code: String(row.tax_rule_code),
    tax_authority_code: String(row.tax_authority_code),
    tax_authority_id: Number(row.tax_authority_id),
    tax_authority_name: String(row.tax_authority_name),
    scheme_code: String(row.scheme_code),
    invoice_label: String(row.invoice_label),
    report_label: String(row.report_label),
    rate: Number(row.rate),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function taxAuthorityRow(row: Record<string, unknown>): TaxAuthorityRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    country_code: String(row.country_code),
    region_code: row.region_code == null ? null : String(row.region_code),
    jurisdiction_level: String(row.jurisdiction_level),
    status: row.status as "ACTIVE" | "INACTIVE",
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

export class ApBillPostingRepo {
  constructor(private readonly db: DbExecutor) { }

  async reserveJournalHeaderId(): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT nextval(pg_get_serial_sequence('journal_header', 'id')) AS id`,
    );
    return Number(rows[0].id);
  }

  async getCompanyByCode(code: string): Promise<CompanyPostingContextRow | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id, c.id AS organization_id, c.code, c.name, c.country_code, c.base_currency_code, c.status
       FROM finance_organization fc JOIN organization c ON c.id = fc.organization_id
       WHERE c.code = $1 AND fc.is_template = false`,
      [code],
    );
    return rows[0] ? companyRow(rows[0] as Record<string, unknown>) : null;
  }

  async getDocumentProcessor(): Promise<DocumentProcessorValidationRow | null> {
    const { rows } = await this.db.query(
      `SELECT code, status, supports_dimensions, cash_movement, supports_items FROM financial_document_type WHERE code = 'AP_BILL'`,
    );
    return rows[0] ? documentProcessorRow(rows[0] as Record<string, unknown>) : null;
  }

  async getCountryCurrency(countryCode: string): Promise<string | null> {
    const { rows } = await this.db.query(`SELECT currency_code FROM country WHERE code = $1`, [countryCode]);
    return rows[0] ? String(rows[0].currency_code) : null;
  }

  async getCounterpartyByCode(companyId: number, code: string): Promise<CounterpartyPostingContextRow | null> {
    const { rows } = await this.db.query(
      `SELECT cp.*, c.currency_code AS country_currency_code
       FROM ap_counterparty cp
       JOIN country c ON c.code = cp.country_code
       WHERE cp.finance_organization_id = $1 AND cp.code = $2`,
      [companyId, code],
    );
    return rows[0] ? counterpartyRow(rows[0] as Record<string, unknown>) : null;
  }

  async upsertCounterparty(row: CounterpartyInputRow): Promise<UpsertCounterpartyResultRow> {
    const { rows } = await this.db.query(
      `WITH upserted AS (
         INSERT INTO ap_counterparty
           (finance_organization_id, code, name, status, country_code, tax_region_or_province,
            creation_date, creation_actor_type, updated_date, updated_actor_type)
         VALUES ($1,$2,$3,$4,$5,$6,now(),'SYSTEM',now(),'SYSTEM')
         ON CONFLICT (finance_organization_id, code) DO UPDATE
         SET name = EXCLUDED.name,
             status = EXCLUDED.status,
             country_code = EXCLUDED.country_code,
             tax_region_or_province = EXCLUDED.tax_region_or_province,
             updated_date = now(),
             updated_actor_type = 'SYSTEM'
         RETURNING *, (xmax = 0) AS was_created
       )
       SELECT u.*, c.currency_code AS country_currency_code
       FROM upserted u
       JOIN country c ON c.code = u.country_code`,
      [row.finance_organization_id, row.code, row.name, row.status, row.country_code, row.tax_region_or_province],
    );
    return {
      ...counterpartyRow(rows[0] as Record<string, unknown>),
      was_created: Boolean(rows[0].was_created),
    };
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

  async getExistingSupplierBill(companyId: number, counterpartyId: number, supplierInvoiceNumber: string): Promise<{ id: number } | null> {
    const { rows } = await this.db.query(
      `SELECT id
       FROM ap_subledger_entry_header
       WHERE finance_organization_id = $1
         AND ap_counterparty_id = $2
         AND document_type_code = 'AP_BILL'
         AND supplier_invoice_number = $3
       LIMIT 1`,
      [companyId, counterpartyId, supplierInvoiceNumber],
    );
    return rows[0] ? { id: Number(rows[0].id) } : null;
  }

  async listPurchasePostingCodes(companyId: number, documentCode: "AP_BILL", codes: string[]): Promise<PostingCodeAccountRow[]> {
    void documentCode;
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT ga.code, 'AP_BILL'::text AS document_code, ga.status,
              ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name,
              ga.account_type AS gl_account_type, ga.status AS gl_account_status
       FROM gl_account ga
       WHERE ga.finance_organization_id = $1
         AND ga.code = ANY($2::text[])
         AND ga.account_type IN ('EXPENSE', 'ASSET')`,
      [companyId, codes],
    );
    return rows.map((row: Record<string, unknown>) => postingCodeAccountRow(row));
  }

  async listItemPostingProfiles(companyId: number, items: OperationalInventoryItem[]): Promise<ApBillItemPostingProfileRow[]> {
    const profileIds = items.flatMap((item) => item.itemPostingCodeId == null ? [] : [item.itemPostingCodeId]);
    if (profileIds.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT ipp.id::int AS posting_profile_id,
              ipp.code AS profile_code, ipp.status AS profile_status, ipp.is_purchased,
              ga.id::int AS purchase_gl_account_id, ga.code AS purchase_gl_account_code,
              ga.name AS purchase_gl_account_name, ga.account_type AS purchase_gl_account_type,
              ga.status AS purchase_gl_account_status
       FROM item_posting_profile ipp
       LEFT JOIN gl_account ga ON ga.finance_organization_id = ipp.finance_organization_id AND ga.id = ipp.purchase_expense_gl_account_id
       WHERE ipp.finance_organization_id = $1 AND ipp.id = ANY($2::bigint[])`,
      [companyId, profileIds],
    );
    const profiles = new Map(rows.map((row: Record<string, unknown>) => [Number(row.posting_profile_id), row]));
    return items.flatMap((item) => {
      const row = item.itemPostingCodeId == null ? undefined : profiles.get(item.itemPostingCodeId);
      if (!row) return [];
      return [{
      item_code: item.sku,
      item_type: item.quantityTracked ? "INVENTORY" : "NON_INVENTORY",
      item_status: item.status,
      profile_code: String(row.profile_code),
      profile_status: row.profile_status as ApBillItemPostingProfileRow["profile_status"],
      is_purchased: Boolean(row.is_purchased),
      purchase_gl_account_id: row.purchase_gl_account_id == null ? null : Number(row.purchase_gl_account_id),
      purchase_gl_account_code: row.purchase_gl_account_code == null ? null : String(row.purchase_gl_account_code),
      purchase_gl_account_name: row.purchase_gl_account_name == null ? null : String(row.purchase_gl_account_name),
      purchase_gl_account_type: row.purchase_gl_account_type == null ? null : row.purchase_gl_account_type as ApBillItemPostingProfileRow["purchase_gl_account_type"],
      purchase_gl_account_status: row.purchase_gl_account_status == null ? null : row.purchase_gl_account_status as ApBillItemPostingProfileRow["purchase_gl_account_status"],
      } satisfies ApBillItemPostingProfileRow];
    });
  }

  async getPurchasePostingCode(companyId: number, documentCode: "AP_BILL", code: string): Promise<PostingCodeAccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT pc.code, pc.document_code, pc.status,
              pc.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name,
              ga.account_type AS gl_account_type, ga.status AS gl_account_status
       FROM financial_document_default pc
       JOIN gl_account ga ON ga.finance_organization_id = pc.finance_organization_id AND ga.id = pc.gl_account_id
       WHERE pc.finance_organization_id = $1
         AND pc.document_code = $2
         AND pc.code = $3
       LIMIT 1`,
      [companyId, documentCode, code],
    );
    return rows[0] ? postingCodeAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async getApControlAccount(companyId: number, code: "AP_TRADE_PAYABLES"): Promise<ControlAccountPostingRow | null> {
    const { rows } = await this.db.query(
      `SELECT ca.code AS control_account_code, ca.name AS control_account_name,
              ca.status AS control_account_status, ga.id AS gl_account_id, ga.code AS gl_account_code,
              ga.name AS gl_account_name, ga.status AS gl_account_status
       FROM ap_control_account ca
       JOIN gl_account ga ON ga.finance_organization_id = ca.finance_organization_id AND ga.id = ca.gl_account_id
       WHERE ca.finance_organization_id = $1 AND ca.code = $2`,
      [companyId, code],
    );
    return rows[0] ? controlAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async getInventoryControlAccount(companyId: number): Promise<InventoryControlAccountPostingRow | null> {
    const { rows } = await this.db.query(
      `SELECT ca.code AS control_account_code, ca.name AS control_account_name,
              ca.status AS control_account_status, ga.id AS gl_account_id, ga.code AS gl_account_code,
              ga.name AS gl_account_name, ga.status AS gl_account_status
       FROM inventory_control_account ca
       JOIN gl_account ga ON ga.finance_organization_id = ca.finance_organization_id AND ga.id = ca.gl_account_id
       WHERE ca.finance_organization_id = $1 AND ca.code = 'INVENTORY_CONTROL'`,
      [companyId],
    );
    return rows[0] ? inventoryControlAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async getTaxMovementControlAccount(companyId: number, code: "TAX_ON_PURCHASES"): Promise<TaxMovementControlAccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT tmt.code AS tax_movement_type_code, tmt.name AS tax_movement_type_name,
              tmt.status AS tax_movement_type_status,
              ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name,
              ga.status AS gl_account_status
       FROM tax_control_account tmt
       JOIN gl_account ga ON ga.finance_organization_id = tmt.finance_organization_id AND ga.id = tmt.gl_account_id
       WHERE tmt.finance_organization_id = $1 AND tmt.code = $2`,
      [companyId, code],
    );
    return rows[0] ? taxMovementControlAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async listTaxRules(countryCode: string, codes: string[]): Promise<TaxRuleRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT *
       FROM tax_rule
       WHERE country_code = $1
         AND code = ANY($2::text[])`,
      [countryCode, codes],
    );
    return rows.map((row: Record<string, unknown>) => taxRuleRow(row));
  }

  async listTaxComponents(countryCode: string, taxRuleCodes: string[]): Promise<TaxComponentRow[]> {
    if (taxRuleCodes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT
         tc.*,
         ta.id AS tax_authority_id,
         ta.name AS tax_authority_name
       FROM tax_component tc
       JOIN tax_authority ta ON ta.code = tc.tax_authority_code
       WHERE tc.tax_rule_country_code = $1
         AND tc.tax_rule_code = ANY($2::text[])
       ORDER BY tc.tax_rule_code ASC, tc.calculation_order ASC`,
      [countryCode, taxRuleCodes],
    );
    return rows.map((row: Record<string, unknown>) => taxComponentRow(row));
  }

  async listTaxAuthorities(countryCode: string, codes: string[]): Promise<TaxAuthorityRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT *
       FROM tax_authority
       WHERE country_code = $1 AND code = ANY($2::text[])`,
      [countryCode, codes],
    );
    return rows.map((row: Record<string, unknown>) => taxAuthorityRow(row));
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

  async insertApSubledgerEntry(row: InsertApSubledgerEntryRow): Promise<ApSubledgerEntryRow> {
    const { rows } = await this.db.query(
      `INSERT INTO ap_subledger_entry_header
         (code, finance_organization_id, journal_header_id, ap_counterparty_id, document_type_code,
          document_id, supplier_invoice_number, description, memo, document_date,
          posting_date, financial_year_id, financial_period_id, base_currency_code,
          status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'POSTED',now(),'SYSTEM')
       RETURNING id`,
      [
        row.code, row.finance_organization_id, row.journal_header_id, row.ap_counterparty_id,
        row.document_type_code, row.document_id, row.supplier_invoice_number,
        row.description, row.memo, row.document_date, row.posting_date,
        row.financial_year_id, row.financial_period_id, row.base_currency_code,
      ],
    );
    return { ...row, id: Number(rows[0].id), ap_subledger_entry_code: row.code };
  }

  async insertApSubledgerLine(row: {
    ap_subledger_entry_header_id: number;
    line_number: number;
    line_type: "BILL_LINE";
    description: string;
    control_account_code: "AP_TRADE_PAYABLES";
    dr_cr: "CR";
    net_amount: number;
    tax_amount: number | null;
    gross_amount: number;
    purchase_posting_code: string;
    tax_authority_code: string | null;
    base_currency_amount: number;
    memo: string | null;
  }): Promise<{ id: number }> {
    const { rows } = await this.db.query(
      `INSERT INTO ap_subledger_entry_line
         (ap_subledger_entry_header_id, line_number, line_type, description,
          control_account_code, dr_cr, net_amount, tax_amount, gross_amount,
          purchase_posting_code, tax_authority_code, base_currency_amount,
          memo, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now(),'SYSTEM')
       RETURNING id`,
      [
        row.ap_subledger_entry_header_id, row.line_number, row.line_type,
        row.description, row.control_account_code, row.dr_cr, row.net_amount,
        row.tax_amount, row.gross_amount, row.purchase_posting_code,
        row.tax_authority_code, row.base_currency_amount, row.memo,
      ],
    );
    return { id: Number(rows[0].id) };
  }

  async insertTaxLedgerHeader(row: InsertTaxLedgerHeaderRow): Promise<TaxLedgerHeaderRow> {
    const { rows } = await this.db.query(
      `INSERT INTO tax_ledger_entry_header
         (code, finance_organization_id, journal_header_id, document_type_code, document_id,
          description, document_date, posting_date, financial_year_id,
          financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'POSTED',now(),'SYSTEM')
       RETURNING id`,
      [
        row.code, row.finance_organization_id, row.journal_header_id, row.document_type_code,
        row.document_id, row.description, row.document_date, row.posting_date,
        row.financial_year_id, row.financial_period_id, row.base_currency_code,
      ],
    );
    return { ...row, id: Number(rows[0].id) };
  }

  async insertTaxLedgerLine(row: InsertTaxLedgerLineRow): Promise<TaxLedgerEntryRow> {
    const { rows } = await this.db.query(
      `INSERT INTO tax_ledger_entry_line
         (tax_ledger_entry_header_id, line_number, tax_rule_id, tax_component_id,
          tax_authority_id, tax_movement_type_code, scheme_code, invoice_label,
          report_label, tax_rate, taxable_base_currency_amount, dr_cr,
          base_currency_amount, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now(),'SYSTEM')
       RETURNING id`,
      [
        row.tax_ledger_entry_header_id, row.line_number, row.tax_rule_id,
        row.tax_component_id, row.tax_authority_id, row.tax_movement_type_code,
        row.scheme_code, row.invoice_label, row.report_label, row.tax_rate,
        row.taxable_base_currency_amount, row.dr_cr, row.base_currency_amount,
      ],
    );
    return { ...row, id: Number(rows[0].id), tax_ledger_entry_code: `${row.tax_ledger_entry_header_id}-${row.line_number}` };
  }
}
