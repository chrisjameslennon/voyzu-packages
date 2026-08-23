import { getDb, type DbExecutor } from "@voyzu/capability/db";

export interface CompanySettingsUiState {
  usesFinanceTemplateSettings: boolean;
  isArchived: boolean;
  readOnly: boolean;
}

export async function getCompanySettingsUiState(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsUiState> {
  const { rows } = await db.query(
    `SELECT COALESCE(c.status, 'ACTIVE') AS status, fc.use_finance_template_settings
       FROM finance_organization fc
       LEFT JOIN organization c ON c.id = fc.organization_id
      WHERE fc.id = $1
        AND (fc.is_template = true OR c.status != 'DELETED')`,
    [companyId],
  );
  const usesFinanceTemplateSettings = rows[0]?.use_finance_template_settings === true;
  const isArchived = rows[0]?.status === "INACTIVE";

  return {
    usesFinanceTemplateSettings,
    isArchived,
    readOnly: usesFinanceTemplateSettings || isArchived,
  };
}

export async function companyUsesOrganizationStandardSettings(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<boolean> {
  return (await getCompanySettingsUiState(companyId, db)).usesFinanceTemplateSettings;
}
