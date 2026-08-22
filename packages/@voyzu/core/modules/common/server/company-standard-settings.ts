import { getDb, type DbExecutor } from "@voyzu/capability/db";

export interface CompanySettingsUiState {
  usesOrganizationStandardSettings: boolean;
  isArchived: boolean;
  readOnly: boolean;
}

export async function getCompanySettingsUiState(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<CompanySettingsUiState> {
  const { rows } = await db.query(
    `SELECT COALESCE(c.status, 'ACTIVE') AS status, fc.use_organization_standard_settings
       FROM finance_company fc
       LEFT JOIN company c ON c.id = fc.company_id
      WHERE fc.id = $1
        AND (fc.is_template = true OR c.status != 'DELETED')`,
    [companyId],
  );
  const usesOrganizationStandardSettings = rows[0]?.use_organization_standard_settings === true;
  const isArchived = rows[0]?.status === "INACTIVE";

  return {
    usesOrganizationStandardSettings,
    isArchived,
    readOnly: usesOrganizationStandardSettings || isArchived,
  };
}

export async function companyUsesOrganizationStandardSettings(
  companyId: number,
  db: DbExecutor = getDb(),
): Promise<boolean> {
  return (await getCompanySettingsUiState(companyId, db)).usesOrganizationStandardSettings;
}
