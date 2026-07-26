import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";
import type { AccountType } from "@voyzu/types/modules/core";
import type { ActorType } from "@voyzu/types/modules/core";
import type { UpdateAuditStamp } from "../../../server";

import type { GlAccountLookupRow, TaxControlAccountRow } from "./tax-control-account.row.types";

const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
    SELECT DISTINCT posting_company.code
    FROM company source_company
    JOIN company posting_company ON (
      (source_company.is_template = true
        AND posting_company.organization_id = source_company.organization_id
        AND posting_company.is_template = false
        AND posting_company.status != 'DELETED'
        AND posting_company.use_organization_standard_settings = true)
      OR (source_company.is_template = false AND posting_company.id = source_company.id)
    )
    JOIN journal_line jl ON jl.gl_account_id = tmt.gl_account_id
    JOIN journal_header jh ON jh.id = jl.journal_header_id
      AND jh.company_id = posting_company.id
      AND jh.status = 'POSTED'
    WHERE source_company.id = tmt.company_id
    ORDER BY posting_company.code
  ), ARRAY[]::text[])`;

const SELECT_COLUMNS = `
  tmt.company_id::int AS company_id,
  tmt.code,
  tmt.ledger,
  tmt.name,
  tmt.description,
  tmt.tax_family_code,
  tmt.gl_account_id::int AS gl_account_id,
  ga.code AS gl_account_code,
  ga.name AS gl_account_name,
  ga.account_type AS gl_account_type,
  tmt.status,
  tmt.creation_date,
  tmt.creation_actor_type,
  tmt.creation_user_id,
  tmt.creation_mutation_id,
  tmt.updated_date,
  tmt.updated_actor_type,
  tmt.updated_user_id,
  tmt.updated_mutation_id,
  ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
`;

function mapRow(row: Record<string, unknown>): TaxControlAccountRow {
  const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
  return {
    company_id: Number(row.company_id),
    code: String(row.code),
    ledger: "TAX",
    name: String(row.name),
    description: String(row.description),
    tax_family_code: String(row.tax_family_code),
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    gl_account_type: String(row.gl_account_type) as AccountType,
    status: String(row.status),
    has_postings: companiesWithPostings.length > 0,
    companies_with_postings: companiesWithPostings,
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    creation_actor_type: row.creation_actor_type as ActorType,
    creation_user_id: row.creation_user_id == null ? null : String(row.creation_user_id),
    creation_mutation_id: row.creation_mutation_id == null ? null : String(row.creation_mutation_id),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
    updated_actor_type: row.updated_actor_type as ActorType,
    updated_user_id: row.updated_user_id == null ? null : String(row.updated_user_id),
    updated_mutation_id: row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  };
}

export class TaxControlAccountRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(companyId: number): Promise<TaxControlAccountRow[]> {
    const { rows } = await this.db.query(
      `SELECT ${SELECT_COLUMNS}
       FROM tax_control_account tmt
       JOIN gl_account ga ON ga.company_id = tmt.company_id AND ga.id = tmt.gl_account_id
       WHERE tmt.company_id = $1
       ORDER BY
         CASE tmt.code
           WHEN 'TAX_ON_SALES' THEN 1
           WHEN 'TAX_ON_PURCHASES' THEN 2
           ELSE 99
         END`,
      [companyId],
    );
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async get(companyId: number, code: string): Promise<TaxControlAccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT ${SELECT_COLUMNS}
       FROM tax_control_account tmt
       JOIN gl_account ga ON ga.company_id = tmt.company_id AND ga.id = tmt.gl_account_id
       WHERE tmt.company_id = $1
         AND tmt.code = $2`,
      [companyId, code],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async getGlAccount(companyId: number, id: number): Promise<GlAccountLookupRow | null> {
    const { rows } = await this.db.query(
      `SELECT id::int, account_type, status
       FROM gl_account
       WHERE company_id = $1
         AND id = $2`,
      [companyId, id],
    );
    if (!rows[0]) return null;
    return {
      id: Number(rows[0].id),
      account_type: String(rows[0].account_type) as AccountType,
      status: String(rows[0].status) as GlAccountLookupRow["status"],
    };
  }

  async patchGlAccount(companyId: number, code: string, glAccountId: number, audit: UpdateAuditStamp): Promise<TaxControlAccountRow> {
    await this.db.query(
      `UPDATE tax_control_account
       SET gl_account_id = $3,
           updated_date = $4::timestamptz,
           updated_actor_type = $5::actor_type,
           updated_user_id = $6,
           updated_mutation_id = $7::uuid
       WHERE company_id = $1
         AND code = $2`,
      [companyId, code, glAccountId, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
    const row = await this.get(companyId, code);
    if (!row) throw new Error(`Tax control account ${code} not found after update`);
    return row;
  }
}
