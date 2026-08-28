import type { DbExecutor } from "@voyzu/capability/db";

export interface CompanySettingsStateRow {
  id: number;
  isTemplate: boolean;
  status: string;
  useFinanceTemplateSettings: boolean;
}

export interface CompanyApiContextRow {
  companyId: number;
  companyCode: string;
}

export class SettingsScopeRepo {
  constructor(private readonly db: DbExecutor) {}

  async getTemplateCompanyId(): Promise<number | null> {
    const { rows } = await this.db.query(
      `SELECT id
       FROM finance_organization
       WHERE is_template = true
       ORDER BY id
       LIMIT 1`,
    );
    return rows[0]?.id == null ? null : Number(rows[0].id);
  }

  async getCompanySettingsState(
    companyId: number,
  ): Promise<CompanySettingsStateRow | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id, fc.is_template, COALESCE(c.status, 'ACTIVE') AS status,
              fc.use_finance_template_settings
       FROM finance_organization fc
       LEFT JOIN organization c ON c.id = fc.organization_id
       WHERE fc.id = $1 AND (fc.is_template = true OR c.status != 'DELETED')`,
      [companyId],
    );
    const row = rows[0];
    return row
      ? {
          id: Number(row.id),
          isTemplate: row.is_template === true,
          status: String(row.status),
          useFinanceTemplateSettings:
            row.use_finance_template_settings === true,
        }
      : null;
  }

  async getActiveCompanyIdByOrganizationId(
    organizationId: number,
  ): Promise<number | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id
       FROM finance_organization fc
       JOIN organization c ON c.id = fc.organization_id
       WHERE c.id = $1 AND fc.is_template = false AND c.status != 'DELETED'`,
      [organizationId],
    );
    return rows[0]?.id == null ? null : Number(rows[0].id);
  }

  async getActiveCompanyIdByCode(companyCode: string): Promise<number | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id
       FROM organization c
       JOIN finance_organization fc ON fc.organization_id = c.id
       WHERE c.code = $1 AND fc.is_template = false AND c.status != 'DELETED'`,
      [companyCode],
    );
    return rows[0]?.id == null ? null : Number(rows[0].id);
  }

  async getActiveCompanyApiContext(
    companyId: number,
  ): Promise<CompanyApiContextRow | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id, c.code
       FROM organization c
       JOIN finance_organization fc ON fc.organization_id = c.id
       WHERE fc.id = $1 AND fc.is_template = false AND c.status != 'DELETED'`,
      [companyId],
    );
    const row = rows[0];
    return row
      ? { companyId: Number(row.id), companyCode: String(row.code) }
      : null;
  }

  async listFinanceOrganizationIds(): Promise<number[]> {
    const { rows } = await this.db.query(
      `SELECT organization_id::int
       FROM finance_organization
       WHERE is_template = false AND organization_id IS NOT NULL`,
    );
    return rows.map((row) => Number(row.organization_id));
  }
}
