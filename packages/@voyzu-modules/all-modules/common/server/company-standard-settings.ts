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
    `SELECT status, use_organization_standard_settings
       FROM company
      WHERE id = $1
        AND status != 'DELETED'`,
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
