import type {
  AccountRow,
  ArAdjustmentDb,
  ArAdjustmentDocumentType,
  CompanyRow,
  CounterpartyRow,
  DimensionValueRow,
  DocumentProcessorRow,
  InsertArHeaderInput,
  InsertArLineInput,
  InsertTaxHeaderInput,
  InsertTaxLineInput,
  OpenItemRow,
  PeriodRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxMovementAccountRow,
  TaxRuleRow,
} from "./ar-adjustment-posting.row.types";

function companyRow(row: Record<string, unknown>): CompanyRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    country_code: String(row.country_code),
    base_currency_code: String(row.base_currency_code),
    status: String(row.status),
  };
}

function processorRow(row: Record<string, unknown>): DocumentProcessorRow {
  return {
    code: row.code as ArAdjustmentDocumentType,
    name: String(row.name),
    status: String(row.status),
    supports_dimensions: Boolean(row.supports_dimensions),
    cash_movement: Boolean(row.cash_movement),
    supports_items: Boolean(row.supports_items),
  };
}

function counterpartyRow(row: Record<string, unknown>): CounterpartyRow {
  return {
    id: Number(row.id),
    company_id: Number(row.company_id),
    code: String(row.code),
    name: String(row.name),
    status: row.status as "ACTIVE" | "INACTIVE",
    country_code: String(row.country_code),
    tax_region_or_province: row.tax_region_or_province == null ? null : String(row.tax_region_or_province),
    country_currency_code: String(row.country_currency_code),
    was_created: row.was_created == null ? undefined : Boolean(row.was_created),
  };
}

function periodRow(row: Record<string, unknown>): PeriodRow {
  return {
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
  };
}

function accountRow(row: Record<string, unknown>): AccountRow {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    code: row.code == null ? undefined : String(row.code),
    bank_cash_control_account_code: row.bank_cash_control_account_code == null ? undefined : String(row.bank_cash_control_account_code),
    control_account_code: row.control_account_code == null ? undefined : String(row.control_account_code),
    control_account_name: row.control_account_name == null ? undefined : String(row.control_account_name),
  };
}

function taxMovementAccountRow(row: Record<string, unknown>): TaxMovementAccountRow {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    tax_movement_type_code: String(row.tax_movement_type_code),
  };
}

function taxRuleRow(row: Record<string, unknown>): TaxRuleRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    calculation_method: String(row.calculation_method),
    invoice_label: row.invoice_label == null ? null : String(row.invoice_label),
    report_label: row.report_label == null ? null : String(row.report_label),
  };
}

function taxComponentRow(row: Record<string, unknown>): TaxComponentRow {
  return {
    id: Number(row.id),
    tax_rule_code: String(row.tax_rule_code),
    tax_authority_id: Number(row.tax_authority_id),
    tax_authority_code: String(row.tax_authority_code),
    tax_authority_name: String(row.tax_authority_name),
    scheme_code: row.scheme_code == null ? null : String(row.scheme_code),
    invoice_label: row.invoice_label == null ? null : String(row.invoice_label),
    report_label: row.report_label == null ? null : String(row.report_label),
    rate: Number(row.rate),
  };
}

function taxAuthorityRow(row: Record<string, unknown>): TaxAuthorityRow {
  return { id: Number(row.id), code: String(row.code), name: String(row.name) };
}

