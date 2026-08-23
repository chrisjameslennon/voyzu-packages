import "server-only";

import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, NotFoundError } from "@voyzu/capability/errors";
import { listSelectableCompaniesForCurrentUser } from "@voyzu/erp-core/company-switcher/server";
import type { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies";
import type {
  FinanceCompanyResponseDto,
  FinanceCompanyUpdateRequestDto,
} from "@voyzu/finance/types/modules/finance-companies";
import { createCreationAuditStamp, type CreationAuditStamp } from "../../../common/server";

interface FinanceCompanyRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  country_name: string;
  base_currency_code: string;
  currency_name: string;
  status: FinanceCompanyResponseDto["status"];
  creation_date: string;
  creation_actor_type: FinanceCompanyResponseDto["audit"]["created"]["actorType"];
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: FinanceCompanyResponseDto["audit"]["updated"]["actorType"];
  updated_user_id: string | null;
  updated_mutation_id: string | null;
  finance_company_id: number | null;
  tax_filing_anchor_month: number;
  tax_filing_interval_months: 1 | 2 | 3 | 6 | 12;
  use_organization_standard_settings: boolean;
  report_line_1: string | null;
  report_line_2: string | null;
  report_footer: string | null;
  has_postings: boolean;
}

const SELECT_SQL = `
  SELECT
    c.id::int, c.code, c.name, c.country_code, country.name AS country_name,
    c.base_currency_code, currency.name AS currency_name, c.status,
    c.creation_date, c.creation_actor_type, c.creation_user_id, c.creation_mutation_id,
    c.updated_date, c.updated_actor_type, c.updated_user_id, c.updated_mutation_id,
    fc.id::int AS finance_company_id,
    COALESCE(fc.tax_filing_anchor_month, finance_country.tax_filing_anchor_month, 3)::int AS tax_filing_anchor_month,
    COALESCE(fc.tax_filing_interval_months, finance_country.tax_filing_interval_months, 3)::int AS tax_filing_interval_months,
    COALESCE(fc.use_organization_standard_settings, true) AS use_organization_standard_settings,
    fc.report_line_1, fc.report_line_2, fc.report_footer,
    EXISTS (SELECT 1 FROM journal_header j WHERE j.finance_company_id = fc.id) AS has_postings
  FROM company c
  JOIN country ON country.code = c.country_code
  JOIN currency ON currency.code = c.base_currency_code
  LEFT JOIN finance_country ON finance_country.code = c.country_code
  LEFT JOIN finance_company fc ON fc.company_id = c.id AND fc.is_template = false
`;

function toDto(row: FinanceCompanyRow): FinanceCompanyResponseDto {
  return {
    id: Number(row.id),
    code: row.code,
    name: row.name,
    countryCode: row.country_code,
    country: { code: row.country_code, name: row.country_name },
    baseCurrencyCode: row.base_currency_code,
    baseCurrency: { code: row.base_currency_code, name: row.currency_name },
    status: row.status,
    audit: {
      created: {
        date: row.creation_date,
        actorType: row.creation_actor_type,
        ...(row.creation_user_id != null && { userId: row.creation_user_id }),
        mutationId: row.creation_mutation_id,
      },
      updated: {
        date: row.updated_date,
        actorType: row.updated_actor_type,
        ...(row.updated_user_id != null && { userId: row.updated_user_id }),
        mutationId: row.updated_mutation_id,
      },
    },
    financeCompanyId: row.finance_company_id == null ? null : Number(row.finance_company_id),
    financeEnabled: row.finance_company_id != null,
    taxFilingAnchorMonth: Number(row.tax_filing_anchor_month),
    taxFilingIntervalMonths: Number(row.tax_filing_interval_months) as 1 | 2 | 3 | 6 | 12,
    useOrganizationStandardSettings: row.use_organization_standard_settings,
    ...(row.report_line_1 != null && { reportLine1: row.report_line_1 }),
    ...(row.report_line_2 != null && { reportLine2: row.report_line_2 }),
    ...(row.report_footer != null && { reportFooter: row.report_footer }),
    hasPostings: row.has_postings,
  };
}

async function findByCode(code: string, db: DbExecutor): Promise<FinanceCompanyResponseDto | null> {
  const { rows } = await db.query(
    `${SELECT_SQL} WHERE c.code = $1 AND c.status != 'DELETED'`,
    [code],
  );
  return rows[0] ? toDto(rows[0] as unknown as FinanceCompanyRow) : null;
}