function dimensionValueRow(row: Record<string, unknown>): DimensionValueRow {
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

function openItemRow(row: Record<string, unknown>): OpenItemRow {
  return {
    ar_subledger_entry_id: Number(row.ar_subledger_entry_id),
    ar_subledger_entry_code: String(row.ar_subledger_entry_code),
    document_id: String(row.document_id),
    journal_code: String(row.journal_code),
    open_amount: Number(row.open_amount),
    original_invoice: row.original_invoice == null ? null : row.original_invoice as OpenItemRow["original_invoice"],
  };
}

export class ArAdjustmentPostingRepo {
  constructor(private readonly db: ArAdjustmentDb) { }

  async getCompany(code: string): Promise<CompanyRow | null> {
    const { rows } = await this.db.query(`SELECT id, code, name, country_code, base_currency_code, status FROM company WHERE code = $1`, [code]);
    return rows[0] ? companyRow(rows[0] as Record<string, unknown>) : null;
  }

  async getDocumentProcessor(code: ArAdjustmentDocumentType): Promise<DocumentProcessorRow | null> {
    const { rows } = await this.db.query(
      `SELECT code, name, status, supports_dimensions, cash_movement, supports_items
       FROM financial_document_type
       WHERE code = $1`,
      [code],
    );
    return rows[0] ? processorRow(rows[0] as Record<string, unknown>) : null;
  }

  async getCounterparty(companyId: number, code: string): Promise<CounterpartyRow | null> {
    const { rows } = await this.db.query(
      `SELECT cp.*, c.currency_code AS country_currency_code
       FROM ar_counterparty cp JOIN country c ON c.code = cp.country_code
       WHERE cp.company_id = $1 AND cp.code = $2`,
      [companyId, code],
    );
    return rows[0] ? counterpartyRow(rows[0] as Record<string, unknown>) : null;
  }

  async upsertCounterparty(companyId: number, input: { code?: string | null; name: string; status: "ACTIVE" | "INACTIVE"; country_code: string; state_or_province_code?: string | null }): Promise<CounterpartyRow> {
    const { rows } = await this.db.query(
      `WITH upserted AS (
         INSERT INTO ar_counterparty
           (company_id, code, name, status, country_code, tax_region_or_province, creation_date, creation_actor_type, updated_date, updated_actor_type)
         VALUES ($1,$2,$3,$4,$5,$6,now(),'SYSTEM',now(),'SYSTEM')
         ON CONFLICT (company_id, code) DO UPDATE
         SET name = EXCLUDED.name, status = EXCLUDED.status, country_code = EXCLUDED.country_code,
             tax_region_or_province = EXCLUDED.tax_region_or_province, updated_date = now(), updated_actor_type = 'SYSTEM'
         RETURNING *, (xmax = 0) AS was_created
       )
       SELECT u.*, c.currency_code AS country_currency_code FROM upserted u JOIN country c ON c.code = u.country_code`,
      [companyId, input.code, input.name, input.status, input.country_code, input.state_or_province_code ?? null],
    );
    return counterpartyRow(rows[0] as Record<string, unknown>);
  }

  async getPeriod(companyId: number, postingDate: string): Promise<PeriodRow | null> {
    const { rows } = await this.db.query(
      `SELECT fy.id AS financial_year_id, fy.code AS financial_year_code, fp.id AS financial_period_id, fp.code AS financial_period_code
       FROM fiscal_period fp JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id
       WHERE fp.company_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date AND fy.status = 'OPEN' AND fp.status = 'OPEN'
       LIMIT 1`,
      [companyId, postingDate],
    );
    return rows[0] ? periodRow(rows[0] as Record<string, unknown>) : null;
  }

  async getControlAccount(companyId: number, code: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH"): Promise<AccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT ca.code AS control_account_code, ca.name AS control_account_name, ca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
       FROM ar_control_account ca JOIN gl_account ga ON ga.company_id = ca.company_id AND ga.id = ca.gl_account_id
       WHERE ca.company_id = $1 AND ca.code = $2 AND ca.status = 'ACTIVE' AND ga.status = 'ACTIVE'`,
      [companyId, code],
    );
    return rows[0] ? accountRow(rows[0] as Record<string, unknown>) : null;
  }

  async getPostingCode(companyId: number, documentCode: string, defaultCode: string, code?: string | null): Promise<AccountRow | null> {
    const { rows: defaultRows } = await this.db.query(
      `SELECT target_type, allowed_account_types
       FROM financial_document_default
       WHERE company_id = $1 AND document_code = $2 AND code = $3 AND status = 'ACTIVE'
       LIMIT 1`,
      [companyId, documentCode, defaultCode],
    );
    if (!defaultRows[0]) return null;
    const targetType = String(defaultRows[0].target_type);
    const allowedAccountTypes = defaultRows[0].allowed_account_types as string[];
    const { rows } = code
      ? targetType === "BANK_CASH_ACCOUNT"
        ? await this.db.query(
          `SELECT $3::text AS code, bca.code AS bank_cash_control_account_code,
                  bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
           FROM bank_cash_control_account bca
           JOIN gl_account ga ON ga.company_id = bca.company_id AND ga.id = bca.gl_account_id
           WHERE bca.company_id = $1
             AND bca.code = $2
             AND bca.status = 'ACTIVE'
             AND ga.status = 'ACTIVE'
             AND ga.account_type = ANY($4::text[])
           LIMIT 1`,
          [companyId, code, defaultCode, allowedAccountTypes],
        )
        : await this.db.query(
          `SELECT $3::text AS code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
           FROM gl_account ga
           WHERE ga.company_id = $1
             AND ga.code = $2
             AND ga.status = 'ACTIVE'
             AND ga.account_type = ANY($4::text[])
           LIMIT 1`,
          [companyId, code, defaultCode, allowedAccountTypes],
        )
      : await this.db.query(
        `SELECT pc.code, bca.code AS bank_cash_control_account_code,
                COALESCE(pc.gl_account_id, bca.gl_account_id) AS gl_account_id,
                ga.code AS gl_account_code, ga.name AS gl_account_name
         FROM financial_document_default pc
         LEFT JOIN bank_cash_control_account bca ON bca.company_id = pc.company_id AND bca.id = pc.bank_cash_control_account_id
         JOIN gl_account ga ON ga.company_id = pc.company_id AND ga.id = COALESCE(pc.gl_account_id, bca.gl_account_id)
         WHERE pc.company_id = $1
           AND pc.document_code = $2
           AND pc.code = $3
           AND pc.status = 'ACTIVE'
           AND (bca.id IS NULL OR bca.status = 'ACTIVE')
           AND ga.status = 'ACTIVE'
         LIMIT 1`,
        [companyId, documentCode, defaultCode],
      );
    return rows[0] ? accountRow(rows[0] as Record<string, unknown>) : null;
  }

  async listPostingCodes(companyId: number, documentCode: string, codes: string[]): Promise<AccountRow[]> {
    void documentCode;
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT ga.code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name
       FROM gl_account ga
       WHERE ga.company_id = $1
         AND ga.code = ANY($2::text[])
         AND ga.status = 'ACTIVE'
         AND ga.account_type = 'REVENUE'`,
      [companyId, codes],
    );
    return rows.map((row: Record<string, unknown>) => accountRow(row));
  }

  async getTaxMovementAccount(companyId: number, code: string): Promise<TaxMovementAccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT tmt.code AS tax_movement_type_code, tmt.gl_account_id AS gl_account_id,
              ga.code AS gl_account_code, ga.name AS gl_account_name
       FROM tax_control_account tmt JOIN gl_account ga ON ga.company_id = tmt.company_id AND ga.id = tmt.gl_account_id
       WHERE tmt.company_id = $1 AND tmt.code = $2 AND tmt.status = 'ACTIVE' AND ga.status = 'ACTIVE'
       LIMIT 1`,
      [companyId, code],
    );
    return rows[0] ? taxMovementAccountRow(rows[0] as Record<string, unknown>) : null;
  }

  async listTaxRules(countryCode: string, codes: string[]): Promise<TaxRuleRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT id, code, calculation_method, invoice_label, report_label
       FROM tax_rule
       WHERE country_code = $1 AND code = ANY($2) AND status = 'ACTIVE'`,
      [countryCode, codes],
    );
    return rows.map((row: Record<string, unknown>) => taxRuleRow(row));
  }

  async listTaxComponents(countryCode: string, taxRuleCodes: string[]): Promise<TaxComponentRow[]> {
    if (taxRuleCodes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT tc.id, tc.tax_rule_code, ta.id AS tax_authority_id, ta.code AS tax_authority_code, ta.name AS tax_authority_name,
              tc.scheme_code, tc.invoice_label, tc.report_label, tc.rate
       FROM tax_component tc
       JOIN tax_rule tr ON tr.country_code = tc.tax_rule_country_code AND tr.code = tc.tax_rule_code
       JOIN tax_authority ta ON ta.code = tc.tax_authority_code
       WHERE tc.tax_rule_country_code = $1 AND tc.tax_rule_code = ANY($2)
         AND tr.status = 'ACTIVE' AND tc.status = 'ACTIVE' AND ta.status = 'ACTIVE'
       ORDER BY tc.tax_rule_code ASC, tc.calculation_order ASC`,
      [countryCode, taxRuleCodes],
    );
    return rows.map((row: Record<string, unknown>) => taxComponentRow(row));
  }

  async listTaxAuthorities(countryCode: string, codes: string[]): Promise<TaxAuthorityRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT id, code, name FROM tax_authority WHERE country_code = $1 AND code = ANY($2) AND status = 'ACTIVE'`,
      [countryCode, codes],
    );
    return rows.map((row: Record<string, unknown>) => taxAuthorityRow(row));
  }

  async listDimensionValues(companyId: number, pairs: Array<{ dimensionCode: string; valueName: string }>): Promise<DimensionValueRow[]> {
    if (pairs.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT d.id AS dimension_id, d.code AS dimension_code, d.name AS dimension_name, d.status AS dimension_status,
              dv.id AS dimension_value_id, dv.name AS dimension_value_name, dv.status AS dimension_value_status
       FROM dimension d JOIN dimension_value dv ON dv.company_id = d.company_id AND dv.dimension_id = d.id
       JOIN jsonb_to_recordset($1::jsonb) AS requested(dimension_code text, value_name text)
         ON requested.dimension_code = d.code AND requested.value_name = dv.name
       WHERE d.company_id = $2`,
      [JSON.stringify(pairs.map((pair) => ({ dimension_code: pair.dimensionCode, value_name: pair.valueName }))), companyId],
    );
    return rows.map((row: Record<string, unknown>) => dimensionValueRow(row));
  }

  async findOpenInvoice(companyId: number, counterpartyId: number, documentCode: string): Promise<OpenItemRow | null> {
    const { rows } = await this.db.query(
      `SELECT e.id AS ar_subledger_entry_id, e.code AS ar_subledger_entry_code, h.document_id, h.code AS journal_code,
              GREATEST(COALESCE(invoice_lines.amount, 0) - COALESCE(applied_lines.amount, 0), 0)::float AS open_amount,
              h.detailed_document_snapshot_json AS original_invoice
       FROM ar_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       LEFT JOIN LATERAL (
         SELECT SUM(l.base_currency_amount) AS amount
         FROM ar_subledger_entry_line l
         WHERE l.ar_subledger_entry_header_id = e.id
           AND l.control_account_code = 'AR_TRADE_RECEIVABLES'
           AND l.dr_cr = 'DR'
       ) invoice_lines ON true
       LEFT JOIN LATERAL (
         SELECT SUM(l.base_currency_amount) AS amount
         FROM ar_subledger_entry_line l
         WHERE l.target_entry_header_id = e.id
           AND l.control_account_code = 'AR_TRADE_RECEIVABLES'
           AND l.dr_cr = 'CR'
       ) applied_lines ON true
       WHERE e.company_id = $1 AND e.ar_counterparty_id = $2
         AND h.document_type_code IN ('AR_INVOICE', 'AR_OPENING_BALANCE') AND h.document_id = $3
       LIMIT 1`,
      [companyId, counterpartyId, documentCode],
    );
    return rows[0] ? openItemRow(rows[0] as Record<string, unknown>) : null;
  }

  async findOpenUnappliedCredit(companyId: number, counterpartyId: number, documentCode: string): Promise<OpenItemRow | null> {
    const { rows } = await this.db.query(
      `SELECT e.id AS ar_subledger_entry_id, e.code AS ar_subledger_entry_code, h.document_id, h.code AS journal_code,
              GREATEST(COALESCE(credit_lines.amount, 0) - COALESCE(applied_lines.amount, 0), 0)::float AS open_amount
       FROM ar_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       LEFT JOIN LATERAL (
         SELECT SUM(l.base_currency_amount) AS amount
         FROM ar_subledger_entry_line l
         WHERE l.ar_subledger_entry_header_id = e.id
           AND l.control_account_code = 'AR_UNAPPLIED_CASH'
           AND l.dr_cr = 'CR'
       ) credit_lines ON true
       LEFT JOIN LATERAL (
         SELECT SUM(l.base_currency_amount) AS amount
         FROM ar_subledger_entry_line l
         WHERE l.source_entry_header_id = e.id
           AND l.control_account_code = 'AR_UNAPPLIED_CASH'
           AND l.dr_cr = 'DR'
       ) applied_lines ON true
       WHERE e.company_id = $1 AND e.ar_counterparty_id = $2
         AND h.document_type_code IN ('AR_CREDIT_NOTE', 'AR_RECEIPT') AND h.document_id = $3
       LIMIT 1`,
      [companyId, counterpartyId, documentCode],
    );
    return rows[0] ? openItemRow(rows[0] as Record<string, unknown>) : null;
  }

  async getOpenUnappliedCreditBalance(companyId: number, counterpartyId: number): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT GREATEST(COALESCE(SUM(
         CASE
           WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'CR'
             THEN l.base_currency_amount
           WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'DR'
             THEN -l.base_currency_amount
           ELSE 0
         END
       ), 0), 0)::float AS open_amount
       FROM ar_subledger_entry_header e
       JOIN ar_subledger_entry_line l ON l.ar_subledger_entry_header_id = e.id
       WHERE e.company_id = $1
         AND e.ar_counterparty_id = $2`,
      [companyId, counterpartyId],
    );
    return Number((rows[0] as { open_amount?: number } | undefined)?.open_amount ?? 0);
  }

  async insertArHeader(input: InsertArHeaderInput): Promise<{ id: number; code: string }> {
    const { rows } = await this.db.query(
      `INSERT INTO ar_subledger_entry_header
         (code, company_id, journal_header_id, ar_counterparty_id, document_type_code,
          document_id, description, memo, document_date, posting_date, financial_year_id,
          financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'POSTED',now(),'SYSTEM')
       RETURNING id, code`,
      [
        input.code,
        input.company_id,
        input.journal_header_id,
        input.ar_counterparty_id,
        input.document_type_code,
        input.document_id,
        input.description,
        input.memo,
        input.document_date,
        input.posting_date,
        input.financial_year_id,
        input.financial_period_id,
        input.base_currency_code,
      ],
    );
    return { id: Number(rows[0].id), code: String(rows[0].code) };
  }

  async insertArLine(input: InsertArLineInput): Promise<{ id: number; code: string }> {
    const { rows } = await this.db.query(
      `INSERT INTO ar_subledger_entry_line
         (ar_subledger_entry_header_id, line_number, line_type, description, control_account_code,
          dr_cr, quantity, unit_amount, net_amount, tax_amount, gross_amount, revenue_posting_code,
          tax_rule_code, source_entry_header_id, target_entry_header_id, base_currency_amount,
          memo, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,now(),'SYSTEM')
       RETURNING id`,
      [
        input.ar_subledger_entry_header_id,
        input.line_number,
        input.line_type,
        input.description,
        input.control_account_code,
        input.dr_cr,
        input.quantity ?? null,
        input.unit_amount ?? null,
        input.net_amount ?? null,
        input.tax_amount ?? null,
        input.gross_amount,
        input.revenue_posting_code ?? null,
        input.tax_rule_code ?? null,
        input.source_entry_header_id ?? null,
        input.target_entry_header_id ?? null,
        input.base_currency_amount,
        input.memo,
      ],
    );
    return { id: Number(rows[0].id), code: `${input.ar_subledger_entry_header_id}-${input.line_number}` };
  }

  async insertTaxHeader(input: InsertTaxHeaderInput): Promise<{ id: number; code: string }> {
    const { rows } = await this.db.query(
      `INSERT INTO tax_ledger_entry_header
         (code, company_id, journal_header_id, document_type_code, document_id,
          description, document_date, posting_date, financial_year_id,
          financial_period_id, base_currency_code, status, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'POSTED',now(),'SYSTEM')
       RETURNING id, code`,
      [
        input.code,
        input.company_id,
        input.journal_header_id,
        input.document_type_code,
        input.document_id,
        input.description,
        input.document_date,
        input.posting_date,
        input.financial_year_id,
        input.financial_period_id,
        input.base_currency_code,
      ],
    );
    return { id: Number(rows[0].id), code: String(rows[0].code) };
  }

  async insertTaxLine(input: InsertTaxLineInput): Promise<{ id: number; code: string }> {
    const { rows } = await this.db.query(
      `INSERT INTO tax_ledger_entry_line
         (tax_ledger_entry_header_id, line_number, tax_rule_id, tax_component_id,
          tax_authority_id, tax_movement_type_code, scheme_code, invoice_label,
          report_label, tax_rate, taxable_base_currency_amount, dr_cr,
          base_currency_amount, creation_date, creation_actor_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,now(),'SYSTEM')
       RETURNING id`,
      [
        input.tax_ledger_entry_header_id,
        input.line_number,
        input.tax_rule_id,
        input.tax_component_id,
        input.tax_authority_id,
        input.tax_movement_type_code,
        input.scheme_code ?? null,
        input.invoice_label ?? null,
        input.report_label ?? null,
        input.tax_rate,
        input.taxable_base_currency_amount,
        input.dr_cr,
        input.base_currency_amount,
      ],
    );
    return { id: Number(rows[0].id), code: `${input.tax_ledger_entry_header_id}-${input.line_number}` };
  }
}