export async function listFinanceCompanies(): Promise<FinanceCompanyResponseDto[]> {
  const { rows } = await getDb().query(
    `${SELECT_SQL} WHERE c.status != 'DELETED' ORDER BY c.code`,
  );
  return rows.map((row) => toDto(row as unknown as FinanceCompanyRow));
}

export function getFinanceCompany(code: string): Promise<FinanceCompanyResponseDto | null> {
  return findByCode(code, getDb());
}

export async function listSelectableFinanceCompaniesForCurrentUser(): Promise<CompanyResponseDto[]> {
  const accessibleCompanies = await listSelectableCompaniesForCurrentUser();
  if (accessibleCompanies.length === 0) return [];
  const { rows } = await getDb().query(
    `SELECT company_id::int
     FROM finance_company
     WHERE is_template = false AND company_id IS NOT NULL`,
  );
  const financeCompanyIds = new Set(rows.map((row) => Number(row.company_id)));
  return accessibleCompanies.filter((company) => financeCompanyIds.has(company.id));
}

export async function resolveFinanceCompanySelectionForCurrentUser(requestedCompanyId: number | null) {
  const companies = await listSelectableFinanceCompaniesForCurrentUser();
  const selectedCompany = companies.find((company) => company.id === requestedCompanyId)
    ?? companies[0]
    ?? null;
  return { companies, selectedCompany };
}

async function createFiscalCalendar(
  financeCompanyId: number,
  startMonth: string,
  audit: CreationAuditStamp,
  db: DbExecutor,
): Promise<void> {
  await db.query(
    `WITH settings AS (
       SELECT CASE $2
         WHEN 'JAN' THEN 1 WHEN 'FEB' THEN 2 WHEN 'MAR' THEN 3 WHEN 'APR' THEN 4
         WHEN 'MAY' THEN 5 WHEN 'JUN' THEN 6 WHEN 'JUL' THEN 7 WHEN 'AUG' THEN 8
         WHEN 'SEP' THEN 9 WHEN 'OCT' THEN 10 WHEN 'NOV' THEN 11 WHEN 'DEC' THEN 12
         ELSE 1 END AS start_month
     ), years AS (
       SELECT generate_series(EXTRACT(YEAR FROM CURRENT_DATE)::int - 2,
                              EXTRACT(YEAR FROM CURRENT_DATE)::int + 5) AS financial_year
     ), proposed AS (
       SELECT years.financial_year,
         make_date(years.financial_year - CASE WHEN settings.start_month = 1 THEN 0 ELSE 1 END,
                   settings.start_month, 1) AS start_date
       FROM years CROSS JOIN settings
     )
     INSERT INTO fiscal_year (
       finance_company_id, code, name, start_date, end_date, status,
       creation_actor_type, creation_user_id, creation_mutation_id,
       updated_actor_type, updated_user_id, updated_mutation_id
     )
     SELECT $1, 'FY-' || financial_year, 'Financial Year ' || financial_year,
       start_date, (start_date + INTERVAL '1 year - 1 day')::date,
       CASE WHEN (start_date + INTERVAL '1 year - 1 day')::date < CURRENT_DATE THEN 'INACTIVE'
            WHEN start_date <= CURRENT_DATE THEN 'OPEN' ELSE 'PLANNED' END,
       $3, $4, $5::uuid, $3, $4, $5::uuid
     FROM proposed
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, startMonth, audit.actorType, audit.userId, audit.mutationId],
  );

  await db.query(
    `WITH proposed AS (
       SELECT fy.finance_company_id, fy.id AS fiscal_year_id,
         month_start::date AS start_date,
         (month_start + INTERVAL '1 month - 1 day')::date AS end_date
       FROM fiscal_year fy
       CROSS JOIN LATERAL generate_series(
         date_trunc('month', fy.start_date::timestamp),
         date_trunc('month', fy.end_date::timestamp), INTERVAL '1 month'
       ) AS month_start
       WHERE fy.finance_company_id = $1 AND fy.status = 'OPEN'
     )
     INSERT INTO fiscal_period (
       finance_company_id, fiscal_year_id, code, name, start_date, end_date, status,
       creation_actor_type, creation_user_id, creation_mutation_id,
       updated_actor_type, updated_user_id, updated_mutation_id
     )
     SELECT finance_company_id, fiscal_year_id, upper(to_char(start_date, 'MON')),
       trim(to_char(start_date, 'Month')), start_date, end_date, 'OPEN',
       $2, $3, $4::uuid, $2, $3, $4::uuid
     FROM proposed
     ON CONFLICT (fiscal_year_id, code) DO NOTHING`,
    [financeCompanyId, audit.actorType, audit.userId, audit.mutationId],
  );
}

export async function activateFinanceCompany(code: string): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    await db.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`voyzu.finance-company.${code}`]);
    const { rows } = await db.query(
      `SELECT c.id::int, c.status, fc.financial_period_start_month,
              fc.tax_filing_anchor_month::int, fc.tax_filing_interval_months::int
       FROM company c
       LEFT JOIN finance_country fc ON fc.code = c.country_code
       WHERE c.code = $1 AND c.status != 'DELETED'
       FOR UPDATE OF c`,
      [code],
    );
    const company = rows[0];
    if (!company) throw new NotFoundError(`Company ${code} not found`);
    if (company.status !== "ACTIVE") {
      throw new BusinessRuleError("Only an active organization company can be enabled for Finance");
    }
    if (!company.financial_period_start_month) {
      throw new BusinessRuleError(`Finance country settings are not configured for company ${code}`);
    }

    const inserted = await db.query(
      `INSERT INTO finance_company (
         company_id, tax_filing_anchor_month, tax_filing_interval_months,
         use_organization_standard_settings, is_template
       ) VALUES ($1, $2, $3, true, false)
       ON CONFLICT (company_id) DO NOTHING
       RETURNING id::int`,
      [company.id, company.tax_filing_anchor_month, company.tax_filing_interval_months],
    );
    let financeCompanyId = inserted.rows[0]?.id == null ? null : Number(inserted.rows[0].id);
    if (!financeCompanyId) {
      const existing = await db.query(
        "SELECT id::int FROM finance_company WHERE company_id = $1 AND is_template = false",
        [company.id],
      );
      financeCompanyId = existing.rows[0]?.id == null ? null : Number(existing.rows[0].id);
    }
    if (!financeCompanyId) throw new BusinessRuleError(`Unable to enable company ${code} for Finance`);

    await createFiscalCalendar(
      financeCompanyId,
      String(company.financial_period_start_month),
      await createCreationAuditStamp(),
      db,
    );
    const result = await findByCode(code, db);
    if (!result) throw new NotFoundError(`Company ${code} not found after Finance activation`);
    return result;
  });
}

async function copyTemplateSettings(financeCompanyId: number, db: DbExecutor): Promise<void> {
  const template = await db.query("SELECT id::int FROM finance_company WHERE is_template = true ORDER BY id LIMIT 1");
  const templateId = template.rows[0]?.id == null ? null : Number(template.rows[0].id);
  if (!templateId) throw new BusinessRuleError("Finance template is not configured");

  await db.query(
    `INSERT INTO gl_account_category (finance_company_id, code, name, account_type, sequence, status)
     SELECT $1, code, name, account_type, sequence, status FROM gl_account_category
     WHERE finance_company_id = $2 AND status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO gl_account (finance_company_id, code, name, account_type, account_category_id, status)
     SELECT $1, source.code, source.name, source.account_type, target_category.id, source.status
     FROM gl_account source
     LEFT JOIN gl_account_category source_category
       ON source_category.finance_company_id = source.finance_company_id AND source_category.id = source.account_category_id
     LEFT JOIN gl_account_category target_category
       ON target_category.finance_company_id = $1 AND target_category.code = source_category.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  for (const table of ["ar_control_account", "ap_control_account"] as const) {
    await db.query(
      `INSERT INTO ${table} (finance_company_id, code, ledger, name, gl_account_id, status)
       SELECT $1, source.code, source.ledger, source.name, target_gl.id, source.status
       FROM ${table} source
       JOIN gl_account source_gl ON source_gl.finance_company_id = source.finance_company_id AND source_gl.id = source.gl_account_id
       JOIN gl_account target_gl ON target_gl.finance_company_id = $1 AND target_gl.code = source_gl.code
       WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
       ON CONFLICT (finance_company_id, code) DO NOTHING`,
      [financeCompanyId, templateId],
    );
  }
  await db.query(
    `INSERT INTO tax_control_account (finance_company_id, code, ledger, name, description, tax_family_code, gl_account_id, status)
     SELECT $1, source.code, source.ledger, source.name, source.description, source.tax_family_code, target_gl.id, source.status
     FROM tax_control_account source
     JOIN gl_account source_gl ON source_gl.finance_company_id = source.finance_company_id AND source_gl.id = source.gl_account_id
     JOIN gl_account target_gl ON target_gl.finance_company_id = $1 AND target_gl.code = source_gl.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO inventory_control_account (finance_company_id, code, ledger, name, description, gl_account_id, status)
     SELECT $1, source.code, source.ledger, source.name, source.description, target_gl.id, source.status
     FROM inventory_control_account source
     JOIN gl_account source_gl ON source_gl.finance_company_id = source.finance_company_id AND source_gl.id = source.gl_account_id
     JOIN gl_account target_gl ON target_gl.finance_company_id = $1 AND target_gl.code = source_gl.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO bank_cash_control_account (
       finance_company_id, code, ledger, type, gl_account_id, bank_name, bank_branch_name,
       bank_account_identifier, cash_account_identifier, status
     )
     SELECT $1, source.code, source.ledger, source.type, target_gl.id, source.bank_name,
       source.bank_branch_name, source.bank_account_identifier, source.cash_account_identifier, source.status
     FROM bank_cash_control_account source
     JOIN gl_account source_gl ON source_gl.finance_company_id = source.finance_company_id AND source_gl.id = source.gl_account_id
     JOIN gl_account target_gl ON target_gl.finance_company_id = $1 AND target_gl.code = source_gl.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO dimension (finance_company_id, code, name, status)
     SELECT $1, code, name, status FROM dimension
     WHERE finance_company_id = $2 AND status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO dimension_value (finance_company_id, dimension_id, name, status)
     SELECT $1, target_dimension.id, source_value.name, source_value.status
     FROM dimension_value source_value
     JOIN dimension source_dimension ON source_dimension.finance_company_id = source_value.finance_company_id AND source_dimension.id = source_value.dimension_id
     JOIN dimension target_dimension ON target_dimension.finance_company_id = $1 AND target_dimension.code = source_dimension.code
     WHERE source_value.finance_company_id = $2 AND source_value.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, dimension_id, lower(name)) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO financial_document_default (
       finance_company_id, document_code, code, name, target_type, allowed_account_types,
       override_property_name, override_scope, gl_account_id, bank_cash_control_account_id, status
     )
     SELECT $1, source.document_code, source.code, source.name, source.target_type, source.allowed_account_types,
       source.override_property_name, source.override_scope, target_gl.id, target_bank.id, source.status
     FROM financial_document_default source
     LEFT JOIN gl_account source_gl ON source_gl.finance_company_id = source.finance_company_id AND source_gl.id = source.gl_account_id
     LEFT JOIN gl_account target_gl ON target_gl.finance_company_id = $1 AND target_gl.code = source_gl.code
     LEFT JOIN bank_cash_control_account source_bank ON source_bank.finance_company_id = source.finance_company_id AND source_bank.id = source.bank_cash_control_account_id
     LEFT JOIN bank_cash_control_account target_bank ON target_bank.finance_company_id = $1 AND target_bank.code = source_bank.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, document_code, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO item_posting_profile (
       finance_company_id, code, name, description, is_sold, is_purchased, is_consumed,
       revenue_gl_account_id, cogs_gl_account_id, purchase_expense_gl_account_id,
       consumption_gl_account_id, adjustment_gain_gl_account_id, adjustment_loss_gl_account_id, status
     )
     SELECT $1, source.code, source.name, source.description, source.is_sold, source.is_purchased, source.is_consumed,
       revenue_target.id, cogs_target.id, purchase_target.id, consumption_target.id, gain_target.id, loss_target.id, source.status
     FROM item_posting_profile source
     LEFT JOIN gl_account revenue_source ON revenue_source.finance_company_id = source.finance_company_id AND revenue_source.id = source.revenue_gl_account_id
     LEFT JOIN gl_account revenue_target ON revenue_target.finance_company_id = $1 AND revenue_target.code = revenue_source.code
     LEFT JOIN gl_account cogs_source ON cogs_source.finance_company_id = source.finance_company_id AND cogs_source.id = source.cogs_gl_account_id
     LEFT JOIN gl_account cogs_target ON cogs_target.finance_company_id = $1 AND cogs_target.code = cogs_source.code
     LEFT JOIN gl_account purchase_source ON purchase_source.finance_company_id = source.finance_company_id AND purchase_source.id = source.purchase_expense_gl_account_id
     LEFT JOIN gl_account purchase_target ON purchase_target.finance_company_id = $1 AND purchase_target.code = purchase_source.code
     LEFT JOIN gl_account consumption_source ON consumption_source.finance_company_id = source.finance_company_id AND consumption_source.id = source.consumption_gl_account_id
     LEFT JOIN gl_account consumption_target ON consumption_target.finance_company_id = $1 AND consumption_target.code = consumption_source.code
     LEFT JOIN gl_account gain_source ON gain_source.finance_company_id = source.finance_company_id AND gain_source.id = source.adjustment_gain_gl_account_id
     LEFT JOIN gl_account gain_target ON gain_target.finance_company_id = $1 AND gain_target.code = gain_source.code
     LEFT JOIN gl_account loss_source ON loss_source.finance_company_id = source.finance_company_id AND loss_source.id = source.adjustment_loss_gl_account_id
     LEFT JOIN gl_account loss_target ON loss_target.finance_company_id = $1 AND loss_target.code = loss_source.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO inventory_category (finance_company_id, code, name, description, posting_profile_id, status)
     SELECT $1, source.code, source.name, source.description, target_profile.id, source.status
     FROM inventory_category source
     JOIN item_posting_profile source_profile ON source_profile.finance_company_id = source.finance_company_id AND source_profile.id = source.posting_profile_id
     JOIN item_posting_profile target_profile ON target_profile.finance_company_id = $1 AND target_profile.code = source_profile.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
  await db.query(
    `INSERT INTO inventory_item (
       finance_company_id, code, name, description, item_type, category_id, unit_code,
       status, quantity_on_hand_derived, book_value_derived, avg_unit_book_value_derived
     )
     SELECT $1, source.code, source.name, source.description, source.item_type, target_category.id,
       source.unit_code, source.status, source.quantity_on_hand_derived, source.book_value_derived,
       source.avg_unit_book_value_derived
     FROM inventory_item source
     JOIN inventory_category source_category ON source_category.finance_company_id = source.finance_company_id AND source_category.id = source.category_id
     JOIN inventory_category target_category ON target_category.finance_company_id = $1 AND target_category.code = source_category.code
     WHERE source.finance_company_id = $2 AND source.status = 'ACTIVE'
     ON CONFLICT (finance_company_id, code) DO NOTHING`,
    [financeCompanyId, templateId],
  );
}

export async function updateFinanceCompany(
  code: string,
  input: FinanceCompanyUpdateRequestDto,
): Promise<FinanceCompanyResponseDto> {
  return withTransaction(async (db) => {
    const current = await findByCode(code, db);
    if (!current) throw new NotFoundError(`Company ${code} not found`);
    if (!current.financeCompanyId) throw new BusinessRuleError(`Company ${code} is not enabled for Finance`);
    if (!current.useOrganizationStandardSettings && input.useOrganizationStandardSettings) {
      throw new BusinessRuleError("A company cannot be re-coupled to Finance Admin standard settings");
    }

    if (current.useOrganizationStandardSettings && !input.useOrganizationStandardSettings) {
      await copyTemplateSettings(current.financeCompanyId, db);
    }

    await db.query(
      `UPDATE finance_company SET
         tax_filing_anchor_month = $2,
         tax_filing_interval_months = $3,
         use_organization_standard_settings = $4,
         report_line_1 = NULLIF($5, ''), report_line_2 = NULLIF($6, ''),
         report_footer = NULLIF($7, '')
       WHERE id = $1`,
      [
        current.financeCompanyId,
        input.taxFilingAnchorMonth,
        input.taxFilingIntervalMonths,
        input.useOrganizationStandardSettings,
        input.reportLine1 ?? "",
        input.reportLine2 ?? "",
        input.reportFooter ?? "",
      ],
    );
    const updated = await findByCode(code, db);
    if (!updated) throw new NotFoundError(`Company ${code} not found after update`);
    return updated;
  });
}
